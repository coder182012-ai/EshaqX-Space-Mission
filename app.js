
/* =========================================================
   ESHAQX SPACE MISSION
   COMPLETE STABLE APP.JS
   ========================================================= */

/* =========================================================
   STATE
   ========================================================= */

const state = {
    paused: false,
    activeSection: "solar-system",
    simulationSpeed: 1,

    selectedPlanet: null,

    flightActive: false,
    ignition: false,
    countdownRunning: false,

    stage: 1,
    throttle: 0,

    mission: "orbit",
    missionTime: 0,

    altitude: 0,
    velocity: 0,
    verticalVelocity: 0,

    apoapsis: 0,
    periapsis: 0,

    fuel: 100,
    rocketMass: 120,
    rocketThrust: 0,

    rcs: false,
    landingGear: false,

    rocketParts: []
};


/* =========================================================
   PLANET DATA
   ========================================================= */

const planets = {

    Sun: {
        type: "STAR",
        description:
            "The Sun is the star at the center of our Solar System. Its gravity controls the motion of the planets.",
        diameter: "1,391,000 km",
        mass: "1.989 × 10³⁰ kg",
        gravity: "274 m/s²",
        distance: "0 km",
        rotation: "≈ 25 days",
        orbit: "Solar System center",
        temperature: "≈ 5,500°C surface",
        moons: "0"
    },

    Mercury: {
        type: "TERRESTRIAL PLANET",
        description:
            "Mercury is the smallest planet and the closest planet to the Sun.",
        diameter: "4,879 km",
        mass: "3.301 × 10²³ kg",
        gravity: "3.70 m/s²",
        distance: "57.9 million km",
        rotation: "58.6 days",
        orbit: "88 days",
        temperature: "≈ 167°C average",
        moons: "0"
    },

    Venus: {
        type: "TERRESTRIAL PLANET",
        description:
            "Venus has a thick carbon-dioxide atmosphere and is the hottest planet in the Solar System.",
        diameter: "12,104 km",
        mass: "4.867 × 10²⁴ kg",
        gravity: "8.87 m/s²",
        distance: "108.2 million km",
        rotation: "243 days",
        orbit: "224.7 days",
        temperature: "≈ 464°C",
        moons: "0"
    },

    Earth: {
        type: "TERRESTRIAL PLANET",
        description:
            "Earth is our home planet. It has liquid-water oceans, an atmosphere and the only life currently known.",
        diameter: "12,742 km",
        mass: "5.972 × 10²⁴ kg",
        gravity: "9.81 m/s²",
        distance: "149.6 million km",
        rotation: "23h 56m",
        orbit: "365.25 days",
        temperature: "≈ 15°C average",
        moons: "1"
    },

    Moon: {
        type: "NATURAL SATELLITE",
        description:
            "The Moon is Earth's natural satellite.",
        diameter: "3,475 km",
        mass: "7.342 × 10²² kg",
        gravity: "1.62 m/s²",
        distance: "384,400 km",
        rotation: "27.3 days",
        orbit: "27.3 days",
        temperature: "≈ -20°C average",
        moons: "0"
    },

    Mars: {
        type: "TERRESTRIAL PLANET",
        description:
            "Mars is a cold desert world with a thin atmosphere and polar ice caps.",
        diameter: "6,779 km",
        mass: "6.417 × 10²³ kg",
        gravity: "3.71 m/s²",
        distance: "227.9 million km",
        rotation: "24h 37m",
        orbit: "687 days",
        temperature: "≈ -63°C average",
        moons: "2"
    },

    Jupiter: {
        type: "GAS GIANT",
        description:
            "Jupiter is the largest planet in the Solar System and contains powerful atmospheric storms.",
        diameter: "139,820 km",
        mass: "1.898 × 10²⁷ kg",
        gravity: "24.79 m/s²",
        distance: "778.5 million km",
        rotation: "9h 56m",
        orbit: "11.86 years",
        temperature: "≈ -110°C cloud tops",
        moons: "95+"
    },

    Saturn: {
        type: "GAS GIANT",
        description:
            "Saturn is famous for its large ring system made mainly from ice and rocky material.",
        diameter: "116,460 km",
        mass: "5.683 × 10²⁶ kg",
        gravity: "10.44 m/s²",
        distance: "1.43 billion km",
        rotation: "10h 42m",
        orbit: "29.45 years",
        temperature: "≈ -140°C cloud tops",
        moons: "140+"
    },

    Uranus: {
        type: "ICE GIANT",
        description:
            "Uranus is an ice giant with a blue-green methane-rich atmosphere.",
        diameter: "50,724 km",
        mass: "8.681 × 10²⁵ kg",
        gravity: "8.69 m/s²",
        distance: "2.87 billion km",
        rotation: "17h 14m",
        orbit: "84 years",
        temperature: "≈ -195°C",
        moons: "27"
    },

    Neptune: {
        type: "ICE GIANT",
        description:
            "Neptune is the most distant major planet and has extremely fast atmospheric winds.",
        diameter: "49,244 km",
        mass: "1.024 × 10²⁶ kg",
        gravity: "11.15 m/s²",
        distance: "4.50 billion km",
        rotation: "16h 6m",
        orbit: "164.8 years",
        temperature: "≈ -200°C",
        moons: "14"
    }
};


/* =========================================================
   THREE.JS VARIABLES
   ========================================================= */

let scene;
let camera;
let renderer;

let raycaster;
let mouse;

let sun;

const celestialBodies = {};
const orbitObjects = [];
const orbitLines = [];

let solarSystemGroup;
let flightGroup;

let earthLaunchEnvironment;
let earthGlobe;
let earthClouds;
let launchPad;
let launchTower;

let rocket = null;
let rocketCore = null;

let rocketVelocity = 0;

let engineFlames = [];
let engineLights = [];
let smokeParticles = [];

let stageGroups = [];

let cameraYaw = 0.65;
let cameraPitch = 0.25;
let cameraDistance = 34;

let dragging = false;
let lastPointerX = 0;
let lastPointerY = 0;

let lastTime = performance.now();

let countdownTimer = null;
let notificationTimer = null;


/* =========================================================
   START
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    initializeInterface();

    if (typeof THREE === "undefined") {
        console.error("Three.js is not loaded.");
        return;
    }

    initializeThreeJS();
    initializeSolarSystem();
    initializeLaunchEnvironment();
    initializeBuilder();

    activateSection("solar-system");

    simulateLoading();

    animate();
});


/* =========================================================
   LOADING
   ========================================================= */

function simulateLoading() {

    const bar =
        document.getElementById("loading-progress-bar");

    if (!bar) {
        return;
    }

    let progress = 0;

    const timer = setInterval(() => {

        progress += 5;

        if (progress >= 100) {

            progress = 100;

            clearInterval(timer);

            setTimeout(() => {

                const loading =
                    document.getElementById("loading-screen");

                const app =
                    document.getElementById("app");

                if (loading) {
                    loading.style.opacity = "0";

                    setTimeout(() => {
                        loading.style.display = "none";
                    }, 600);
                }

                if (app) {
                    app.classList.add("loaded");
                }

            }, 250);
        }

        bar.style.width = progress + "%";

    }, 60);
}


/* =========================================================
   THREE.JS INITIALIZATION
   ========================================================= */

