import * as THREE from 'three';
import { gsap } from 'gsap';
import { Linen } from './Linen.js';
import { Bubbles } from './Bubbles.js';
import { disposeObject } from './dispose.js';
import { createSceneState } from './state.js';
import { sceneTheme } from './themes.js';

/** Per-tier budgets: the low tier keeps phones and integrated GPUs at 60fps. */
const TIERS = {
    high: { linenSegments: 140, bubbles: 36, maxPixelRatio: 2, antialias: true },
    low: { linenSegments: 56, bubbles: 14, maxPixelRatio: 1.5, antialias: false },
};

/**
 * Owns the single persistent WebGL canvas: renderer, camera, scene objects and the render loop.
 *
 * Scroll animations never touch three.js directly; they tween plain numbers in `experience.state`
 * (see resources/js/animations/), and the render loop reads them every frame.
 */
export class Experience {
    /**
     * @param {{
     *   canvas: HTMLCanvasElement,
     *   brand: Record<string, string>,  raw brand hex colors (config.js readBrand)
     *   theme: 'dark' | 'light',
     *   tier: 'high' | 'low',
     *   reducedMotion: boolean,
     *   pointerParallax: boolean,
     *   state?: ReturnType<typeof createSceneState>,
     * }} options
     */
    constructor({ canvas, brand, theme, tier, reducedMotion, pointerParallax, state }) {
        this.canvas = canvas;
        this.budget = TIERS[tier] ?? TIERS.low;
        this.reducedMotion = reducedMotion;
        this.pointerParallax = pointerParallax && !reducedMotion;
        this.elapsed = 0;
        this.isPaused = false;

        // Adaptive resolution: if the device can't hold ~45fps, render at a lower pixel ratio.
        this.qualityScale = 1;
        this.perf = { frames: 0, seconds: 0, warmup: 3 };

        // Reduced motion: render only when the state actually changes (see tick()).
        this.lastSignature = NaN;

        // Theme color roles as THREE.Color instances. Materials hold references to these objects,
        // so setTheme() can recolor the whole scene by updating them in place.
        this.brand = brand;
        this.theme = sceneTheme(brand, theme);
        this.colors = Object.fromEntries(Object.entries(this.theme.colors).map(([role, hex]) => [role, new THREE.Color(hex)]));

        /** Animatable state. Everything here is a plain number so GSAP can tween it. */
        this.state = state ?? createSceneState();

        this.pointer = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
        this.loadingManager = new THREE.LoadingManager();

        this.setupRenderer();
        this.setupScene();
        this.bindEvents();
        this.resize();

        this.tick = this.tick.bind(this);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: this.budget.antialias,
            alpha: false,
            powerPreference: 'high-performance',
        });
        this.renderer.setClearColor(this.colors.background, 1);
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
        this.lookTarget = new THREE.Vector3();

        // The rig separates responsive layout (set in applyLayout) from scroll-driven offsets (state).
        this.linenRig = new THREE.Group();
        this.scene.add(this.linenRig);

        this.linen = new Linen({ colors: this.colors, segments: this.budget.linenSegments });
        this.linenRig.add(this.linen.mesh);

        if (this.budget.bubbles > 0) {
            this.bubbles = new Bubbles({ colors: this.colors, count: this.budget.bubbles });
            this.scene.add(this.bubbles.mesh);
        }
    }

    bindEvents() {
        this.onResize = debounce(() => this.resize(), 150);
        window.addEventListener('resize', this.onResize);

        this.onVisibilityChange = () => {
            this.isPaused = document.hidden;
        };
        document.addEventListener('visibilitychange', this.onVisibilityChange);

        if (this.pointerParallax) {
            this.onPointerMove = (event) => {
                this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.pointer.y = -((event.clientY / window.innerHeight) * 2 - 1);
            };
            window.addEventListener('pointermove', this.onPointerMove, { passive: true });
        }

        // If the GPU drops the context, let the browser restore it instead of leaving a dead canvas.
        this.canvas.addEventListener('webglcontextlost', (event) => event.preventDefault());
    }

    getPixelRatio() {
        const ratio = Math.min(window.devicePixelRatio || 1, this.budget.maxPixelRatio);

        return Math.max(0.75, ratio * this.qualityScale);
    }

    resize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const pixelRatio = this.getPixelRatio();

        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height, false);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.applyLayout();
        this.lastSignature = NaN; // force a redraw
    }

    /** Responsive base placement: linen sits right of the headline on wide screens, behind it on narrow ones. */
    applyLayout() {
        const isWide = this.camera.aspect > 1.1;

        this.layout = {
            linen: isWide ? { x: 2.55, y: 0.05, scale: 0.8 } : { x: 0.95, y: 2.5, scale: 0.5 },
        };
        this.linenRig.scale.setScalar(this.layout.linen.scale);
    }

    /**
     * Recolors the scene for the light or dark theme without rebuilding anything.
     *
     * @param {'dark' | 'light'} theme
     */
    setTheme(theme) {
        this.theme = sceneTheme(this.brand, theme);

        // Cross-fade every color role, in step with the CSS transition on the page (app.css).
        const target = new THREE.Color();
        Object.entries(this.theme.colors).forEach(([role, hex]) => {
            target.set(hex);
            gsap.to(this.colors[role], {
                r: target.r,
                g: target.g,
                b: target.b,
                duration: this.reducedMotion ? 0 : 0.45,
                ease: 'power2.out',
                overwrite: true,
                onUpdate: () => {
                    this.renderer.setClearColor(this.colors.background, 1);
                    this.lastSignature = NaN; // reduced-motion mode renders on demand
                },
            });
        });
    }

    /** Pre-compiles shaders and renders one frame, so the preloader hides a fully warmed-up scene. */
    async warmUp() {
        if (this.renderer.compileAsync) {
            await this.renderer.compileAsync(this.scene, this.camera);
        } else {
            this.renderer.compile(this.scene, this.camera);
        }

        this.update(0);
        this.renderer.render(this.scene, this.camera);
    }

    start() {
        gsap.ticker.add(this.tick);
    }

    stop() {
        gsap.ticker.remove(this.tick);
    }

    /**
     * Driven by GSAP's ticker, so rendering, Lenis and ScrollTrigger share one rAF.
     *
     * @param {number} _time
     * @param {number} deltaMs
     */
    tick(_time, deltaMs) {
        if (this.isPaused) {
            return;
        }

        // Reduced motion: nothing moves on its own, so skip frames where the state is unchanged.
        if (this.reducedMotion) {
            const signature = stateSignature(this.state);

            if (signature === this.lastSignature) {
                return;
            }

            this.lastSignature = signature;
        }

        // Clamp delta so a long frame doesn't make the cloth jump.
        const delta = Math.min(deltaMs / 1000, 1 / 20);
        this.update(delta);
        this.renderer.render(this.scene, this.camera);
        this.monitorPerformance(deltaMs);
    }

    /**
     * Averages the frame rate over 2-second windows and steps the resolution down
     * (never up, to avoid oscillating) when the GPU is struggling.
     *
     * @param {number} deltaMs
     */
    monitorPerformance(deltaMs) {
        const perf = this.perf;

        // Ignore huge gaps (tab switches, breakpoints) and the warm-up/intro period.
        if (deltaMs > 250) {
            return;
        }

        perf.seconds += deltaMs / 1000;

        if (perf.warmup > 0) {
            perf.warmup -= deltaMs / 1000;
            perf.seconds = 0;

            return;
        }

        perf.frames += 1;

        if (perf.seconds < 2) {
            return;
        }

        const fps = perf.frames / perf.seconds;
        perf.frames = 0;
        perf.seconds = 0;

        if (fps < 45 && this.qualityScale > 0.55) {
            this.qualityScale -= 0.15;
            this.resize();
        }
    }

    /** @param {number} delta  seconds since last frame */
    update(delta) {
        const { state } = this;

        // Reduced motion: freeze ambient animation; scroll-driven state still applies.
        this.elapsed += this.reducedMotion ? 0 : delta;

        // Smooth the pointer with frame-rate independent damping.
        const damping = 1 - Math.exp(-delta * 3.5);
        this.pointer.smoothX += (this.pointer.x - this.pointer.smoothX) * damping;
        this.pointer.smoothY += (this.pointer.y - this.pointer.smoothY) * damping;

        // `intro` is layered on top of the scroll-driven values so the entrance never fights ScrollTrigger.
        const { intro } = state;

        this.camera.position.set(
            state.camera.x + this.pointer.smoothX * 0.35,
            state.camera.y + this.pointer.smoothY * 0.22,
            state.camera.z + intro.z,
        );
        this.lookTarget.set(state.target.x, state.target.y, state.target.z);
        this.camera.lookAt(this.lookTarget);

        const { linen: layoutLinen } = this.layout;
        this.linenRig.position.set(layoutLinen.x + state.linen.x, layoutLinen.y + state.linen.y, state.linen.z);
        this.linenRig.rotation.y = state.linen.rotationY + this.pointer.smoothX * 0.08;
        this.linen.update(this.elapsed, state.linen, intro.reveal);

        this.bubbles?.update(this.elapsed, state.bubbles, intro.reveal);
    }

    destroy() {
        this.stop();
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('pointermove', this.onPointerMove);
        document.removeEventListener('visibilitychange', this.onVisibilityChange);

        disposeObject(this.scene);
        this.renderer.dispose();
    }
}

/** Cheap fingerprint of every number in the scene state, used to detect changes. */
function stateSignature(state) {
    let signature = 0;
    let weight = 1;

    for (const branch of Object.values(state)) {
        for (const value of Object.values(branch)) {
            // GSAP adds a `_gsap` cache object to tweened targets; only numbers count.
            if (typeof value === 'number') {
                signature += value * weight;
                weight += 0.618;
            }
        }
    }

    return signature;
}

function debounce(callback, wait) {
    let timeout;

    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), wait);
    };
}
