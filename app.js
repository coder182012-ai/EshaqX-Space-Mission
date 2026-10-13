
/* ============================================================
   ASTROVIA — SPACE MISSION SIMULATOR
   Three.js r160 compatible
   Educational Newtonian flight and orbital simulation

   Replace your existing app.js with this file.
   ============================================================ */

(() => {
    "use strict";

    // ----------------------------------------------------------
    // 1. CONFIGURATION
    // ----------------------------------------------------------

    const CONFIG = {
        AU_KM: 149597870.7,
        EARTH_RADIUS_KM: 6371,
        EARTH_MU: 398600.4418,
        SUN_MU: 1.32712440018e11,
        G0: 9.80665,

        // Visual scale only; physics uses km, seconds and kg.
        AU_SCALE: 30,
        EARTH_VISUAL_RADIUS: 45,

        MAX_FRAME_DT: 0.05,
        MAX_PHYSICS_STEP: 2,
        STAR_COUNT: 4500
    };

    const PLANETS = {
        Mercury: {
            a: 0.3871, period: 87.969, radius: 2439.7,
            mu: 22032, color: 0xaaa49b,
            type: "Terrestrial planet", diameter: "4,879 km",
            mass: "3.30 × 10²³ kg", gravity: "3.70 m/s²",
            distance: "0.387 AU", rotation: "58.6 Earth days",
            orbit: "88 Earth days", temperature: "167°C average",
            moons: "0", phase: 0.8,
            description: "The smallest planet, orbiting closest to the Sun."
        },
        Venus: {
            a: 0.7233, period: 224.701, radius: 6051.8,
            mu: 324859, color: 0xd9ad75,
            type: "Terrestrial planet", diameter: "12,104 km",
            mass: "4.87 × 10²⁴ kg", gravity: "8.87 m/s²",
            distance: "0.723 AU", rotation: "243 Earth days",
            orbit: "225 Earth days", temperature: "465°C average",
            moons: "0", phase: 2.1,
            description: "A hot world with a thick carbon-dioxide atmosphere."
        },
        Earth: {
            a: 1, period: 365.256, radius: 6371,
            mu: 398600.4418, color: 0x318be8,
            type: "Terrestrial planet", diameter: "12,742 km",
            mass: "5.97 × 10²⁴ kg", gravity: "9.81 m/s²",
            distance: "1 AU", rotation: "23 h 56 min",
            orbit: "365.25 days", temperature: "15°C average",
            moons: "1", phase: 0,
            description: "Our home planet, with liquid-water oceans and a protective atmosphere."
        },
        Mars: {
            a: 1.5237, period: 686.98, radius: 3389.5,
            mu: 42828.4, color: 0xd66b4b,
            type: "Terrestrial planet", diameter: "6,779 km",
            mass: "6.42 × 10²³ kg", gravity: "3.71 m/s²",
            distance: "1.524 AU", rotation: "24 h 37 min",
            orbit: "687 Earth days", temperature: "-65°C average",
            moons: "2", phase: 3.2,
            description: "A cold desert world and an important target for robotic and future crewed missions."
        },
        Jupiter: {
            a: 5.2044, period: 4332.59, radius: 69911,
            mu: 126686534, color: 0xd8b18a,
            type: "Gas giant", diameter: "139,820 km",
            mass: "1.90 × 10²⁷ kg", gravity: "24.79 m/s²",
            distance: "5.20 AU", rotation: "9 h 56 min",
            orbit: "11.86 Earth years", temperature: "-110°C cloud tops",
            moons: "95+", phase: 4.4,
            description: "The largest planet, known for its bands and enormous storms."
        },
        Saturn: {
            a: 9.5826, period: 10759.22, radius: 58232,
            mu: 37931187, color: 0xd8c08d,
            type: "Gas giant", diameter: "116,460 km",
            mass: "5.68 × 10²⁶ kg", gravity: "10.44 m/s²",
            distance: "9.58 AU", rotation: "About 10.7 hours",
            orbit: "29.4 Earth years", temperature: "-140°C cloud tops",
            moons: "146+", phase: 5.1,
            description: "A gas giant surrounded by a spectacular system of rings."
        },
        Uranus: {
            a: 19.2184, period: 30688.5, radius: 25362,
            mu: 5793939, color: 0x85d6d6,
            type: "Ice giant", diameter: "50,724 km",
            mass: "8.68 × 10²⁵ kg", gravity: "8.69 m/s²",
            distance: "19.2 AU", rotation: "About 17.2 hours",
            orbit: "84 Earth years", temperature: "-195°C average",
            moons: "28+", phase: 5.8,
            description: "An ice giant with an extreme axial tilt."
        },
        Neptune: {
            a: 30.1104, period: 60182, radius: 24622,
            mu: 6836529, color: 0x426cf5,
            type: "Ice giant", diameter: "49,244 km",
            mass: "1.02 × 10²⁶ kg", gravity: "11.15 m/s²",
            distance: "30.1 AU", rotation: "About 16.1 hours",
            orbit: "165 Earth years", temperature: "-200°C average",
            moons: "16+", phase: 1.4,
            description: "A distant ice giant with powerful winds."
        }
    };

    const MOON = {
        a: 384400 / CONFIG.AU_KM,
        period: 27.3217,
        radius: 1737.4,
        mu: 4902.8,
        color: 0xb8b8b8,
        phase: 1.2
    };

    const PARTS = {
        nose:          { name: "Nose Cone", mass: 200, fuel: 0, thrust: 0 },
        capsule:       { name: "Crew Capsule", mass: 1800, fuel: 0, thrust: 0 },
        "fuel-small":  { name: "Small Fuel Tank", mass: 900, fuel: 3500, thrust: 0 },
        "fuel-large":  { name: "Large Fuel Tank", mass: 2200, fuel: 10000, thrust: 0 },
        engine:        { name: "Main Engine", mass: 1500, fuel: 0, thrust: 850, isp: 300 },
        "vacuum-engine": { name: "Vacuum Engine", mass: 800, fuel: 0, thrust: 450, isp: 350 },
        booster:       { name: "Solid Booster", mass: 1000, fuel: 1800, thrust: 500, isp: 240 },
        decoupler:     { name: "Decoupler", mass: 100, fuel: 0, thrust: 0 },
        heatshield:    { name: "Heat Shield", mass: 500, fuel: 0, thrust: 0 },
        "landing-legs": { name: "Landing Legs", mass: 300, fuel: 0, thrust: 0 },
        parachute:     { name: "Parachute", mass: 100, fuel: 0, thrust: 0 },
        rcs:           { name: "RCS Thrusters", mass: 150, fuel: 0, thrust: 0 },
        "solar-panel": { name: "Solar Panels", mass: 120, fuel: 0, thrust: 0 },
        antenna:       { name: "Antenna", mass: 30, fuel: 0, thrust: 0 },
        "docking-port": { name: "Docking Port", mass: 100, fuel: 0, thrust: 0 }
    };

    const $ = id => document.getElementById(id);

    const clamp = (value, min, max) =>
        Math.max(min, Math.min(max, value));

    const lerp = (a, b, t) => a + (b - a) * t;

    const fmt = (value, digits = 1) =>
        Number.isFinite(value) ? value.toFixed(digits) : "—";

    // ----------------------------------------------------------
    // 2. APPLICATION STATE
    // ----------------------------------------------------------

    const state = {
        ready: false,
        paused: false,
        speed: 1,
        activeSection: "solar-system",
        simDays: 0,

        selectedPlanet: "Earth",
        mission: "orbit",

        rocketParts: [],
        flightActive: false,
        phase: "idle", // idle, launch, orbit, transfer, arrived

        ignition: false,
        countdownRunning: false,
        countdown: 0,

        throttle: 0,
        stage: 1,
        rcs: false,
        landingGear: false,

        altitude: 0,          // km above Earth
        verticalVelocity: 0,  // m/s
        horizontalVelocity: 0,// m/s
        fuel: 0,               // kg
        maxFuel: 0,             // kg
        dryMass: 8000,          // kg
        mass: 8000,             // kg
        thrust: 0,              // kN
        isp: 300,               // seconds
        missionTime: 0,

        pitch: 0,
        heading: 0,

        heliocentricPosition: null, // km
        heliocentricVelocity: null, // km/s
        launchDirection: 1,
        destination: null,

        arrivalNotified: false,
        lastTime: 0,
        pointerDown: null
    };

    // ----------------------------------------------------------
    // 3. THREE.JS OBJECTS
    // ----------------------------------------------------------

    let scene;
    let camera;
    let renderer;
    let raycaster;
    let mouse;

    let solarSystemGroup;
    let launchGroup;
    let rocket;
    let rocketCore;
    let mainFlame;
    let mainFlameLight;

    let earthGlobe;
    let launchPad;
    let launchTower;

    const celestialBodies = new Map();
    const planetVisuals = new Map();
    const orbitLines = [];
    const boosterGroups = [];
    const smokeParticles = [];

    let cameraTarget = null;
    let cameraYaw = 0.3;
    let cameraPitch = 0.25;
    let cameraDistance = 110;
    let dragging = false;
    let dragStart = null;
    let suppressClick = false;
    let lastFrame = 0;
    let countdownInterval = null;
    let notificationTimeout = null;

    const worldUp = new THREE.Vector3(0, 1, 0);
    const tmpVec = new THREE.Vector3();

    // ----------------------------------------------------------
    // 4. STARTUP
    // ----------------------------------------------------------

    document.addEventListener("DOMContentLoaded", init);

    function init() {
        if (!window.THREE) {
            showNotification("Three.js did not load. Check your internet connection.");
            return;
        }

        try {
            initThree();
            createStarField();
            createSolarSystem();
            createLaunchEnvironment();
            initInterface();
            loadSavedRocket();
            updateBuilder();
            activateSection("solar-system");
            startLoadingScreen();

            state.ready = true;
            lastFrame = performance.now();
            requestAnimationFrame(animate);
        } catch (error) {
            console.error("Astrovia initialization failed:", error);
            showNotification("Initialization error. Open the browser console for details.");
        }
    }

    function initThree() {
        const container = $("three-container");
        if (!container) throw new Error("Missing #three-container");

        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x030712);
        scene.fog = new THREE.FogExp2(0x030712, 0.00006);

        camera = new THREE.PerspectiveCamera(
            55,
            Math.max(1, container.clientWidth) /
                Math.max(1, container.clientHeight),
            0.1,
            100000
        );

        camera.position.set(0, 35, 150);

        renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        container.appendChild(renderer.domElement);

        scene.add(new THREE.HemisphereLight(0x8ca9ff, 0x111827, 1.2));

        const sunLight = new THREE.PointLight(0xffedc0, 3.2, 0, 1.4);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);

        solarSystemGroup = new THREE.Group();
        scene.add(solarSystemGroup);

        launchGroup = new THREE.Group();
        launchGroup.visible = false;
        scene.add(launchGroup);

        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();

        renderer.domElement.addEventListener("pointerdown", onPointerDown);
        renderer.domElement.addEventListener("pointermove", onPointerMove);
        renderer.domElement.addEventListener("pointerup", onPointerUp);
        renderer.domElement.addEventListener("pointercancel", onPointerUp);
        renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
        renderer.domElement.addEventListener("click", onCanvasClick);

        window.addEventListener("resize", resizeRenderer);
    }

    function startLoadingScreen() {
        const screen = $("loading-screen");
        const bar = $("loading-progress-bar");

        if (bar) bar.style.width = "100%";

        window.setTimeout(() => {
            if (screen) {
                screen.style.opacity = "0";
                screen.style.transition = "opacity 0.5s ease";
                window.setTimeout(() => screen.remove(), 550);
            }
        }, 350);
    }

    // ----------------------------------------------------------
    // 5. SOLAR SYSTEM
    // ----------------------------------------------------------

    function createSolarSystem() {
        const sunGeometry = new THREE.SphereGeometry(8, 48, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({
            color: 0xffcc65
        });

        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        sun.userData = { name: "Sun", isSun: true };
        solarSystemGroup.add(sun);
        celestialBodies.set("Sun", sun);

        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(10, 32, 24),
            new THREE.MeshBasicMaterial({
                color: 0xffa63d,
                transparent: true,
                opacity: 0.12,
                side: THREE.BackSide,
                depthWrite: false
            })
        );
        sun.add(glow);

        for (const [name, data] of Object.entries(PLANETS)) {
            const distance = data.a * CONFIG.AU_SCALE;
            const visualRadius = getVisualPlanetRadius(name);

            const material = new THREE.MeshStandardMaterial({
                color: data.color,
                roughness: name === "Earth" ? 0.85 : 0.95,
                metalness: 0.02
            });

            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(visualRadius, 32, 24),
                material
            );

            sphere.castShadow = true;
            sphere.receiveShadow = true;
            sphere.userData = {
                name,
                distance,
                a: data.a,
                period: data.period,
                phase: data.phase,
                visualRadius,
                isPlanet: true
            };

            solarSystemGroup.add(sphere);
            celestialBodies.set(name, sphere);
            planetVisuals.set(name, sphere);

            const orbit = createOrbitLine(distance, 0x30405e);
            solarSystemGroup.add(orbit);
            orbitLines.push(orbit);

            if (name === "Earth") addEarthVisuals(sphere);
            if (name === "Saturn") addSaturnRings(sphere);
        }

        // The Moon is a child of Earth, so its orbit is not updated twice.
        const earth = celestialBodies.get("Earth");
        const moon = new THREE.Mesh(
            new THREE.SphereGeometry(1.35, 24, 16),
            new THREE.MeshStandardMaterial({
                color: MOON.color,
                roughness: 1
            })
        );
        moon.userData = { name: "Moon", isPlanet: true, isMoon: true };
        earth.add(moon);
        celestialBodies.set("Moon", moon);
    }

    function getVisualPlanetRadius(name) {
        const radii = {
            Mercury: 1.2,
            Venus: 2.0,
            Earth: 2.2,
            Mars: 1.6,
            Jupiter: 5.6,
            Saturn: 4.9,
            Uranus: 3.3,
            Neptune: 3.2
        };
        return radii[name] || 2;
    }

    function createOrbitLine(radius, color) {
        const points = [];
        const segments = 180;

        for (let i = 0; i <= segments; i++) {
            const angle = i / segments * Math.PI * 2;
            points.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                0,
                Math.sin(angle) * radius
            ));
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color,
            transparent: true,
            opacity: 0.45
        });

        return new THREE.LineLoop(geometry, material);
    }

    function addEarthVisuals(earth) {
        const clouds = new THREE.Mesh(
            new THREE.SphereGeometry(2.26, 32, 24),
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.13,
                roughness: 1
            })
        );
        earth.add(clouds);

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(2.36, 32, 24),
            new THREE.MeshBasicMaterial({
                color: 0x319bff,
                transparent: true,
                opacity: 0.13,
                side: THREE.BackSide,
                depthWrite: false
            })
        );
        earth.add(atmosphere);
    }

    function addSaturnRings(saturn) {
        const ring = new THREE.Mesh(
            new THREE.RingGeometry(6.0, 9.0, 80),
            new THREE.MeshStandardMaterial({
                color: 0xc8b38e,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.72,
                roughness: 1
            })
        );
        ring.rotation.x = Math.PI / 2.3;
        saturn.add(ring);
    }

    function createStarField() {
        const positions = new Float32Array(CONFIG.STAR_COUNT * 3);
        const colors = new Float32Array(CONFIG.STAR_COUNT * 3);

        for (let i = 0; i < CONFIG.STAR_COUNT; i++) {
            const radius = 700 + Math.random() * 2200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = radius * Math.cos(phi);
            positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

            const brightness = 0.45 + Math.random() * 0.55;
            colors[i * 3] = brightness;
            colors[i * 3 + 1] = brightness;
            colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 1.25,
            vertexColors: true,
            sizeAttenuation: true
        });

        scene.add(new THREE.Points(geometry, material));
    }

    function getPlanetAngle(name) {
        const data = PLANETS[name];
        if (!data) return 0;
        return data.phase + state.simDays / data.period * Math.PI * 2;
    }

    function getPlanetPositionKm(name) {
        const data = PLANETS[name];
        if (!data) return new THREE.Vector3();

        const angle = getPlanetAngle(name);
        return new THREE.Vector3(
            Math.cos(angle) * data.a * CONFIG.AU_KM,
            0,
            Math.sin(angle) * data.a * CONFIG.AU_KM
        );
    }

    function updatePlanetPositions() {
        for (const [name, mesh] of planetVisuals) {
            const data = PLANETS[name];
            const angle = getPlanetAngle(name);
            const distance = data.a * CONFIG.AU_SCALE;

            mesh.position.set(
                Math.cos(angle) * distance,
                0,
                Math.sin(angle) * distance
            );

            mesh.rotation.y += 0.001;
        }

        const earth = planetVisuals.get("Earth");
        const moon = celestialBodies.get("Moon");

        if (earth && moon) {
            const angle = MOON.phase +
                state.simDays / MOON.period * Math.PI * 2;

            moon.position.set(
                Math.cos(angle) * 4.3,
                0.2,
                Math.sin(angle) * 4.3
            );
        }
    }

    // ----------------------------------------------------------
    // 6. EARTH LAUNCH COMPLEX
    // ----------------------------------------------------------

    function createLaunchEnvironment() {
        // Earth is centered below the launchpad so its upper surface
        // is approximately y = 0 in launch-scene coordinates.
        const earth = new THREE.Mesh(
            new THREE.SphereGeometry(
                CONFIG.EARTH_VISUAL_RADIUS,
                64,
                40
            ),
            new THREE.MeshStandardMaterial({
                color: 0x245fa4,
                roughness: 0.95,
                metalness: 0
            })
        );

        earth.position.set(0, -CONFIG.EARTH_VISUAL_RADIUS, 0);
        earth.receiveShadow = true;
        launchGroup.add(earth);
        earthGlobe = earth;

        const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(46.5, 48, 32),
            new THREE.MeshBasicMaterial({
                color: 0x48aaff,
                transparent: true,
                opacity: 0.17,
                side: THREE.BackSide,
                depthWrite: false
            })
        );
        atmosphere.position.copy(earth.position);
        launchGroup.add(atmosphere);

        // Simple terrain and pad area.
        const ground = new THREE.Mesh(
            new THREE.CylinderGeometry(48, 48, 1.5, 64),
            new THREE.MeshStandardMaterial({
                color: 0x233a32,
                roughness: 1
            })
        );
        ground.position.y = -0.6;
        ground.receiveShadow = true;
        launchGroup.add(ground);

        const pad = new THREE.Mesh(
            new THREE.CylinderGeometry(7, 8, 1.2, 32),
            new THREE.MeshStandardMaterial({
                color: 0x697586,
                roughness: 0.85,
                metalness: 0.35
            })
        );
        pad.position.set(0, 0.2, 0);
        pad.receiveShadow = true;
        launchGroup.add(pad);
        launchPad = pad;

        // Pad markings.
        const markingMaterial = new THREE.MeshBasicMaterial({
            color: 0xe5edf7
        });

        for (let i = -2; i <= 2; i++) {
            const stripe = new THREE.Mesh(
                new THREE.BoxGeometry(0.16, 0.025, 9),
                markingMaterial
            );
            stripe.position.set(i * 1.1, 0.82, 0);
            launchGroup.add(stripe);
        }

        // Flame trench.
        const trench = new THREE.Mesh(
            new THREE.BoxGeometry(5, 0.5, 13),
            new THREE.MeshStandardMaterial({
                color: 0x111827,
                roughness: 1
            })
        );
        trench.position.set(0, -0.15, 5);
        launchGroup.add(trench);

        createLaunchTower();
        createLaunchLighting();
        createLaunchHorizon();

        launchGroup.visible = false;
    }

    function createLaunchTower() {
        launchTower = new THREE.Group();

        const steel = new THREE.MeshStandardMaterial({
            color: 0x8594a8,
            metalness: 0.65,
            roughness: 0.4
        });

        const darkSteel = new THREE.MeshStandardMaterial({
            color: 0x354357,
            metalness: 0.5,
            roughness: 0.6
        });

        const towerX = -10;
        const towerZ = 0;

        // Four vertical supports.
        for (const xOffset of [-1.4, 1.4]) {
            for (const zOffset of [-1.4, 1.4]) {
                const post = new THREE.Mesh(
                    new THREE.BoxGeometry(0.35, 24, 0.35),
                    steel
                );
                post.position.set(
                    towerX + xOffset,
                    12,
                    towerZ + zOffset
                );
                post.castShadow = true;
                launchTower.add(post);
            }
        }

        // Cross-braces.
        for (let y = 3; y <= 21; y += 3) {
            const beam = new THREE.Mesh(
                new THREE.BoxGeometry(3.1, 0.25, 0.25),
                darkSteel
            );
            beam.position.set(towerX, y, towerZ - 1.4);
            launchTower.add(beam);

            const cross = new THREE.Mesh(
                new THREE.BoxGeometry(0.25, 0.25, 3.1),
                darkSteel
            );
            cross.position.set(towerX, y, towerZ);
            launchTower.add(cross);
        }

        // Access platforms.
        for (const y of [7, 13, 19]) {
            const platform = new THREE.Mesh(
                new THREE.BoxGeometry(6, 0.3, 4.2),
                darkSteel
            );
            platform.position.set(towerX + 2.5, y, 0);
            launchTower.add(platform);
        }

        // Crew access arm.
        const arm = new THREE.Mesh(
            new THREE.BoxGeometry(8, 0.6, 0.7),
            steel
        );
        arm.position.set(-4.6, 15, 0);
        launchTower.add(arm);

        launchGroup.add(launchTower);
    }

    function createLaunchLighting() {
        for (const x of [-14, 14]) {
            const pole = new THREE.Mesh(
                new THREE.CylinderGeometry(0.12, 0.18, 12, 8),
                new THREE.MeshStandardMaterial({
                    color: 0x596579,
                    metalness: 0.5
                })
            );
            pole.position.set(x, 6, -7);
            launchGroup.add(pole);

            const light = new THREE.PointLight(0x9fcfff, 2, 35);
            light.position.set(x, 12, -7);
            launchGroup.add(light);

            const lamp = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.4, 0.8),
                new THREE.MeshBasicMaterial({ color: 0xd9edff })
            );
            lamp.position.copy(light.position);
            launchGroup.add(lamp);
        }

        launchGroup.add(new THREE.AmbientLight(0xffffff, 0.45));
    }

    function createLaunchHorizon() {
        // Distant curved horizon is implied by the Earth globe.
        // Low buildings make the launch complex look grounded.
        const buildingMaterial = new THREE.MeshStandardMaterial({
            color: 0x526273,
            roughness: 0.9
        });

        for (let i = 0; i < 8; i++) {
            const width = 3 + Math.random() * 4;
            const height = 2 + Math.random() * 5;
            const depth = 3 + Math.random() * 4;

            const building = new THREE.Mesh(
                new THREE.BoxGeometry(width, height, depth),
                buildingMaterial
            );

            const angle = (i / 8) * Math.PI * 2;
            const radius = 34 + Math.random() * 5;

            building.position.set(
                Math.cos(angle) * radius,
                height / 2 - 0.2,
                Math.sin(angle) * radius
            );

            launchGroup.add(building);
        }
    }

    // ----------------------------------------------------------
    // 7. ROCKET BUILDER
    // ----------------------------------------------------------

    function initBuilder() {
        document.querySelectorAll("[data-part]").forEach(button => {
            button.addEventListener("click", () => {
                const type = button.dataset.part;
                if (!PARTS[type]) return;

                state.rocketParts.push(type);
                updateBuilder();
                showNotification(PARTS[type].name + " added.");
            });
        });

        if ($("clear-rocket")) {
            $("clear-rocket").addEventListener("click", () => {
                state.rocketParts = [];
                updateBuilder();
                showNotification("Rocket design cleared.");
            });
        }

        if ($("save-rocket")) {
            $("save-rocket").addEventListener("click", saveRocket);
        }

        if ($("launch-rocket")) {
            $("launch-rocket").addEventListener("click", prepareLaunch);
        }
    }

    function updateBuilder() {
        const container = $("builder-rocket");

        if (container) {
            container.replaceChildren();

            if (!state.rocketParts.length) {
                const empty = document.createElement("p");
                empty.className = "empty-builder";
                empty.textContent = "Select components to build your rocket.";
                container.appendChild(empty);
            } else {
                state.rocketParts.forEach((type, index) => {
                    const part = PARTS[type];
                    const item = document.createElement("button");

                    item.type = "button";
                    item.className = "rocket-part-item";
                    item.title = "Click to remove " + part.name;
                    item.textContent = `${index + 1}. ${part.name}`;

                    item.addEventListener("click", () => {
                        state.rocketParts.splice(index, 1);
                        updateBuilder();
                    });

                    container.appendChild(item);
                });
            }
        }

        const counts = {
            fuel: 0,
            thrust: 0,
            dryMass: 8000,
            engines: 0,
            stages: 1
        };

        state.rocketParts.forEach(type => {
            const part = PARTS[type];
            if (!part) return;

            counts.dryMass += part.mass;
            counts.fuel += part.fuel;
            counts.thrust += part.thrust;

            if (part.thrust > 0) counts.engines++;
            if (type === "decoupler") counts.stages++;
        });

        state.dryMass = counts.dryMass;
        state.maxFuel = counts.fuel;
        state.thrust = counts.thrust;
        state.isp = getEngineIsp();
        state.mass = state.dryMass + state.maxFuel;

        setText("vehicle-parts", state.rocketParts.length);
        setText("vehicle-stages", counts.stages);
        setText("vehicle-mass", `${Math.round(state.mass).toLocaleString()} kg`);
        setText("vehicle-fuel", `${Math.round(state.maxFuel).toLocaleString()} kg`);
        setText("vehicle-thrust", `${Math.round(state.thrust).toLocaleString()} kN`);

        // Ideal rocket equation. This estimate ignores gravity and drag losses.
        const dv = state.maxFuel > 0 && state.thrust > 0
            ? state.isp * CONFIG.G0 *
              Math.log((state.dryMass + state.maxFuel) / state.dryMass)
            : 0;

        setText("vehicle-dv", `${Math.round(dv).toLocaleString()} m/s`);
    }

    function getEngineIsp() {
        const engines = state.rocketParts
            .map(type => PARTS[type])
            .filter(part => part && part.thrust > 0);

        if (!engines.length) return 300;

        return engines.reduce((sum, engine) => sum + (engine.isp || 300), 0)
            / engines.length;
    }

    function saveRocket() {
        try {
            localStorage.setItem(
                "astroviaRocketParts",
                JSON.stringify(state.rocketParts)
            );
            showNotification("Rocket design saved on this device.");
        } catch (error) {
            console.warn("Could not save rocket:", error);
            showNotification("Saving is unavailable in this browser.");
        }
    }

    function loadSavedRocket() {
        try {
            const saved = localStorage.getItem("astroviaRocketParts");
            if (!saved) return;

            const parts = JSON.parse(saved);
            if (!Array.isArray(parts)) return;

            state.rocketParts = parts.filter(type => Boolean(PARTS[type]));
        } catch (error) {
            console.warn("Saved rocket could not be loaded:", error);
        }
    }

    // ----------------------------------------------------------
    // 8. ROCKET 3D MODEL
    // ----------------------------------------------------------

    function createFlightRocket() {
        if (rocket) {
            launchGroup.remove(rocket);
            disposeObject(rocket);
            rocket = null;
        }

        boosterGroups.length = 0;
        rocket = new THREE.Group();
        rocket.name = "AstroviaSpacecraft";

        const white = new THREE.MeshStandardMaterial({
            color: 0xe9eef5,
            metalness: 0.25,
            roughness: 0.45
        });

        const dark = new THREE.MeshStandardMaterial({
            color: 0x343f50,
            metalness: 0.65,
            roughness: 0.4
        });

        const metallic = new THREE.MeshStandardMaterial({
            color: 0x9caec1,
            metalness: 0.8,
            roughness: 0.3
        });

        const orange = new THREE.MeshStandardMaterial({
            color: 0xe88a38,
            metalness: 0.2,
            roughness: 0.55
        });

        // Main tank and lower stage.
        const tank = new THREE.Mesh(
            new THREE.CylinderGeometry(1.15, 1.15, 8.5, 24),
            white
        );
        tank.position.y = 6.2;
        tank.castShadow = true;
        rocket.add(tank);

        const orangeBand = new THREE.Mesh(
            new THREE.CylinderGeometry(1.18, 1.18, 0.8, 24),
            orange
        );
        orangeBand.position.y = 5.3;
        rocket.add(orangeBand);

        const interstage = new THREE.Mesh(
            new THREE.CylinderGeometry(0.95, 1.2, 1.3, 24),
            dark
        );
        interstage.position.y = 1.6;
        rocket.add(interstage);

        // Upper stage.
        const upperTank = new THREE.Mesh(
            new THREE.CylinderGeometry(0.78, 0.78, 4, 24),
            metallic
        );
        upperTank.position.y = 12.4;
        rocket.add(upperTank);

        const upperBand = new THREE.Mesh(
            new THREE.CylinderGeometry(0.81, 0.81, 0.25, 24),
            dark
        );
        upperBand.position.y = 10.5;
        rocket.add(upperBand);

        // Crew capsule.
        const capsule = new THREE.Mesh(
            new THREE.CylinderGeometry(0.75, 0.95, 1.7, 24),
            white
        );
        capsule.position.y = 15.1;
        rocket.add(capsule);

        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.75, 1.8, 24),
            metallic
        );
        nose.position.y = 16.85;
        rocket.add(nose);

        const window = new THREE.Mesh(
            new THREE.SphereGeometry(0.28, 16, 12),
            new THREE.MeshStandardMaterial({
                color: 0x4dc6ff,
                emissive: 0x12334d,
                metalness: 0.8,
                roughness: 0.15
            })
        );
        window.scale.set(1, 0.8, 0.3);
        window.position.set(0, 15.15, 0.72);
        rocket.add(window);

        // Engine mount and nozzle.
        const mount = new THREE.Mesh(
            new THREE.CylinderGeometry(1.1, 0.85, 1.1, 24),
            dark
        );
        mount.position.y = 0.5;
        rocket.add(mount);

        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.48, 0.78, 1.8, 24, 1, true),
            metallic
        );
        nozzle.position.y = -0.8;
        rocket.add(nozzle);

        // Engine flame.
        mainFlame = new THREE.Mesh(
            new THREE.ConeGeometry(0.58, 4.5, 24),
            new THREE.MeshBasicMaterial({
                color: 0x45baff,
                transparent: true,
                opacity: 0.88,
                depthWrite: false
            })
        );
        mainFlame.position.y = -3.6;
        mainFlame.visible = false;
        rocket.add(mainFlame);

        mainFlameLight = new THREE.PointLight(0x56aaff, 0, 25);
        mainFlameLight.position.y = -2;
        rocket.add(mainFlameLight);

        // Four aerodynamic fins.
        for (let i = 0; i < 4; i++) {
            const fin = new THREE.Mesh(
                new THREE.BoxGeometry(0.18, 2.0, 1.3),
                dark
            );
            const angle = i * Math.PI / 2;

            fin.position.set(
                Math.sin(angle) * 1.15,
                1.4,
                Math.cos(angle) * 1.15
            );
            fin.rotation.y = angle;
            rocket.add(fin);
        }

        // Side boosters: visually and physically separated at staging.
        const boosterCount = Math.max(
            2,
            Math.min(4, state.rocketParts.filter(p => p === "booster").length * 2)
        );

        for (let i = 0; i < boosterCount; i++) {
            const angle = i / boosterCount * Math.PI * 2;
            const booster = createBooster(angle);
            boosterGroups.push(booster);
            rocket.add(booster);
        }

        // Antenna and small details.
        const antenna = new THREE.Mesh(
            new THREE.CylinderGeometry(0.035, 0.035, 1.4, 8),
            metallic
        );
        antenna.position.set(0.45, 16.2, 0);
        rocket.add(antenna);

        rocket.position.set(0, 2.1, 0);
        rocket.rotation.set(0, 0, 0);

        launchGroup.add(rocket);
        rocketCore = tank;

        return rocket;
    }

    function createBooster(angle) {
        const booster = new THREE.Group();

        const x = Math.cos(angle) * 2.0;
        const z = Math.sin(angle) * 2.0;

        const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.42, 0.48, 7.5, 16),
            new THREE.MeshStandardMaterial({
                color: 0xe6e9ef,
                metalness: 0.2,
                roughness: 0.5
            })
        );
        body.position.y = 5.2;
        booster.add(body);

        const nose = new THREE.Mesh(
            new THREE.ConeGeometry(0.42, 1.1, 16),
            new THREE.MeshStandardMaterial({ color: 0xe88a38 })
        );
        nose.position.y = 9.5;
        booster.add(nose);

        const nozzle = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.35, 1, 16, 1, true),
            new THREE.MeshStandardMaterial({
                color: 0x8293a6,
                metalness: 0.85
            })
        );
        nozzle.position.y = 1.0;
        booster.add(nozzle);

        const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.3, 2.8, 16),
            new THREE.MeshBasicMaterial({
                color: 0xff9a3c,
                transparent: true,
                opacity: 0.85,
                depthWrite: false
            })
        );
        flame.position.y = -1.1;
        flame.visible = false;
        booster.add(flame);

        booster.position.set(x, 0, z);
        booster.userData = {
            separated: false,
            velocity: new THREE.Vector3(),
            flame
        };

        return booster;
    }

    function disposeObject(object) {
        object.traverse(child => {
            if (child.geometry) child.geometry.dispose();

            if (child.material) {
                const materials = Array.isArray(child.material)
                    ? child.material
                    : [child.material];

                materials.forEach(material => material.dispose());
            }
        });
    }

    // ----------------------------------------------------------
    // 9. INTERFACE AND NAVIGATION
    // ----------------------------------------------------------

    function initInterface() {
        initBuilder();

        document.querySelectorAll("[data-section]").forEach(button => {
            button.addEventListener("click", () => {
                activateSection(button.dataset.section);
            });
        });

        document.querySelectorAll("[data-close-panel]").forEach(button => {
            button.addEventListener("click", () => {
                const panel = button.closest(".interface-panel");
                if (panel) panel.classList.remove("visible");
            });
        });

        document.querySelectorAll("[data-speed]").forEach(button => {
            button.addEventListener("click", () => {
                state.speed = Number(button.dataset.speed);
                state.paused = state.speed === 0;
                updatePauseButton();
                showNotification(
                    state.paused ? "Simulation paused." :
                    `Simulation speed: ${state.speed}×`
                );
            });
        });

        if ($("pause-button")) {
            $("pause-button").addEventListener("click", togglePause);
        }

        if ($("settings-button")) {
            $("settings-button").addEventListener("click", () => {
                showNotification("Drag to rotate. Scroll to zoom. Use the flight controls during a mission.");
            });
        }

        if ($("throttle")) {
            $("throttle").addEventListener("input", event => {
                state.throttle = clamp(Number(event.target.value), 0, 100);
                updateTelemetry();
            });
        }

        if ($("ignition-button")) {
            $("ignition-button").addEventListener("click", toggleIgnition);
        }

        if ($("stage-button")) {
            $("stage-button").addEventListener("click", stageRocket);
        }

        if ($("rcs-button")) {
            $("rcs-button").addEventListener("click", () => {
                state.rcs = !state.rcs;
                showNotification(state.rcs ? "RCS enabled." : "RCS disabled.");
            });
        }

        if ($("landing-gear-button")) {
            $("landing-gear-button").addEventListener("click", () => {
                state.landingGear = !state.landingGear;
                showNotification(
                    state.landingGear ? "Landing gear deployed." : "Landing gear retracted."
                );
            });
        }

        document.querySelectorAll("[data-control]").forEach(button => {
            button.addEventListener("click", () => {
                applyAttitudeControl(button.dataset.control);
            });
        });

        document.querySelectorAll("[data-mission]").forEach(button => {
            button.addEventListener("click", () => {
                startMission(button.dataset.mission);
            });
        });

        if ($("station-docking-button")) {
            $("station-docking-button").addEventListener("click", () => {
                showNotification("Docking practice is a visual demonstration, not a validated rendezvous calculation.");
            });
        }

        window.addEventListener("keydown", onKeyDown);
    }

    function activateSection(section) {
        const valid = [
            "solar-system", "planet-explorer", "rocket-builder",
            "missions", "station", "flight", "theories"
        ];

        if (!valid.includes(section)) return;

        state.activeSection = section;

        document.querySelectorAll("[data-section]").forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.section === section
            );
        });

        const panelMap = {
            "solar-system": "solar-system-panel",
            "planet-explorer": "planet-panel",
            "rocket-builder": "rocket-builder-panel",
            "missions": "missions-panel",
            "station": "station-panel",
            "flight": "flight-hud",
            "theories": "theories-panel"
        };

        Object.values(panelMap).forEach(id => {
            const panel = $(id);
            if (panel) panel.classList.remove("visible");
        });

        const panel = $(panelMap[section]);
        if (panel) panel.classList.add("visible");

        const isFlight = section === "flight";
        launchGroup.visible = isFlight && state.flightActive;
        solarSystemGroup.visible = !isFlight || state.phase === "transfer" ||
            state.phase === "arrived";

        setText(
            "current-mode",
            section.replaceAll("-", " ").toUpperCase()
        );

        if (isFlight) {
            if (!rocket && state.flightActive) createFlightRocket();
            if (rocket && state.phase === "launch") {
                cameraTarget = rocket.position;
            } else if (rocket && state.phase === "transfer") {
                cameraTarget = rocket.position;
            }
        } else if (section === "planet-explorer") {
            selectPlanet(state.selectedPlanet);
        }

        updateCamera();
    }

    function selectPlanet(name) {
        if (name === "Sun") {
            showNotification("The Sun is a star, not a planet.");
            return;
        }

        if (name === "Moon") {
            showNotification("Moon selected. Use the lunar mission to plan a journey there.");
        } else if (!PLANETS[name]) {
            return;
        }

        state.selectedPlanet = name;

        const data = name === "Moon" ? {
            type: "Natural satellite",
            diameter: "3,475 km",
            mass: "7.35 × 10²² kg",
            gravity: "1.62 m/s²",
            distance: "384,400 km from Earth",
            rotation: "27.3 Earth days",
            orbit: "27.3 Earth days",
            temperature: "-20°C average (varies greatly)",
            moons: "Not applicable",
            description: "Earth's natural satellite."
        } : PLANETS[name];

        setText("planet-name", name);
        setText("planet-type", data.type);
        setText("planet-description", data.description);
        setText("planet-diameter", data.diameter);
        setText("planet-mass", data.mass);
        setText("planet-gravity", data.gravity);
        setText("planet-distance", data.distance);
        setText("planet-rotation", data.rotation);
        setText("planet-orbit", data.orbit);
        setText("planet-temperature", data.temperature);
        setText("planet-moons", data.moons);

        const body = celestialBodies.get(name);
        if (body) {
            cameraTarget = body.getWorldPosition(new THREE.Vector3());
            const radius = body.userData.visualRadius || 3;
            cameraDistance = Math.max(12, radius * 5);
            updateCamera();
        }
    }

    // ----------------------------------------------------------
    // 10. MISSION SETUP
    // ----------------------------------------------------------

    function startMission(mission) {
        const missionTargets = {
            orbit: "Earth",
            moon: "Moon",
            mars: "Mars",
            station: "Earth",
            satellite: "Earth",
            "deep-space": "Neptune"
        };

        if (!(mission in missionTargets)) return;

        state.mission = mission;
        state.destination = missionTargets[mission];

        setText(
            "flight-mission-name",
            mission.replaceAll("-", " ").replace(/\b\w/g, c => c.toUpperCase())
        );

        if (mission === "orbit" || mission === "station" || mission === "satellite") {
            showNotification("Earth mission selected. Prepare a rocket with fuel and an engine.");
        } else {
            showNotification(`Destination selected: ${state.destination}.`);
        }

        if (!state.rocketParts.length) {
            activateSection("rocket-builder");
            showNotification("Add a fuel tank and an engine before launching.");
            return;
        }

        activateSection("flight");
        prepareLaunch();
    }

    function prepareLaunch() {
        const hasFuel = state.rocketParts.some(type =>
            PARTS[type] && PARTS[type].fuel > 0
        );

        const hasEngine = state.rocketParts.some(type =>
            PARTS[type] && PARTS[type].thrust > 0
        );

        if (!state.rocketParts.length || !hasFuel || !hasEngine) {
            showNotification("Your rocket needs at least one fuel tank and one engine.");
            activateSection("rocket-builder");
            return;
        }

        resetFlight();
        createFlightRocket();

        state.flightActive = true;
        state.phase = "launch";
        state.destination = state.destination || "Earth";

        launchGroup.visible = true;
        solarSystemGroup.visible = false;

        activateSection("flight");
        launchGroup.visible = true;
        solarSystemGroup.visible = false;

        cameraTarget = rocket.position;
        cameraDistance = 75;
        updateCamera();

        beginCountdown();
    }

    function resetFlight() {
        stopCountdown();
        clearSmoke();

        state.ignition = false;
        state.countdownRunning = false;
        state.countdown = 0;
        state.stage = 1;
        state.throttle = 0;
        state.altitude = 0;
        state.verticalVelocity = 0;
        state.horizontalVelocity = 0;
        state.missionTime = 0;
        state.fuel = state.maxFuel;
        state.mass = state.dryMass + state.fuel;
        state.pitch = 0;
        state.heading = 0;
        state.phase = "launch";
        state.arrivalNotified = false;
        state.heliocentricPosition = null;
        state.heliocentricVelocity = null;

        if ($("throttle")) $("throttle").value = "0";

        if (mainFlame) mainFlame.visible = false;
        if (mainFlameLight) mainFlameLight.intensity = 0;
    }

    function beginCountdown() {
        stopCountdown();

        const overlay = $("countdown-overlay");
        if (overlay) overlay.hidden = false;

        state.countdownRunning = true;
        state.countdown = 5;
        setText("countdown-number", state.countdown);

        countdownInterval = window.setInterval(() => {
            if (state.paused) return;

            state.countdown--;

            if (state.countdown <= 0) {
                stopCountdown();
                if (overlay) overlay.hidden = true;
                igniteRocket();
                showEvent("LIFTOFF — ENGINES IGNITED");
            } else {
                setText("countdown-number", state.countdown);
            }
        }, 1000);
    }

    function stopCountdown() {
        if (countdownInterval !== null) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }

        state.countdownRunning = false;

        const overlay = $("countdown-overlay");
        if (overlay) overlay.hidden = true;
    }

    function toggleIgnition() {
        if (!state.flightActive) {
            showNotification("Select a mission and prepare a launch first.");
            return;
        }

        if (state.phase === "transfer") {
            state.ignition = !state.ignition;
            showNotification(state.ignition ? "Transfer burn enabled." : "Engine cutoff.");
            return;
        }

        if (state.phase !== "launch" && state.phase !== "orbit") return;

        if (state.fuel <= 0) {
            showNotification("No fuel remaining.");
            return;
        }

        state.ignition = !state.ignition;

        if (state.ignition && state.throttle <= 0) {
            state.throttle = 80;
            if ($("throttle")) $("throttle").value = "80";
        }

        updateFlames();
        showNotification(state.ignition ? "Engine ignition." : "Engine cutoff.");
    }

    function igniteRocket() {
        if (!state.flightActive || state.fuel <= 0) {
            showNotification("Launch aborted: check fuel and vehicle configuration.");
            return;
        }

        state.ignition = true;
        state.throttle = Math.max(state.throttle, 80);
        if ($("throttle")) $("throttle").value = String(state.throttle);

        updateFlames();
        showNotification("Liftoff! The vehicle is accelerating under thrust.");
    }

    function updateFlames() {
        const active = state.ignition && state.fuel > 0 &&
            state.throttle > 0;

        if (mainFlame) mainFlame.visible = active;
        if (mainFlameLight) {
            mainFlameLight.intensity = active ? 2.5 : 0;
        }

        boosterGroups.forEach(booster => {
            if (booster.userData.flame && !booster.userData.separated) {
                booster.userData.flame.visible = active && state.stage === 1;
            }
        });
    }

    // ----------------------------------------------------------
    // 11. STAGING
    // ----------------------------------------------------------

    function stageRocket() {
        if (!state.flightActive || !rocket) {
            showNotification("No active rocket to stage.");
            return;
        }

        if (state.stage === 1) {
            state.stage = 2;

            boosterGroups.forEach((booster, index) => {
                if (booster.userData.separated) return;

                booster.userData.separated = true;
                booster.userData.velocity.set(
                    (index % 2 === 0 ? 1 : -1) * (2 + index),
                    -2,
                    (index % 2 === 0 ? 1 : -1) * 1.5
                );

                rocket.remove(booster);
                launchGroup.add(booster);
                booster.userData.detachedPosition = booster.position.clone();
                booster.position.copy(rocket.position).add(
                    new THREE.Vector3(
                        Math.cos(index) * 2,
                        4,
                        Math.sin(index) * 2
                    )
                );
            });

            showNotification("Stage 1 separated. Upper stage active.");
            showEvent("BOOSTER SEPARATION");
        } else if (state.stage === 2) {
            state.stage = 3;
            state.ignition = false;
            updateFlames();
            showNotification("Upper-stage cutoff. Coast or perform a transfer burn.");
            showEvent("STAGE 2 CUTOFF");
        } else {
            showNotification("All available stages have been used.");
        }

        setText("flight-stage", state.stage);
    }

    // ----------------------------------------------------------
    // 12. FLIGHT PHYSICS
    // ----------------------------------------------------------

    function updateFlight(dt) {
        if (!state.flightActive || !rocket) return;

        if (state.phase === "launch" || state.phase === "orbit") {
            updateLaunchPhysics(dt);
        } else if (state.phase === "transfer" || state.phase === "arrived") {
            updateInterplanetaryPhysics(dt);
        }

        updateDetachedBoosters(dt);
        updateSmoke(dt);
        updateTelemetry();
        updateFlames();
    }

    function updateLaunchPhysics(dt) {
        if (!state.ignition || state.fuel <= 0) {
            // Coast under gravity even when the engine is off.
            if (state.altitude > 0) {
                const radius = CONFIG.EARTH_RADIUS_KM + state.altitude;
                const gravity = CONFIG.EARTH_MU / (radius * radius) * 1000;
                state.verticalVelocity -= gravity * dt;
                state.altitude += state.verticalVelocity * dt / 1000;

                if (state.altitude <= 0) {
                    state.altitude = 0;
                    state.verticalVelocity = 0;
                    state.ignition = false;
                }
            }
            updateRocketVisual();
            return;
        }

        const totalMass = Math.max(1, state.dryMass + state.fuel);
        const thrustN = state.thrust * 1000 * state.throttle / 100;
        const thrustAcceleration = thrustN / totalMass;

        const radius = CONFIG.EARTH_RADIUS_KM + Math.max(0, state.altitude);
        const gravity = CONFIG.EARTH_MU / (radius * radius) * 1000;

        // A gentle gravity turn gradually tilts thrust away from vertical.
        if (state.altitude > 10) {
            state.pitch = Math.min(0.85, state.pitch + dt * 0.0025);
        }

        const verticalAcceleration =
            thrustAcceleration * Math.cos(state.pitch) - gravity;

        const horizontalAcceleration =
            thrustAcceleration * Math.sin(state.pitch);

        state.verticalVelocity += verticalAcceleration * dt;
        state.horizontalVelocity += horizontalAcceleration * dt;

        // Simple atmospheric drag below 100 km.
        if (state.altitude < 100) {
            const densityFactor = Math.exp(-Math.max(0, state.altitude) / 8.5);
            const drag = 0.0004 * densityFactor *
                state.verticalVelocity * Math.abs(state.verticalVelocity);

            state.verticalVelocity -= drag * dt;
        }

        state.altitude += state.verticalVelocity * dt / 1000;
        state.missionTime += dt;

        // Rocket equation fuel flow: mass flow = thrust / (Isp * g0).
        const massFlowKgS = thrustN / Math.max(1, state.isp * CONFIG.G0);
        state.fuel = Math.max(0, state.fuel - massFlowKgS * dt);
        state.mass = state.dryMass + state.fuel;

        if (state.fuel <= 0) {
            state.ignition = false;
            state.throttle = 0;
            if ($("throttle")) $("throttle").value = "0";
            showNotification("Fuel depleted. Engine shutdown.");
        }

        if (state.altitude < 0) {
            state.altitude = 0;
            state.verticalVelocity = 0;
            state.ignition = false;
            state.phase = "idle";
            state.flightActive = false;
            showEvent("FLIGHT ENDED");
        }

        // This is a simplified launch-to-orbit transition, not a
        // complete Earth-centered orbital insertion calculation.
        if (state.altitude >= 120 && state.phase === "launch") {
            enterInterplanetaryPhase();
        }

        updateRocketVisual();
        createSmokePuff();
    }

    function updateRocketVisual() {
        if (!rocket) return;

        const visualAltitude = state.altitude * 0.12;
        rocket.position.set(
            state.horizontalVelocity * 0.001,
            2.1 + visualAltitude,
            0
        );

        rocket.rotation.z = -state.pitch;
        rocket.rotation.y = state.heading;

        cameraTarget = rocket.position;
    }

    function enterInterplanetaryPhase() {
        state.phase = "transfer";
        state.ignition = false;
        state.throttle = 0;

        if ($("throttle")) $("throttle").value = "0";

        // Map the launch vehicle to a heliocentric starting state.
        // Planetary positions and the transfer trajectory are modeled
        // with circular orbits, so this is an approximation.
        const earthPos = getPlanetPositionKm("Earth");
        const earthAngle = getPlanetAngle("Earth");

        state.heliocentricPosition = earthPos.clone();
        state.heliocentricPosition.y += CONFIG.EARTH_RADIUS_KM +
            state.altitude;

        const earthOrbitalSpeed = Math.sqrt(
            CONFIG.SUN_MU / (PLANETS.Earth.a * CONFIG.AU_KM)
        );

        const tangent = new THREE.Vector3(
            -Math.sin(earthAngle),
            0,
            Math.cos(earthAngle)
        );

        const radial = new THREE.Vector3(
            Math.cos(earthAngle),
            0,
            Math.sin(earthAngle)
        );

        state.heliocentricVelocity = tangent.multiplyScalar(earthOrbitalSpeed)
            .add(radial.multiplyScalar(state.horizontalVelocity / 1000))
            .add(new THREE.Vector3(
                0,
                state.verticalVelocity / 1000,
                0
            ));

        // After the transition, the rocket is rendered in the solar system.
        launchGroup.visible = false;
        solarSystemGroup.visible = true;

        const rocketWorldPosition = mapHeliocentricToVisual(
            state.heliocentricPosition
        );

        rocket.position.copy(rocketWorldPosition);
        solarSystemGroup.add(rocket);

        cameraTarget = rocket.position;
        cameraDistance = 40;

        showEvent("EARTH ASCENT COMPLETE — SOLAR TRANSFER PHASE");
        showNotification(
            "Spacecraft entered the simplified heliocentric simulation. Use throttle and attitude controls to maneuver."
        );
    }

    function mapHeliocentricToVisual(positionKm) {
        return new THREE.Vector3(
            positionKm.x / CONFIG.AU_KM * CONFIG.AU_SCALE,
            positionKm.y / CONFIG.AU_KM * CONFIG.AU_SCALE,
            positionKm.z / CONFIG.AU_KM * CONFIG.AU_SCALE
        );
    }

    function updateInterplanetaryPhysics(dt) {
        if (!state.heliocentricPosition || !state.heliocentricVelocity) return;

        state.missionTime += dt;

        const targetName = state.destination;
        const targetPos = targetName === "Moon"
            ? getPlanetPositionKm("Earth")
            : getPlanetPositionKm(targetName);

        const position = state.heliocentricPosition;
        const velocity = state.heliocentricVelocity;

        // Gravity from the Sun plus simplified perturbations from planets.
        const acceleration = new THREE.Vector3();
        const sunDistance = Math.max(1e6, position.length());

        acceleration.add(
            position.clone().multiplyScalar(
                -CONFIG.SUN_MU / Math.pow(sunDistance, 3)
            )
        );

        for (const [name, data] of Object.entries(PLANETS)) {
            const planetPos = getPlanetPositionKm(name);
            const relative = planetPos.clone().sub(position);
            const distance = Math.max(1000, relative.length());

            acceleration.add(
                relative.multiplyScalar(data.mu / Math.pow(distance, 3))
            );
        }

        // Simplified powered guidance. The engine still has finite thrust
        // and fuel, but this is not a Lambert/Hohmann transfer solver.
        if (state.ignition && state.fuel > 0 && state.throttle > 0) {
            const targetDirection = targetPos.clone().sub(position);

            if (targetDirection.lengthSq() > 0) {
                targetDirection.normalize();

                const thrustN = state.thrust * 1000 *
                    state.throttle / 100;

                const mass = Math.max(1, state.dryMass + state.fuel);
                const accelerationKmS2 = thrustN / mass / 1000;

                acceleration.add(
                    targetDirection.multiplyScalar(accelerationKmS2)
                );

                const flow = thrustN / Math.max(1, state.isp * CONFIG.G0);
                state.fuel = Math.max(0, state.fuel - flow * dt);
                state.mass = state.dryMass + state.fuel;

                if (state.fuel <= 0) {
                    state.ignition = false;
                    state.throttle = 0;
                    if ($("throttle")) $("throttle").value = "0";
                    showNotification("Transfer fuel depleted.");
                }
            }
        }

        // Semi-implicit Euler integration with small time steps.
        // Simulation speed changes the number of physical seconds advanced.
        const simDt = dt * Math.max(1, state.speed);

        let remaining = Math.min(simDt, 120);
        while (remaining > 0) {
            const step = Math.min(CONFIG.MAX_PHYSICS_STEP, remaining);
            const r = Math.max(1e6, position.length());

            const a = new THREE.Vector3().copy(position)
                .multiplyScalar(-CONFIG.SUN_MU / Math.pow(r, 3));

            for (const [name, data] of Object.entries(PLANETS)) {
                const p = getPlanetPositionKm(name);
                const rel = p.sub(position);
                const d = Math.max(1000, rel.length());
                a.add(rel.multiplyScalar(data.mu / Math.pow(d, 3)));
            }

            if (state.ignition && state.fuel > 0 && state.throttle > 0) {
                const target = targetName === "Moon"
                    ? getPlanetPositionKm("Earth")
                    : getPlanetPositionKm(targetName);

                const dir = target.sub(position);
                if (dir.lengthSq() > 0) {
                    dir.normalize();
                    const thrustN = state.thrust * 1000 *
                        state.throttle / 100;
                    const mass = Math.max(1, state.dryMass + state.fuel);
                    a.add(dir.multiplyScalar(thrustN / mass / 1000));
                }
            }

            velocity.addScaledVector(a, step);
            position.addScaledVector(velocity, step);

            if (state.ignition && state.fuel > 0 && state.throttle > 0) {
                const thrustN = state.thrust * 1000 *
                    state.throttle / 100;
                const flow = thrustN / Math.max(1, state.isp * CONFIG.G0);
                state.fuel = Math.max(0, state.fuel - flow * step);
                state.mass = state.dryMass + state.fuel;

                if (state.fuel <= 0) {
                    state.ignition = false;
                    state.throttle = 0;
                    if ($("throttle")) $("throttle").value = "0";
                }
            }

            remaining -= step;
        }

        // Approximate arrival zone. This is not orbital insertion/capture.
        if (targetName && targetName !== "Earth") {
            const distanceKm = position.distanceTo(targetPos);
            const arrivalRadius = targetName === "Moon" ? 80000 :
                Math.max(500000, PLANETS[targetName].a * 100000);

            if (distanceKm < arrivalRadius && !state.arrivalNotified) {
                state.arrivalNotified = true;
                state.phase = "arrived";
                showEvent(`APPROACHING ${targetName.toUpperCase()}`);
                showNotification(
                    `Near ${targetName}. Capture into a stable orbit is not yet modeled.`
                );
            }
        }

        if (rocket) {
            rocket.position.copy(mapHeliocentricToVisual(position));
            rocket.rotation.y += state.heading * dt * 0.1;
            cameraTarget = rocket.position;
        }
    }

    // ----------------------------------------------------------
    // 13. BOOSTERS AND SMOKE
    // ----------------------------------------------------------

    function updateDetachedBoosters(dt) {
        for (const booster of boosterGroups) {
            if (!booster.userData.separated) continue;

            booster.position.addScaledVector(
                booster.userData.velocity,
                dt
            );

            booster.userData.velocity.y -= 9.81 * dt * 0.05;
            booster.rotation.z += dt * 0.3;

            if (booster.position.y < -30) {
                launchGroup.remove(booster);
                booster.userData.separated = false;
            }
        }
    }

    function createSmokePuff() {
        if (!rocket || state.phase !== "launch" ||
            !state.ignition || Math.random() > 0.35) return;

        if (smokeParticles.length > 120) return;

        const material = new THREE.MeshBasicMaterial({
            color: 0x9aa7b7,
            transparent: true,
            opacity: 0.24,
            depthWrite: false
        });

        const particle = new THREE.Mesh(
            new THREE.SphereGeometry(0.4 + Math.random() * 0.5, 8, 8),
            material
        );

        particle.position.copy(rocket.position);
        particle.position.x += (Math.random() - 0.5) * 2;
        particle.position.z += (Math.random() - 0.5) * 2;
        particle.position.y -= 1.5;

        particle.userData = {
            age: 0,
            lifetime: 2.0 + Math.random() * 2,
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 1.2,
                -0.3 - Math.random(),
                (Math.random() - 0.5) * 1.2
            )
        };

        launchGroup.add(particle);
        smokeParticles.push(particle);
    }

    function updateSmoke(dt) {
        for (let i = smokeParticles.length - 1; i >= 0; i--) {
            const particle = smokeParticles[i];
            const data = particle.userData;

            data.age += dt;
            particle.position.addScaledVector(data.velocity, dt);
            particle.scale.multiplyScalar(1 + dt * 0.3);
            particle.material.opacity = Math.max(
                0,
                0.24 * (1 - data.age / data.lifetime)
            );

            if (data.age >= data.lifetime) {
                launchGroup.remove(particle);
                particle.geometry.dispose();
                particle.material.dispose();
                smokeParticles.splice(i, 1);
            }
        }
    }

    function clearSmoke() {
        for (const particle of smokeParticles) {
            launchGroup.remove(particle);
            particle.geometry.dispose();
            particle.material.dispose();
        }
        smokeParticles.length = 0;
    }

    // ----------------------------------------------------------
    // 14. TELEMETRY
    // ----------------------------------------------------------

    function updateTelemetry() {
        setText("telemetry-altitude", `${fmt(state.altitude, 2)} km`);
        setText(
            "telemetry-velocity",
            `${fmt(Math.hypot(state.verticalVelocity, state.horizontalVelocity), 1)} m/s`
        );
        setText("telemetry-vertical", `${fmt(state.verticalVelocity, 1)} m/s`);
        setText("telemetry-throttle", `${Math.round(state.throttle)}%`);
        setText("telemetry-fuel", `${fmt(state.fuel, 0)} kg`);
        setText(
            "telemetry-thrust",
            `${fmt(state.ignition ? state.thrust * state.throttle / 100 : 0, 1)} kN`
        );
        setText("flight-stage", state.stage);

        if (state.phase === "transfer" || state.phase === "arrived") {
            const speed = state.heliocentricVelocity
                ? state.heliocentricVelocity.length()
                : 0;

            setText("telemetry-apoapsis", "Solar trajectory");
            setText("telemetry-periapsis", `${fmt(speed, 2)} km/s`);
        } else {
            setText("telemetry-apoapsis", "Approximate");
            setText("telemetry-periapsis", "Approximate");
        }

        setText(
            "simulation-status",
            state.paused ? "PAUSED" :
            state.flightActive ? state.phase.toUpperCase() :
            "SYSTEM READY"
        );
    }

    // ----------------------------------------------------------
    // 15. CAMERA
    // ----------------------------------------------------------

    function onPointerDown(event) {
        dragging = true;
        dragStart = { x: event.clientX, y: event.clientY };
        state.pointerDown = { x: event.clientX, y: event.clientY };
        suppressClick = false;
    }

    function onPointerMove(event) {
        if (!dragging || !dragStart) return;

        const dx = event.clientX - dragStart.x;
        const dy = event.clientY - dragStart.y;

        if (Math.abs(dx) + Math.abs(dy) > 4) suppressClick = true;

        cameraYaw -= dx * 0.005;
        cameraPitch = clamp(cameraPitch + dy * 0.004, -1.25, 1.25);

        dragStart = { x: event.clientX, y: event.clientY };
        updateCamera();
    }

    function onPointerUp() {
        dragging = false;
        dragStart = null;
    }

    function onWheel(event) {
        event.preventDefault();

        cameraDistance = clamp(
            cameraDistance * (event.deltaY > 0 ? 1.12 : 0.89),
            8,
            3000
        );

        updateCamera();
    }

    function updateCamera() {
        if (!camera) return;

        let target = new THREE.Vector3(0, 0, 0);

        if (cameraTarget) {
            if (cameraTarget.isVector3) {
                target.copy(cameraTarget);
            } else if (cameraTarget.getWorldPosition) {
                cameraTarget.getWorldPosition(target);
            } else if (cameraTarget.position) {
                target.copy(cameraTarget.position);
            }
        }

        const horizontal = cameraDistance * Math.cos(cameraPitch);

        camera.position.set(
            target.x + horizontal * Math.sin(cameraYaw),
            target.y + cameraDistance * Math.sin(cameraPitch),
            target.z + horizontal * Math.cos(cameraYaw)
        );

        camera.lookAt(target);
    }

    function onCanvasClick(event) {
        if (suppressClick) {
            suppressClick = false;
            return;
        }

        if (state.activeSection === "flight" && state.phase !== "transfer") {
            return;
        }

        const rect = renderer.domElement.getBoundingClientRect();

        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const targets = Array.from(celestialBodies.values());
        const hits = raycaster.intersectObjects(targets, true);

        if (!hits.length) return;

        let object = hits[0].object;

        while (object && !object.userData?.name && object.parent) {
            object = object.parent;
        }

        if (object && object.userData && object.userData.name) {
            selectPlanet(object.userData.name);
            activateSection("planet-explorer");
        }
    }

    // ----------------------------------------------------------
    // 16. ATTITUDE AND KEYBOARD CONTROLS
    // ----------------------------------------------------------

    function applyAttitudeControl(control) {
        if (!state.flightActive) return;

        const adjustment = 0.08;

        if (control === "left") state.heading -= adjustment;
        if (control === "right") state.heading += adjustment;
        if (control === "up") state.pitch = clamp(state.pitch + adjustment, -1.4, 1.4);
        if (control === "down") state.pitch = clamp(state.pitch - adjustment, -1.4, 1.4);

        if (rocket && state.phase === "launch") {
            rocket.rotation.z = -state.pitch;
            rocket.rotation.y = state.heading;
        }
    }

    function onKeyDown(event) {
        const target = event.target;
        if (target && (
            target.tagName === "INPUT" ||
            target.tagName === "TEXTAREA" ||
            target.isContentEditable
        )) return;

        switch (event.code) {
            case "Space":
                event.preventDefault();
                toggleIgnition();
                break;

            case "KeyX":
                stageRocket();
                break;

            case "KeyR":
                state.rcs = !state.rcs;
                showNotification(state.rcs ? "RCS enabled." : "RCS disabled.");
                break;

            case "KeyG":
                state.landingGear = !state.landingGear;
                showNotification(
                    state.landingGear ? "Landing gear deployed." : "Landing gear retracted."
                );
                break;

            case "KeyP":
                togglePause();
                break;

            case "ArrowLeft":
                applyAttitudeControl("left");
                break;

            case "ArrowRight":
                applyAttitudeControl("right");
                break;

            case "ArrowUp":
                applyAttitudeControl("up");
                break;

            case "ArrowDown":
                applyAttitudeControl("down");
                break;

            default:
                break;
        }

        const planetKeys = {
            Digit1: "Mercury",
            Digit2: "Venus",
            Digit3: "Earth",
            Digit4: "Mars",
            Digit5: "Jupiter",
            Digit6: "Saturn",
            Digit7: "Uranus",
            Digit8: "Neptune"
        };

        if (planetKeys[event.code]) {
            selectPlanet(planetKeys[event.code]);
            activateSection("planet-explorer");
        }
    }

    // ----------------------------------------------------------
    // 17. PAUSE AND SIMULATION CLOCK
    // ----------------------------------------------------------

    function togglePause() {
        state.paused = !state.paused;

        if (state.paused) {
            state.previousSpeed = state.speed;
            state.speed = 0;
        } else {
            state.speed = state.previousSpeed > 0 ? state.previousSpeed : 1;
        }

        updatePauseButton();
    }

    function updatePauseButton() {
        setText("pause-button", state.paused ? "Resume" : "Pause");
    }

    function updateSimulation(dt) {
        if (state.paused) return;

        const speed = Math.max(0, state.speed);

        if (state.phase !== "launch" && state.phase !== "orbit") {
            state.simDays += dt * speed / 86400;
        }

        updatePlanetPositions();
    }

    // ----------------------------------------------------------
    // 18. MESSAGES AND UTILITIES
    // ----------------------------------------------------------

    function setText(id, value) {
        const element = $(id);
        if (element) element.textContent = String(value);
    }

    function showNotification(message) {
        const element = $("notification");
        if (!element) return;

        element.textContent = message;
        element.hidden = false;
        element.classList.add("visible");

        if (notificationTimeout !== null) {
            clearTimeout(notificationTimeout);
        }

        notificationTimeout = window.setTimeout(() => {
            element.classList.remove("visible");
            element.hidden = true;
        }, 3500);
    }

    function showEvent(message) {
        const element = $("event-message");
        if (!element) return;

        element.textContent = message;
        element.hidden = false;

        window.setTimeout(() => {
            if (element.textContent === message) element.hidden = true;
        }, 4500);
    }

    function resizeRenderer() {
        const container = $("three-container");
        if (!container || !renderer || !camera) return;

        const width = Math.max(1, container.clientWidth);
        const height = Math.max(1, container.clientHeight);

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }

    // ----------------------------------------------------------
    // 19. MAIN ANIMATION LOOP
    // ----------------------------------------------------------

    function animate(now) {
        requestAnimationFrame(animate);

        if (!state.ready || !renderer || !scene || !camera) return;

        let dt = (now - lastFrame) / 1000;
        lastFrame = now;

        if (!Number.isFinite(dt) || dt < 0) dt = 0;
        dt = Math.min(dt, CONFIG.MAX_FRAME_DT);

        if (!state.paused) {
            const physicsDt = dt * Math.max(0, state.speed);

            // Keep the launch phase stable at very high simulation speeds.
            if (state.flightActive && state.speed > 0) {
                let remaining = Math.min(physicsDt, 2);
                while (remaining > 0) {
                    const step = Math.min(0.02, remaining);
                    updateFlight(step);
                    remaining -= step;
                }
            }

            updateSimulation(dt);

            if (rocket && state.ignition && mainFlame) {
                mainFlame.scale.x = 0.85 + Math.random() * 0.3;
                mainFlame.scale.z = 0.85 + Math.random() * 0.3;
                mainFlame.scale.y = 0.8 + Math.random() * 0.4;
            }

            if (launchGroup.visible && state.phase === "launch") {
                // Camera tracks the rocket while retaining user zoom.
                cameraTarget = rocket ? rocket.position : cameraTarget;
            }
        }

        updateCamera();
        renderer.render(scene, camera);
    }
})();