function initializeThreeJS() {

    const container =
        document.getElementById("three-container");

    if (!container) {
        return;
    }

    scene = new THREE.Scene();

    scene.background =
        new THREE.Color(0x01040a);

    camera =
        new THREE.PerspectiveCamera(
            55,
            window.innerWidth / window.innerHeight,
            0.1,
            100000
        );

    camera.position.set(
        0,
        65,
        180
    );

    renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance"
        });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    if ("outputColorSpace" in renderer) {
        renderer.outputColorSpace =
            THREE.SRGBColorSpace;
    }

    renderer.shadowMap.enabled = true;

    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;

    container.appendChild(
        renderer.domElement
    );

    /* LIGHTING */

    const ambient =
        new THREE.HemisphereLight(
            0x9cc9ef,
            0x05070b,
            0.5
        );

    scene.add(ambient);

    const sunLight =
        new THREE.PointLight(
            0xffffff,
            3.8,
            0,
            1
        );

    sunLight.position.set(
        0,
        0,
        0
    );

    sunLight.castShadow = true;

    scene.add(sunLight);

    raycaster =
        new THREE.Raycaster();

    mouse =
        new THREE.Vector2();

    createStarField();

    setupMouseCamera();

    renderer.domElement.addEventListener(
        "click",
        handleSceneClick
    );

    window.addEventListener(
        "resize",
        handleResize
    );
}


/* =========================================================
   CUSTOM CAMERA
   ========================================================= */

function setupMouseCamera() {

    const canvas = renderer.domElement;

    canvas.addEventListener(
        "pointerdown",
        event => {

            dragging = true;

            lastPointerX = event.clientX;
            lastPointerY = event.clientY;

            canvas.setPointerCapture(
                event.pointerId
            );
        }
    );

    canvas.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {
                return;
            }

            const dx =
                event.clientX - lastPointerX;

            const dy =
                event.clientY - lastPointerY;

            lastPointerX = event.clientX;
            lastPointerY = event.clientY;

            cameraYaw -= dx * 0.006;

            cameraPitch -= dy * 0.006;

            cameraPitch =
                Math.max(
                    -1.25,
                    Math.min(
                        1.25,
                        cameraPitch
                    )
                );

            updateCameraPosition();
        }
    );

    canvas.addEventListener(
        "pointerup",
        event => {

            dragging = false;

            try {
                canvas.releasePointerCapture(
                    event.pointerId
                );
            } catch (error) {
                /* ignore */
            }
        }
    );

    canvas.addEventListener(
        "pointercancel",
        () => {
            dragging = false;
        }
    );

    canvas.addEventListener(
        "wheel",
        event => {

            event.preventDefault();

            cameraDistance +=
                event.deltaY * 0.04;

            cameraDistance =
                Math.max(
                    8,
                    Math.min(
                        500,
                        cameraDistance
                    )
                );

            updateCameraPosition();
        },
        { passive: false }
    );
}


/* =========================================================
   CAMERA POSITION
   ========================================================= */

function updateCameraPosition() {

    if (!camera) {
        return;
    }

    let target =
        new THREE.Vector3(
            0,
            0,
            0
        );

    if (
        state.activeSection === "flight" &&
        rocket
    ) {
        target.copy(
            rocket.position
        );
    }

    const cosPitch =
        Math.cos(cameraPitch);

    const x =
        target.x +
        Math.sin(cameraYaw) *
        cosPitch *
        cameraDistance;

    const y =
        target.y +
        Math.sin(cameraPitch) *
        cameraDistance;

    const z =
        target.z +
        Math.cos(cameraYaw) *
        cosPitch *
        cameraDistance;

    camera.position.set(
        x,
        y,
        z
    );

    camera.lookAt(target);
}


/* =========================================================
   STAR FIELD
   ========================================================= */

function createStarField() {

    const geometry =
        new THREE.BufferGeometry();

    const count = 7000;

    const positions =
        new Float32Array(
            count * 3
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const radius = 2500;

        positions[i * 3] =
            (Math.random() - 0.5) *
            radius;

        positions[i * 3 + 1] =
            (Math.random() - 0.5) *
            radius;

        positions[i * 3 + 2] =
            (Math.random() - 0.5) *
            radius;
    }

    geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            positions,
            3
        )
    );

    const material =
        new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1.2,
            sizeAttenuation: true
        });

    const stars =
        new THREE.Points(
            geometry,
            material
        );

    scene.add(stars);
}


/* =========================================================
   SOLAR SYSTEM
   ========================================================= */

function initializeSolarSystem() {

    solarSystemGroup =
        new THREE.Group();

    solarSystemGroup.name =
        "SolarSystem";

    scene.add(
        solarSystemGroup
    );

    createSun();

    createPlanet(
        "Mercury",
        14,
        2.0,
        "mercury"
    );

    createPlanet(
        "Venus",
        22,
        3.2,
        "venus"
    );

    createPlanet(
        "Earth",
        32,
        4.2,
        "earth"
    );

    createPlanet(
        "Moon",
        39,
        1.4,
        "moon"
    );

    createPlanet(
        "Mars",
        48,
        2.8,
        "mars"
    );

    createPlanet(
        "Jupiter",
        65,
        7.5,
        "jupiter"
    );

    createPlanet(
        "Saturn",
        85,
        7,
        "saturn"
    );

    createPlanet(
        "Uranus",
        108,
        5.3,
        "uranus"
    );

    createPlanet(
        "Neptune",
        130,
        5.1,
        "neptune"
    );

    createOrbitLines();
}


/* =========================================================
   SUN
   ========================================================= */

function createSun() {

    const geometry =
        new THREE.SphereGeometry(
            8,
            64,
            64
        );

    const material =
        new THREE.MeshBasicMaterial({
            color: 0xffc247
        });

    sun =
        new THREE.Mesh(
            geometry,
            material
        );

    sun.userData.name = "Sun";

    solarSystemGroup.add(
        sun
    );

    celestialBodies.Sun =
        sun;

    const glow =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                10,
                48,
                48
            ),
            new THREE.MeshBasicMaterial({
                color: 0xff9e22,
                transparent: true,
                opacity: 0.16,
                side: THREE.BackSide,
                blending:
                    THREE.AdditiveBlending
            })
        );

    sun.add(
        glow
    );
}


/* =========================================================
   PLANETS
   ========================================================= */

function createPlanet(
    name,
    distance,
    radius,
    type
) {

    const geometry =
        new THREE.SphereGeometry(
            radius,
            64,
            64
        );

    const material =
        createPlanetMaterial(
            type
        );

    const planet =
        new THREE.Mesh(
            geometry,
            material
        );

    const angle =
        Math.random() *
        Math.PI *
        2;

    planet.userData = {
        name: name,
        distance: distance,
        radius: radius,
        angle: angle,
        orbitSpeed:
            0.03 /
            Math.sqrt(
                Math.max(
                    distance,
                    1
                )
            )
    };

    planet.position.set(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
    );

    planet.castShadow = true;
    planet.receiveShadow = true;

    solarSystemGroup.add(
        planet
    );

    celestialBodies[name] =
        planet;

    orbitObjects.push(
        planet
    );

    createPlanetDetails(
        planet,
        radius,
        type
    );

    if (name === "Saturn") {
        createSaturnRings(
            planet,
            radius
        );
    }
}


/* =========================================================
   PLANET MATERIALS
   ========================================================= */

function createPlanetMaterial(
    type
) {

    const colors = {

        mercury: 0x8c8984,

        venus: 0xc99462,

        earth: 0x246fae,

        moon: 0x999999,

        mars: 0xb6533a,

        jupiter: 0xc39a77,

        saturn: 0xcbb98e,

        uranus: 0x69c8d0,

        neptune: 0x3159c9
    };

    return new THREE.MeshStandardMaterial({
        color:
            colors[type] ||
            0x888888,

        roughness: 0.82,

        metalness: 0.02
    });
}


/* =========================================================
   PLANET ATMOSPHERE + CLOUDS
   ========================================================= */

function createPlanetDetails(
    planet,
    radius,
    type
) {

    const atmosphereColors = {

        earth: 0x45a8ff,

        venus: 0xe7a657,

        mars: 0xd76b50,

        jupiter: 0xe2c39d,

        saturn: 0xe0c99d,

        uranus: 0x70e4ea,

        neptune: 0x4e75ff
    };

    if (
        atmosphereColors[type]
    ) {

        const atmosphere =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    radius * 1.06,
                    48,
                    48
                ),
                new THREE.MeshBasicMaterial({
                    color:
                        atmosphereColors[type],
                    transparent: true,
                    opacity:
                        type === "earth"
                            ? 0.16
                            : 0.08,
                    side: THREE.BackSide,
                    blending:
                        THREE.AdditiveBlending
                })
            );

        planet.add(
            atmosphere
        );
    }

    if (type === "earth") {

        const cloudMaterial =
            new THREE.MeshStandardMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.14,
                roughness: 1
            });

        earthClouds =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    radius * 1.018,
                    64,
                    64
                ),
                cloudMaterial
            );

        planet.add(
            earthClouds
        );
    }
}


/* =========================================================
   SATURN RINGS
   ========================================================= */

function createSaturnRings(
    planet,
    radius
) {

    const ring =
        new THREE.Mesh(
            new THREE.RingGeometry(
                radius * 1.25,
                radius * 2.1,
                128
            ),
            new THREE.MeshStandardMaterial({
                color: 0xbca77f,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.72,
                roughness: 0.9
            })
        );

    ring.rotation.x =
        Math.PI / 2.4;

    planet.add(
        ring
    );

    const secondRing =
        new THREE.Mesh(
            new THREE.RingGeometry(
                radius * 1.05,
                radius * 1.2,
                128
            ),
            new THREE.MeshBasicMaterial({
                color: 0x88765d,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.5
            })
        );

    secondRing.rotation.x =
        Math.PI / 2.4;

    planet.add(
        secondRing
    );
}


/* =========================================================
   ORBIT LINES
   ========================================================= */

function createOrbitLines() {

    orbitObjects.forEach(
        planet => {

            const distance =
                planet.userData.distance;

            const points = [];

            for (
                let i = 0;
                i <= 160;
                i++
            ) {

                const angle =
                    (i / 160) *
                    Math.PI *
                    2;

                points.push(
                    new THREE.Vector3(
                        Math.cos(angle) *
                            distance,
                        0,
                        Math.sin(angle) *
                            distance
                    )
                );
            }

            const geometry =
                new THREE.BufferGeometry()
                    .setFromPoints(
                        points
                    );

            const material =
                new THREE.LineBasicMaterial({
                    color: 0x29445f,
                    transparent: true,
                    opacity: 0.38
                });

            const line =
                new THREE.LineLoop(
                    geometry,
                    material
                );

            solarSystemGroup.add(
                line
            );

            orbitLines.push(
                line
            );
        }
    );
}


/* =========================================================
   EARTH LAUNCH ENVIRONMENT
   ========================================================= */

function initializeLaunchEnvironment() {

    flightGroup =
        new THREE.Group();

    flightGroup.name =
        "EarthFlightEnvironment";

    flightGroup.visible = false;

    scene.add(
        flightGroup
    );

    /*
       EARTH GLOBE

       The rocket launches from the
       top of this globe.
    */

    const earthGeometry =
        new THREE.SphereGeometry(
            45,
            96,
            96
        );

    const earthMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x176aa3,
            roughness: 0.8,
            metalness: 0
        });

    earthGlobe =
        new THREE.Mesh(
            earthGeometry,
            earthMaterial
        );

    earthGlobe.position.set(
        0,
        -45,
        0
    );

    earthGlobe.receiveShadow = true;

    flightGroup.add(
        earthGlobe
    );

    /*
       LAND MASSES
       represented by several green
       regions on the globe.
    */

    createEarthLand(
        12,
        2,
        10,
        0.2
    );

    createEarthLand(
        -14,
        5,
        8,
        -0.4
    );

    createEarthLand(
        5,
        -8,
        7,
        0.8
    );

    /*
       ATMOSPHERE
    */

    const atmosphere =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                46.5,
                64,
                64
            ),
            new THREE.MeshBasicMaterial({
                color: 0x3d9eff,
                transparent: true,
                opacity: 0.11,
                side: THREE.BackSide,
                blending:
                    THREE.AdditiveBlending
            })
        );

    atmosphere.position.copy(
        earthGlobe.position
    );

    flightGroup.add(
        atmosphere
    );

    /*
       GROUND / LAUNCH AREA
    */

    const ground =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                18,
                22,
                0.7,
                64
            ),
            new THREE.MeshStandardMaterial({
                color: 0x26382c,
                roughness: 1
            })
        );

    ground.position.y =
        0;

    ground.receiveShadow = true;

    flightGroup.add(
        ground
    );

    /*
       RUNWAY
    */

    const runway =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                16,
                0.18,
                70
            ),
            new THREE.MeshStandardMaterial({
                color: 0x262b30,
                roughness: 0.9
            })
        );

    runway.position.set(
        0,
        0.4,
        28
    );

    flightGroup.add(
        runway
    );

    /*
       RUNWAY MARKINGS
    */

    for (
        let z = -2;
        z < 65;
        z += 7
    ) {

        const mark =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    1.2,
                    0.08,
                    3
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xffffff
                })
            );

        mark.position.set(
            0,
            0.52,
            z
        );

        flightGroup.add(
            mark
        );
    }

    /*
       LAUNCH PAD
    */

    launchPad =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                8,
                9,
                0.7,
                64
            ),
            new THREE.MeshStandardMaterial({
                color: 0x686f75,
                metalness: 0.3,
                roughness: 0.7
            })
        );

    launchPad.position.y =
        0.75;

    launchPad.castShadow = true;
    launchPad.receiveShadow = true;

    flightGroup.add(
        launchPad
    );

    /*
       PAD CENTER
    */

    const padCenter =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                5.5,
                5.5,
                0.78,
                64
            ),
            new THREE.MeshStandardMaterial({
                color: 0x343a40,
                roughness: 0.8
            })
        );

    padCenter.position.y =
        0.8;

    flightGroup.add(
        padCenter
    );

    /*
       LAUNCH TOWER
    */

    createLaunchTower();

    /*
       FLOOD LIGHTS
    */

    const lightPositions = [
        [-10, 7, -10],
        [10, 7, -10],
        [-10, 7, 10],
        [10, 7, 10]
    ];

    lightPositions.forEach(
        position => {

            const light =
                new THREE.PointLight(
                    0xffd6a0,
                    4,
                    28
                );

            light.position.set(
                position[0],
                position[1],
                position[2]
            );

            flightGroup.add(
                light
            );
        }
    );

    earthLaunchEnvironment =
        flightGroup;
}


/* =========================================================
   EARTH LAND PATCH
   ========================================================= */

function createEarthLand(
    x,
    y,
    size,
    rotation
) {

    const geometry =
        new THREE.SphereGeometry(
            size,
            24,
            12
        );

    const material =
        new THREE.MeshStandardMaterial({
            color: 0x287a45,
            roughness: 1
        });

    const land =
        new THREE.Mesh(
            geometry,
            material
        );

    land.position.set(
        x,
        -45 + y,
        Math.sin(x) * 12
    );

    land.scale.set(
        1.5,
        0.25,
        1
    );

    land.rotation.z =
        rotation;

    flightGroup.add(
        land
    );
}


/* =========================================================
   LAUNCH TOWER
   ========================================================= */

function createLaunchTower() {

    launchTower =
        new THREE.Group();

    const metal =
        new THREE.MeshStandardMaterial({
            color: 0x64717a,
            metalness: 0.55,
            roughness: 0.48
        });

    /*
       FOUR VERTICAL LEGS
    */

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            2;

        const leg =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.55,
                    28,
                    0.55
                ),
                metal
            );

        leg.position.set(
            Math.cos(angle) * 7.5,
            14.5,
            Math.sin(angle) * 7.5
        );

        leg.castShadow = true;

        launchTower.add(
            leg
        );
    }

    /*
       CROSS BEAMS
    */

    for (
        let y = 5;
        y <= 25;
        y += 4
    ) {

        const beam =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    16,
                    0.35,
                    0.35
                ),
                metal
            );

        beam.position.y =
            y;

        launchTower.add(
            beam
        );
    }

    /*
       SIDE ARMS
    */

    for (
        let y = 8;
        y <= 24;
        y += 5
    ) {

        const arm =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.3,
                    0.3,
                    5
                ),
                metal
            );

        arm.position.set(
            0,
            y,
            4.5
        );

        launchTower.add(
            arm
        );
    }

    flightGroup.add(
        launchTower
    );
}


/* =========================================================
   SHOW / HIDE FLIGHT ENVIRONMENT
   ========================================================= */

function setFlightEnvironment(
    visible
) {

    if (flightGroup) {
        flightGroup.visible =
            visible;
    }

    if (solarSystemGroup) {
        solarSystemGroup.visible =
            !visible;
    }
}


/* =========================================================
   INTERFACE
   ========================================================= */

function initializeInterface() {

    document
        .querySelectorAll(".nav-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;

                    activateSection(
                        section
                    );

                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            item => {
                                item.classList.remove(
                                    "active"
                                );
                            }
                        );

                    button.classList.add(
                        "active"
                    );
                }
            );
        });


    document
        .querySelectorAll(".close-panel")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const panel =
                        button.closest(
                            ".interface-panel"
                        );

                    if (panel) {
                        panel.classList.remove(
                            "visible"
                        );
                    }
                }
            );
        });


    document
        .querySelectorAll(".close-large-panel")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const panel =
                        button.closest(
                            ".large-panel"
                        );

                    if (panel) {
                        panel.classList.remove(
                            "visible"
                        );
                    }
                }
            );
        });


    const pauseButton =
        document.getElementById(
            "pause-button"
        );

    if (pauseButton) {

        pauseButton.addEventListener(
            "click",
            togglePause
        );
    }


    const settingsButton =
        document.getElementById(
            "settings-button"
        );

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            () => {

                showNotification(
                    "SYSTEM",
                    "Flight systems are operating normally."
                );
            }
        );
    }


    document
        .querySelectorAll("[data-speed]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    state.simulationSpeed =
                        Number(
                            button.dataset.speed
                        );

                    state.paused =
                        state.simulationSpeed === 0;

                    updatePauseButton();
                }
            );
        });


    const throttle =
        document.getElementById(
            "throttle"
        );

    if (throttle) {

        throttle.addEventListener(
            "input",
            event => {

                state.throttle =
                    Number(
                        event.target.value
                    );

                updateThrottleDisplay();
            }
        );
    }


    const ignition =
        document.getElementById(
            "ignition-button"
        );

    if (ignition) {

        ignition.addEventListener(
            "click",
            ignitionSequence
        );
    }


    const stage =
        document.getElementById(
            "stage-button"
        );

    if (stage) {

        stage.addEventListener(
            "click",
            separateStage
        );
    }


    const rcs =
        document.getElementById(
            "rcs-button"
        );

    if (rcs) {

        rcs.addEventListener(
            "click",
            toggleRCS
        );
    }


    const gear =
        document.getElementById(
            "landing-gear-button"
        );

    if (gear) {

        gear.addEventListener(
            "click",
            toggleLandingGear
        );
    }


    const launch =
        document.getElementById(
            "launch-rocket"
        );

    if (launch) {

        launch.addEventListener(
            "click",
            prepareLaunch
        );
    }


    document
        .querySelectorAll(".mission-card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    startMission(
                        card.dataset.mission
                    );
                }
            );
        });


    const docking =
        document.getElementById(
            "station-docking-button"
        );

    if (docking) {

        docking.addEventListener(
            "click",
            () => {

                showNotification(
                    "DOCKING",
                    "Docking approach initiated."
                );
            }
        );
    }


    window.addEventListener(
        "keydown",
        handleKeyboard
    );
}


/* =========================================================
   SECTION CONTROL
   ========================================================= */

function activateSection(
    section
) {

    state.activeSection =
        section;

    document
        .querySelectorAll(
            ".interface-panel, .large-panel"
        )
        .forEach(panel => {

            panel.classList.remove(
                "visible"
            );
        });

    const flightHUD =
        document.getElementById(
            "flight-hud"
        );

    if (flightHUD) {
        flightHUD.classList.remove(
            "visible"
        );
    }


    if (section === "solar-system") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "solar-system-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "SOLAR SYSTEM"
        );

        cameraYaw = 0.65;
        cameraPitch = 0.25;
        cameraDistance = 180;

        updateCameraPosition();

        return;
    }


    if (section === "planet-explorer") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "planet-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "PLANET EXPLORER"
        );

        selectPlanet(
            "Earth"
        );

        return;
    }


    if (section === "rocket-builder") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "rocket-builder-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "ROCKET BUILDER"
        );

        return;
    }


    if (section === "missions") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "missions-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "MISSION CONTROL"
        );

        return;
    }


    if (section === "station") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "station-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "ORBITAL STATION"
        );

        return;
    }


    if (section === "theories") {

        setFlightEnvironment(false);

        document
            .getElementById(
                "theories-panel"
            )
            ?.classList.add(
                "visible"
            );

        updateMode(
            "SPACE THEORIES"
        );

        return;
    }


    if (section === "flight") {

        setFlightEnvironment(true);

        if (flightHUD) {
            flightHUD.classList.add(
                "visible"
            );
        }

        updateMode(
            "FLIGHT CONTROL"
        );

        if (!rocket) {
            createFlightRocket();
        }

        cameraYaw = 0.65;
        cameraPitch = 0.25;
        cameraDistance = 32;

        updateCameraPosition();

        return;
    }
}


/* =========================================================
   MODE
   ========================================================= */

function updateMode(
    text
) {

    setText(
        "current-mode",
        text
    );
}


/* =========================================================
   PLANET SELECTION
   ========================================================= */

function selectPlanet(
    name
) {

    const data =
        planets[name];

    if (!data) {
        return;
    }

    state.selectedPlanet =
        name;

    setText(
        "planet-name",
        name.toUpperCase()
    );

    setText(
        "planet-type",
        data.type
    );

    setText(
        "planet-description",
        data.description
    );

    setText(
        "planet-diameter",
        data.diameter
    );

    setText(
        "planet-mass",
        data.mass
    );

    setText(
        "planet-gravity",
        data.gravity
    );

    setText(
        "planet-distance",
        data.distance
    );

    setText(
        "planet-rotation",
        data.rotation
    );

    setText(
        "planet-orbit",
        data.orbit
    );

    setText(
        "planet-temperature",
        data.temperature
    );

    setText(
        "planet-moons",
        data.moons
    );

    focusPlanet(
        name
    );
}


/* =========================================================
   FOCUS PLANET
   ========================================================= */

function focusPlanet(
    name
) {

    const planet =
        celestialBodies[name];

    if (!planet) {
        return;
    }

    const radius =
        planet.userData.radius;

    cameraDistance =
        Math.max(
            radius * 5,
            15
        );

    cameraYaw = 0.6;
    cameraPitch = 0.2;

    camera.position.set(
        planet.position.x +
            cameraDistance,
        planet.position.y +
            cameraDistance * 0.45,
        planet.position.z +
            cameraDistance
    );

    camera.lookAt(
        planet.position
    );
}


/* =========================================================
   SCENE CLICK
   ========================================================= */

function handleSceneClick(
    event
) {

    /*
       IMPORTANT:

       Only the actual celestial-body meshes
       are checked here.

       The rocket is NOT checked.
       Therefore clicking the rocket cannot
       automatically change the mode.
    */

    if (
        state.activeSection === "flight"
    ) {
        return;
    }

    if (!renderer || !camera) {
        return;
    }

    const rect =
        renderer.domElement.getBoundingClientRect();

    mouse.x =
        (
            (event.clientX - rect.left) /
            rect.width
        ) * 2 - 1;

    mouse.y =
        -(
            (event.clientY - rect.top) /
            rect.height
        ) * 2 + 1;

    raycaster.setFromCamera(
        mouse,
        camera
    );

    const bodies =
        Object.values(
            celestialBodies
        );

    const hits =
        raycaster.intersectObjects(
            bodies,
            false
        );

    if (
        hits.length === 0
    ) {
        return;
    }

    const body =
        hits[0].object;

    const name =
        body.userData.name;

    if (!name) {
        return;
    }

    selectPlanet(
        name
    );

    const panel =
        document.getElementById(
            "planet-panel"
        );

    if (panel) {
        panel.classList.add(
            "visible"
        );
    }
}


/* =========================================================
   ROCKET BUILDER
   ========================================================= */

function initializeBuilder() {

    document
        .querySelectorAll(".part-button")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    addRocketPart(
                        button.dataset.part
                    );
                }
            );
        });


    document
        .getElementById("clear-rocket")
        ?.addEventListener(
            "click",
            clearRocket
        );


    document
        .getElementById("save-rocket")
        ?.addEventListener(
            "click",
            saveRocket
        );


    updateBuilderDisplay();
}


/* =========================================================
   ADD PART
   ========================================================= */

function addRocketPart(
    type
) {

    state.rocketParts.push(
        type
    );

    updateBuilderDisplay();

    showNotification(
        "ROCKET BUILDER",
        formatPartName(type) +
        " added."
    );
}


/* =========================================================
   FORMAT PART
   ========================================================= */

function formatPartName(
    type
) {

    return type
        .replaceAll("-", " ")
        .toUpperCase();
}


/* =========================================================
   BUILDER DISPLAY
   ========================================================= */

function updateBuilderDisplay() {

    const container =
        document.getElementById(
            "builder-rocket"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (
        state.rocketParts.length === 0
    ) {

        container.innerHTML =
            '<div class="builder-empty">SELECT ROCKET PARTS</div>';

        updateVehicleData();

        return;
    }

    const parts =
        [...state.rocketParts]
            .reverse();

    parts.forEach(
        type => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "rocket-part";

            createBuilderPartVisual(
                element,
                type
            );

            container.appendChild(
                element
            );
        }
    );

    updateVehicleData();
}


/* =========================================================
   BUILDER PART VISUALS
   ========================================================= */

function createBuilderPartVisual(
    element,
    type
) {

    if (type === "nose") {

        element.classList.add(
            "rocket-nose"
        );

    } else if (type === "capsule") {

        element.classList.add(
            "rocket-capsule"
        );

        const window =
            document.createElement(
                "div"
            );

        window.className =
            "rocket-window";

        element.appendChild(
            window
        );

    } else if (
        type === "fuel-small"
    ) {

        element.classList.add(
            "rocket-tank"
        );

    } else if (
        type === "fuel-large"
    ) {

        element.classList.add(
            "rocket-tank",
            "large"
        );

    } else if (
        type === "engine" ||
        type === "vacuum-engine"
    ) {

        element.classList.add(
            "rocket-engine"
        );

        const nozzle =
            document.createElement(
                "div"
            );

        nozzle.className =
            "rocket-nozzle";

        element.appendChild(
            nozzle
        );

    } else if (
        type === "booster"
    ) {

        element.classList.add(
            "rocket-booster"
        );

    } else if (
        type === "decoupler"
    ) {

        element.classList.add(
            "rocket-decoupler"
        );

    } else if (
        type === "heatshield"
    ) {

        element.classList.add(
            "rocket-heatshield"
        );

    } else if (
        type === "landing-legs"
    ) {

        element.classList.add(
            "rocket-legs"
        );

    } else if (
        type === "solar-panel"
    ) {

        element.classList.add(
            "rocket-solar-panel"
        );

    } else {

        element.style.width = "65px";
        element.style.height = "24px";
        element.style.background = "#697782";
        element.style.border =
            "1px solid #aab5bd";
    }
}


/* =========================================================
   VEHICLE DATA
   ========================================================= */

function updateVehicleData() {

    const parts =
        state.rocketParts;

    const tanks =
        parts.filter(
            part =>
                part === "fuel-small" ||
                part === "fuel-large"
        ).length;

    const engines =
        parts.filter(
            part =>
                part === "engine" ||
                part === "vacuum-engine" ||
                part === "booster"
        ).length;

    const mass =
        80 +
        parts.length * 2.5 +
        tanks * 12;

    const fuel =
        tanks * 500;

    const thrust =
        engines * 850;

    const dv =
        fuel > 0
            ? Math.round(
                9.81 *
                Math.log(
                    (mass + fuel) /
                    mass
                ) *
                100
            )
            : 0;

    setText(
        "vehicle-parts",
        parts.length
    );

    setText(
        "vehicle-stages",
        calculateStages()
    );

    setText(
        "vehicle-mass",
        mass.toFixed(1) + " t"
    );

    setText(
        "vehicle-fuel",
        fuel + " kg"
    );

    setText(
        "vehicle-thrust",
        thrust + " kN"
    );

    setText(
        "vehicle-dv",
        dv + " m/s"
    );
}


/* =========================================================
   STAGES
   ========================================================= */

function calculateStages() {

    if (
        state.rocketParts.length === 0
    ) {
        return 0;
    }

    const decouplers =
        state.rocketParts.filter(
            part =>
                part === "decoupler"
        ).length;

    return decouplers + 1;
}


/* =========================================================
   CLEAR ROCKET
   ========================================================= */

function clearRocket() {

    state.rocketParts = [];

    updateBuilderDisplay();

    showNotification(
        "ROCKET BUILDER",
        "Vehicle assembly cleared."
    );
}


/* =========================================================
   SAVE ROCKET
   ========================================================= */

function saveRocket() {

    try {

        localStorage.setItem(
            "esHaqXRocket",
            JSON.stringify(
                state.rocketParts
            )
        );

        showNotification(
            "ROCKET BUILDER",
            "Rocket design saved locally."
        );

    } catch (error) {

        showNotification(
            "SYSTEM",
            "Could not save the design."
        );
    }
}


/* =========================================================
   PREPARE LAUNCH
   ========================================================= */

function prepareLaunch() {

    if (
        state.rocketParts.length === 0
    ) {

        showNotification(
            "LAUNCH CONTROL",
            "Add rocket parts before launch."
        );

        return;
    }

    resetFlight();

    state.flightActive = true;

    activateSection(
        "flight"
    );

    createFlightRocket();

    showNotification(
        "LAUNCH CONTROL",
        "Rocket positioned on the Earth launchpad."
    );

    startCountdown();
}


/* =========================================================
   RESET FLIGHT
   ========================================================= */

function resetFlight() {

    state.ignition = false;
    state.stage = 1;

    state.missionTime = 0;

    state.altitude = 0;

    state.velocity = 0;

    state.verticalVelocity = 0;

    state.apoapsis = 0;

    state.periapsis = 0;

    state.fuel = 100;

    state.rocketThrust = 0;

    rocketVelocity = 0;

    stopEngineFlames();

    if (countdownTimer) {

        clearInterval(
            countdownTimer
        );

        countdownTimer = null;
    }

    state.countdownRunning = false;
}


/* =========================================================
   COUNTDOWN
   ========================================================= */

function startCountdown() {

    const overlay =
        document.getElementById(
            "countdown-overlay"
        );

    const number =
        document.getElementById(
            "countdown-number"
        );

    const status =
        document.getElementById(
            "countdown-status"
        );

    if (!overlay || !number) {
        return;
    }

    overlay.classList.add(
        "visible"
    );

    state.countdownRunning = true;

    let count = 5;

    number.textContent =
        count;

    if (status) {
        status.textContent =
            "LAUNCH SEQUENCE";
    }

    countdownTimer =
        setInterval(
            () => {

                count--;

                if (count <= 0) {

                    clearInterval(
                        countdownTimer
                    );

                    countdownTimer = null;

                    state.countdownRunning =
                        false;

                    overlay.classList.remove(
                        "visible"
                    );

                    ignitionSequence();

                    return;
                }

                number.textContent =
                    count;

                if (status) {

                    status.textContent =
                        count <= 2
                            ? "FINAL LAUNCH SEQUENCE"
                            : "LAUNCH SEQUENCE";
                }

            },
            1000
        );
}


/* =========================================================
   CREATE FLIGHT ROCKET
   ========================================================= */

function createFlightRocket() {

    if (rocket) {

        scene.remove(
            rocket
        );

        rocket = null;
    }

    engineFlames = [];
    engineLights = [];
    stageGroups = [];

    rocket =
        new THREE.Group();

    rocket.name =
        "ESHAQX_ROCKET";

    rocket.userData.isRocket =
        true;

    rocketCore =
        new THREE.Group();

    rocket.add(
        rocketCore
    );

    /*
       MAIN MATERIALS
    */

    const whiteMetal =
        new THREE.MeshStandardMaterial({
            color: 0xdfe7ec,
            metalness: 0.42,
            roughness: 0.36
        });

    const darkMetal =
        new THREE.MeshStandardMaterial({
            color: 0x242b32,
            metalness: 0.65,
            roughness: 0.3
        });

    const silver =
        new THREE.MeshStandardMaterial({
            color: 0x9da8af,
            metalness: 0.5,
            roughness: 0.4
        });

    /*
       MAIN BODY
    */

    const body =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.35,
                2.35,
                13,
                48
            ),
            whiteMetal
        );

    body.position.y =
        9;

    body.castShadow = true;

    rocketCore.add(
        body
    );

    /*
       LOWER TANK
    */

    const lowerTank =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.45,
                2.45,
                7,
                48
            ),
            silver
        );

    lowerTank.position.y =
        2;

    lowerTank.castShadow = true;

    rocketCore.add(
        lowerTank
    );

    /*
       BODY BANDS
    */

    [5.5, 12.5].forEach(
        y => {

            const band =
                new THREE.Mesh(
                    new THREE.CylinderGeometry(
                        2.48,
                        2.48,
                        0.45,
                        48
                    ),
                    darkMetal
                );

            band.position.y =
                y;

            rocketCore.add(
                band
            );
        }
    );

    /*
       CAPSULE
    */

    const capsule =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.05,
                2.32,
                3,
                48
            ),
            silver
        );

    capsule.position.y =
        17;

    rocketCore.add(
        capsule
    );

    /*
       CAPSULE WINDOW
    */

    const windowMesh =
        new THREE.Mesh(
            new THREE.SphereGeometry(
                0.52,
                32,
                16
            ),
            new THREE.MeshStandardMaterial({
                color: 0x061b2a,
                metalness: 0.7,
                roughness: 0.18
            })
        );

    windowMesh.scale.y =
        0.45;

    windowMesh.position.set(
        0,
        17,
        2.1
    );

    rocketCore.add(
        windowMesh
    );

    /*
       NOSE CONE
    */

    const nose =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                2.35,
                4.5,
                48
            ),
            whiteMetal
        );

    nose.position.y =
        20.75;

    nose.castShadow = true;

    rocketCore.add(
        nose
    );

    /*
       ENGINE MOUNT
    */

    const mount =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                2.7,
                2.7,
                1,
                48
            ),
            darkMetal
        );

    mount.position.y =
        -1.6;

    rocketCore.add(
        mount
    );

    /*
       ENGINE
    */

    const engine =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.45,
                1.9,
                3.3,
                48
            ),
            darkMetal
        );

    engine.position.y =
        -3.5;

    engine.castShadow = true;

    rocketCore.add(
        engine
    );

    /*
       ENGINE NOZZLE
    */

    const nozzle =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.85,
                1.25,
                2.5,
                48,
                1,
                false
            ),
            darkMetal
        );

    nozzle.position.y =
        -6;

    rocketCore.add(
        nozzle
    );

    /*
       FLAME
    */

    const flame =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1.2,
                8,
                32
            ),
            new THREE.MeshBasicMaterial({
                color: 0x66d8ff,
                transparent: true,
                opacity: 0.88,
                blending:
                    THREE.AdditiveBlending
            })
        );

    flame.position.y =
        -11;

    flame.visible = false;

    rocketCore.add(
        flame
    );

    engineFlames.push(
        flame
    );

    /*
       ENGINE LIGHT
    */

    const engineLight =
        new THREE.PointLight(
            0x55cfff,
            0,
            30
        );

    engineLight.position.y =
        -8;

    rocketCore.add(
        engineLight
    );

    engineLights.push(
        engineLight
    );

    /*
       SIDE BOOSTERS
    */

    const leftBooster =
        createBooster(
            -3.5,
            darkMetal
        );

    const rightBooster =
        createBooster(
            3.5,
            darkMetal
        );

    stageGroups.push(
        leftBooster
    );

    stageGroups.push(
        rightBooster
    );

    /*
       FINS
    */

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const angle =
            i *
            Math.PI /
            2;

        const fin =
            new THREE.Mesh(
                new THREE.BoxGeometry(
                    0.3,
                    4,
                    2.4
                ),
                darkMetal
            );

        fin.position.set(
            Math.cos(angle) * 2.7,
            0.5,
            Math.sin(angle) * 2.7
        );

        fin.rotation.y =
            -angle;

        rocketCore.add(
            fin
        );
    }

    /*
       BEACON
    */

    const beacon =
        new THREE.PointLight(
            0x66cfff,
            1.4,
            15
        );

    beacon.position.y =
        16;

    rocketCore.add(
        beacon
    );

    /*
       ROCKET POSITION

       Bottom of engine sits directly
       above the launch pad.
    */

    rocket.position.set(
        0,
        7.8,
        0
    );

    rocket.scale.set(
        1,
        1,
        1
    );

    scene.add(
        rocket
    );

    rocketVelocity = 0;

    cameraYaw = 0.65;
    cameraPitch = 0.18;
    cameraDistance = 30;

    updateCameraPosition();

    updateTelemetry();
}


/* =========================================================
   CREATE BOOSTER
   ========================================================= */

function createBooster(
    x,
    material
) {

    const group =
        new THREE.Group();

    group.userData.isBooster =
        true;

    group.position.x =
        x;

    const booster =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                1.05,
                1.2,
                12,
                40
            ),
            material
        );

    booster.position.y =
        5;

    booster.castShadow = true;

    group.add(
        booster
    );

    const boosterNozzle =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.8,
                2,
                32
            ),
            material
        );

    boosterNozzle.position.y =
        -2;

    group.add(
        boosterNozzle
    );

    const boosterFlame =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                0.75,
                6,
                24
            ),
            new THREE.MeshBasicMaterial({
                color: 0xffa53d,
                transparent: true,
                opacity: 0.85,
                blending:
                    THREE.AdditiveBlending
            })
        );

    boosterFlame.position.y =
        -6;

    boosterFlame.visible = false;

    group.add(
        boosterFlame
    );

    group.userData.flame =
        boosterFlame;

    rocket.add(
        group
    );

    return group;
}


/* =========================================================
   IGNITION
   ========================================================= */

function ignitionSequence() {

    if (!state.flightActive) {

        showNotification(
            "ENGINE",
            "Prepare a launch first."
        );

        return;
    }

    if (!rocket) {
        createFlightRocket();
    }

    if (state.ignition) {
        return;
    }

    state.ignition = true;

    if (state.throttle < 60) {
        state.throttle = 80;
    }

    const throttle =
        document.getElementById(
            "throttle"
        );

    if (throttle) {
        throttle.value =
            state.throttle;
    }

    startEngineFlames();

    showNotification(
        "ENGINE IGNITION",
        "Main engines ignited. LIFTOFF!"
    );

    updateThrottleDisplay();
}


/* =========================================================
   ENGINE FLAMES
   ========================================================= */

function startEngineFlames() {

    engineFlames.forEach(
        flame => {
            flame.visible = true;
        }
    );

    engineLights.forEach(
        light => {
            light.intensity = 2.5;
        }
    );

    stageGroups.forEach(
        group => {

            if (
                group.userData.flame
            ) {

                group.userData.flame.visible =
                    true;
            }
        }
    );
}


function stopEngineFlames() {

    engineFlames.forEach(
        flame => {
            flame.visible = false;
        }
    );

    engineLights.forEach(
        light => {
            light.intensity = 0;
        }
    );

    stageGroups.forEach(
        group => {

            if (
                group.userData.flame
            ) {

                group.userData.flame.visible =
                    false;
            }
        }
    );
}


/* =========================================================
   SMOKE
   ========================================================= */

function createLaunchSmoke() {

    if (!rocket) {
        return;
    }

    for (
        let i = 0;
        i < 4;
        i++
    ) {

        const smoke =
            new THREE.Mesh(
                new THREE.SphereGeometry(
                    0.6 +
                    Math.random() * 0.7,
                    12,
                    12
                ),
                new THREE.MeshBasicMaterial({
                    color: 0xc9ced2,
                    transparent: true,
                    opacity: 0.18
                })
            );

        smoke.position.copy(
            rocket.position
        );

        smoke.position.y -=
            9;

        smoke.position.x +=
            (Math.random() - 0.5) * 4;

        smoke.position.z +=
            (Math.random() - 0.5) * 4;

        smoke.userData.life =
            2 +
            Math.random() * 2;

        scene.add(
            smoke
        );

        smokeParticles.push(
            smoke
        );
    }
}


/* =========================================================
   UPDATE SMOKE
   ========================================================= */

function updateSmoke(
    delta
) {

    for (
        let i =
            smokeParticles.length - 1;
        i >= 0;
        i--
    ) {

        const smoke =
            smokeParticles[i];

        smoke.userData.life -=
            delta;

        smoke.position.y +=
            delta * 1.3;

        smoke.position.x +=
            Math.sin(
                smoke.userData.life * 2
            ) *
            delta *
            0.4;

        smoke.scale.multiplyScalar(
            1 + delta * 0.8
        );

        smoke.material.opacity =
            Math.max(
                0,
                smoke.userData.life * 0.055
            );

        if (
            smoke.userData.life <= 0
        ) {

            scene.remove(
                smoke
            );

            smokeParticles.splice(
                i,
                1
            );
        }
    }
}


/* =========================================================
   STAGE SEPARATION
   ========================================================= */

function separateStage() {

    if (!state.flightActive) {

        showNotification(
            "STAGING",
            "No active flight."
        );

        return;
    }

    if (!rocket) {
        return;
    }

    if (
        state.stage >= 3
    ) {

        showNotification(
            "STAGING",
            "No additional stages available."
        );

        return;
    }

    /*
       Stage 1:
       separate side boosters.
    */

    if (state.stage === 1) {

        stageGroups.forEach(
            group => {

                group.userData.separated =
                    true;

                group.userData.velocity =
                    (group.position.x < 0
                        ? -1
                        : 1) * 3;
            }
        );

        state.stage = 2;

        showNotification(
            "STAGING",
            "Stage 1 separated. Stage 2 active."
        );

    } else {

        state.stage = 3;

        showNotification(
            "STAGING",
            "Stage 2 separated. Upper stage active."
        );
    }

    setText(
        "flight-stage",
        state.stage
    );
}


/* =========================================================
   UPDATE SEPARATED BOOSTERS
   ========================================================= */

function updateSeparatedStages(
    delta
) {

    stageGroups.forEach(
        group => {

            if (
                !group.userData.separated
            ) {
                return;
            }

            const velocity =
                group.userData.velocity || 0;

            group.position.x +=
                velocity *
                delta;

            group.position.y -=
                1.5 *
                delta;

            group.rotation.z +=
                delta;
        }
    );
}


/* =========================================================
   RCS
   ========================================================= */

function toggleRCS() {

    state.rcs =
        !state.rcs;

    showNotification(
        "RCS",
        state.rcs
            ? "Reaction control system enabled."
            : "Reaction control system disabled."
    );
}


/* =========================================================
   LANDING GEAR
   ========================================================= */

function toggleLandingGear() {

    state.landingGear =
        !state.landingGear;

    showNotification(
        "LANDING SYSTEM",
        state.landingGear
            ? "Landing gear deployed."
            : "Landing gear retracted."
    );
}


/* =========================================================
   FLIGHT PHYSICS
   ========================================================= */

function updateFlight(
    delta
) {

    if (
        !state.flightActive ||
        !rocket
    ) {

        updateSmoke(
            delta
        );

        return;
    }

    if (state.paused) {

        updateSmoke(
            delta
        );

        return;
    }

    const dt =
        Math.min(
            delta,
            0.05
        );

    state.missionTime +=
        dt;

    /*
       ROCKET IS ON PAD
    */

    if (
        !state.ignition
    ) {

        rocket.position.y =
            7.8;

        state.verticalVelocity =
            0;

        state.velocity =
            0;

        state.rocketThrust =
            0;

        updateTelemetry();

        updateCameraPosition();

        updateSmoke(
            delta
        );

        return;
    }

    /*
       THROTTLE
    */

    const throttle =
        state.throttle / 100;

    /*
       SIMPLIFIED EARTH GRAVITY

       altitude is represented in km.
    */

    const gravity =
        9.81 *
        Math.pow(
            6371 /
            (6371 + state.altitude),
            2
        );

    /*
       THRUST

       Strong enough for visible liftoff.
    */

    const thrustAcceleration =
        32 *
        throttle;

    const acceleration =
        thrustAcceleration -
        gravity;

    state.verticalVelocity +=
        acceleration *
        dt;

    /*
       Prevent the rocket from
       falling through the pad.
    */

    if (
        state.verticalVelocity < 0 &&
        state.altitude <= 0
    ) {

        state.verticalVelocity =
            0;
    }

    /*
       ALTITUDE
    */

    state.altitude +=
        state.verticalVelocity *
        dt /
        1000;

    if (
        state.altitude < 0
    ) {

        state.altitude = 0;
    }

    /*
       VELOCITY
    */

    state.velocity =
        Math.max(
            0,
            state.verticalVelocity
        );

    /*
       FUEL
    */

    state.fuel -=
        throttle *
        1.2 *
        dt;

    state.fuel =
        Math.max(
            0,
            state.fuel
        );

    /*
       THRUST
    */

    state.rocketThrust =
        throttle *
        850;

    /*
       ROCKET MOVEMENT

       0.035 gives a visible but
       controllable movement in the
       3D world.
    */

    rocket.position.y +=
        state.verticalVelocity *
        dt *
        0.035;

    /*
       NATURAL VIBRATION
    */

    rocket.position.x =
        Math.sin(
            state.missionTime * 40
        ) *
        0.025;

    rocket.rotation.z =
        Math.sin(
            state.missionTime * 1.2
        ) *
        0.01;

    /*
       FLAME ANIMATION
    */

    engineFlames.forEach(
        flame => {

            flame.scale.x =
                0.85 +
                Math.random() * 0.25;

            flame.scale.z =
                0.85 +
                Math.random() * 0.25;

            flame.scale.y =
                0.85 +
                throttle * 0.5;
        }
    );

    /*
       SMOKE
    */

    if (
        Math.random() < 0.35
    ) {

        createLaunchSmoke();
    }

    /*
       FUEL EMPTY
    */

    if (
        state.fuel <= 0
    ) {

        state.ignition = false;

        stopEngineFlames();

        showNotification(
            "FUEL",
            "Fuel supply depleted."
        );
    }

    updateSeparatedStages(
        dt
    );

    updateTelemetry();

    updateCameraPosition();

    updateSmoke(
        delta
    );
}


/* =========================================================
   FLIGHT CAMERA
   ========================================================= */

function updateFlightCamera() {

    if (!rocket) {
        return;
    }

    /*
       Camera follows rocket while
       still allowing mouse movement.
    */

    updateCameraPosition();
}


/* =========================================================
   SOLAR SYSTEM MOTION
   ========================================================= */

function updateSolarSystem(
    delta
) {

    if (
        state.paused ||
        state.activeSection === "flight"
    ) {
        return;
    }

    const speed =
        state.simulationSpeed;

    if (sun) {

        sun.rotation.y +=
            delta *
            0.12 *
            speed;
    }

    orbitObjects.forEach(
        planet => {

            const data =
                planet.userData;

            data.angle +=
                data.orbitSpeed *
                delta *
                speed;

            planet.position.x =
                Math.cos(
                    data.angle
                ) *
                data.distance;

            planet.position.z =
                Math.sin(
                    data.angle
                ) *
                data.distance;

            planet.rotation.y +=
                delta *
                0.18 *
                speed;
        }
    );

    /*
       Moon movement
    */

    const earth =
        celestialBodies.Earth;

    const moon =
        celestialBodies.Moon;

    if (
        earth &&
        moon
    ) {

        const angle =
            performance.now() *
            0.00045 *
            speed;

        moon.position.x =
            earth.position.x +
            Math.cos(angle) *
            7;

        moon.position.z =
            earth.position.z +
            Math.sin(angle) *
            7;
    }

    /*
       Earth clouds
    */

    if (earthClouds) {

        earthClouds.rotation.y +=
            delta *
            0.035 *
            speed;
    }
}


/* =========================================================
   TELEMETRY
   ========================================================= */

function updateTelemetry() {

    setText(
        "telemetry-altitude",
        state.altitude.toFixed(2) +
        " km"
    );

    setText(
        "telemetry-velocity",
        state.velocity.toFixed(0) +
        " m/s"
    );

    setText(
        "telemetry-vertical",
        state.verticalVelocity.toFixed(0) +
        " m/s"
    );

    setText(
        "telemetry-throttle",
        Math.round(
            state.throttle
        ) +
        "%"
    );

    setText(
        "telemetry-fuel",
        state.fuel.toFixed(1) +
        "%"
    );

    setText(
        "telemetry-thrust",
        state.rocketThrust.toFixed(0) +
        " kN"
    );

    state.apoapsis =
        Math.max(
            state.altitude,
            0
        );

    state.periapsis =
        Math.max(
            state.altitude - 5,
            0
        );

    setText(
        "telemetry-apoapsis",
        state.apoapsis.toFixed(1) +
        " km"
    );

    setText(
        "telemetry-periapsis",
        state.periapsis.toFixed(1) +
        " km"
    );

    updateMissionClock();
}


/* =========================================================
   MISSION CLOCK
   ========================================================= */

function updateMissionClock() {

    const total =
        Math.floor(
            state.missionTime
        );

    const minutes =
        Math.floor(
            total / 60
        );

    const seconds =
        total % 60;

    setText(
        "simulation-time",
        "T+ " +
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


/* =========================================================
   THROTTLE DISPLAY
   ========================================================= */

function updateThrottleDisplay() {

    setText(
        "throttle-value",
        Math.round(
            state.throttle
        ) +
        "%"
    );

    setText(
        "telemetry-throttle",
        Math.round(
            state.throttle
        ) +
        "%"
    );
}


/* =========================================================
   MISSIONS
   ========================================================= */

function startMission(
    mission
) {

    state.mission =
        mission;

    const names = {

        orbit:
            "EARTH ORBIT",

        moon:
            "LUNAR MISSION",

        mars:
            "MARS MISSION",

        station:
            "STATION DOCKING",

        satellite:
            "SATELLITE DEPLOYMENT",

        "deep-space":
            "DEEP SPACE PROBE"
    };

    const missionName =
        names[mission] ||
        "CUSTOM MISSION";

    setText(
        "flight-mission",
        missionName
    );

    if (
        state.rocketParts.length === 0
    ) {

        activateSection(
            "rocket-builder"
        );

        showNotification(
            "MISSION CONTROL",
            missionName +
            " selected. Build a rocket first."
        );

        return;
    }

    prepareLaunch();
}


/* =========================================================
   PAUSE
   ========================================================= */

function togglePause() {

    state.paused =
        !state.paused;

    state.simulationSpeed =
        state.paused
            ? 0
            : 1;

    updatePauseButton();

    showNotification(
        "SIMULATION",
        state.paused
            ? "Simulation paused."
            : "Simulation resumed."
    );
}


function updatePauseButton() {

    const button =
        document.getElementById(
            "pause-button"
        );

    if (button) {

        button.textContent =
            state.paused
                ? "RESUME"
                : "PAUSE";
    }
}


/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

function handleKeyboard(
    event
) {

    if (
        event.target &&
        (
            event.target.tagName === "INPUT" ||
            event.target.tagName === "TEXTAREA"
        )
    ) {
        return;
    }

    /*
       SPACE = IGNITION
    */

    if (
        event.code === "Space"
    ) {

        event.preventDefault();

        if (
            state.activeSection === "flight"
        ) {

            ignitionSequence();
        }
    }

    /*
       X = STAGE
    */

    if (
        event.key.toLowerCase() === "x"
    ) {

        separateStage();
    }

    /*
       R = RCS
    */

    if (
        event.key.toLowerCase() === "r"
    ) {

        toggleRCS();
    }

    /*
       G = LANDING GEAR
    */

    if (
        event.key.toLowerCase() === "g"
    ) {

        toggleLandingGear();
    }

    /*
       P = PAUSE
    */

    if (
        event.key.toLowerCase() === "p"
    ) {

        togglePause();
    }

    /*
       PLANET KEYS
    */

    if (event.key === "1") {
        selectPlanet("Mercury");
    }

    if (event.key === "2") {
        selectPlanet("Venus");
    }

    if (event.key === "3") {
        selectPlanet("Earth");
    }

    if (event.key === "4") {
        selectPlanet("Moon");
    }

    if (event.key === "5") {
        selectPlanet("Mars");
    }

    if (event.key === "6") {
        selectPlanet("Jupiter");
    }

    if (event.key === "7") {
        selectPlanet("Saturn");
    }

    if (event.key === "8") {
        selectPlanet("Uranus");
    }

    if (event.key === "9") {
        selectPlanet("Neptune");
    }
}


/* =========================================================
   SET CAMERA
   ========================================================= */

function setCamera(
    x,
    y,
    z
) {

    if (!camera) {
        return;
    }

    camera.position.set(
        x,
        y,
        z
    );

    camera.lookAt(
        0,
        0,
        0
    );
}


/* =========================================================
   NOTIFICATIONS
   ========================================================= */

function showNotification(
    title,
    message
) {

    const notification =
        document.getElementById(
            "notification"
        );

    if (!notification) {
        return;
    }

    setText(
        "notification-title",
        title
    );

    setText(
        "notification-text",
        message
    );

    notification.classList.add(
        "visible"
    );

    clearTimeout(
        notificationTimer
    );

    notificationTimer =
        setTimeout(
            () => {

                notification.classList.remove(
                    "visible"
                );

            },
            3000
        );
}


/* =========================================================
   TEXT HELPER
   ========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(
            id
        );

    if (element) {
        element.textContent =
            value;
    }
}


/* =========================================================
   RESIZE
   ========================================================= */

function handleResize() {

    if (!camera || !renderer) {
        return;
    }

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );
}


/* =========================================================
   MAIN ANIMATION LOOP
   ========================================================= */

function animate() {

    requestAnimationFrame(
        animate
    );

    const now =
        performance.now();

    const delta =
        Math.min(
            (now - lastTime) / 1000,
            0.1
        );

    lastTime =
        now;

    updateSolarSystem(
        delta
    );

    updateFlight(
        delta
    );

    if (
        renderer &&
        scene &&
        camera
    ) {

        renderer.render(
            scene,
            camera
        );
    }
}