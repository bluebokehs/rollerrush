import * as THREE from "../node_modules/three/build/three.module.js";
import * as CANNON from "../node_modules/cannon-es/dist/cannon-es.js";
import { OBJLoader } from 'https://cdn.skypack.dev/three@0.131.1/examples/jsm/loaders/OBJLoader.js';

const scene = new THREE.Scene();

let cameraFocus = [0, 0, 0];
let cameraOffset = [0, 0, 0];
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// orthographic camera
//const theHeight = 10 * (window.innerHeight / window.innerWidth);
//const camera = new THREE.OrthographicCamera(-5, 5, theHeight/ 2, theHeight / -2, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", function () {
    var width = window.innerWidth;
    var height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// intitialize CannonJS
const world = new CANNON.World();
world.gravity.set(0, -10, 0); // gravity pulls things down

// create the cylinder

const geometry = new THREE.CylinderGeometry(3, 3, 2, 60);
const material = new THREE.MeshLambertMaterial({ color: 0x77ccff });
const cylinder = new THREE.Mesh(geometry, material);
cylinder.receiveShadow = true;
scene.add(cylinder);

var groundMaterial = new CANNON.Material("groundMaterial");
// Adjust constraint equation parameters for ground/ground contact
var ground_ground_cm = new CANNON.ContactMaterial(
    groundMaterial,
    groundMaterial,
    {
        friction: 0.4,
        restitution: 0.3,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
        frictionEquationStiffness: 1e8,
    }
);

// create physics for cylinder

const cylinderShape = new CANNON.Cylinder(3, 3, 2, 30);
const cylinderMaterial = groundMaterial;
const cylinderBody = new CANNON.Body({ mass: 0, material: groundMaterial });
cylinderBody.addShape(cylinderShape);
cylinderBody.quaternion.setFromAxisAngle(
    new CANNON.Vec3(1, 0, 0),
    -Math.PI / 2
);
world.addBody(cylinderBody);

console.log(cylinderShape);

// Create a slippery material (friction coefficient = 0.0)
var slipperyMaterial = new CANNON.Material("slipperyMaterial");

// The ContactMaterial defines what happens when two materials meet.
// In this case we want friction coefficient = 0.0 when the slippery material touches ground.
var slippery_ground_cm = new CANNON.ContactMaterial(
    groundMaterial,
    slipperyMaterial,
    {
        friction: 0.00018,
        restitution: 0.15,
        contactEquationStiffness: 1e8,
        contactEquationRelaxation: 3,
    }
);

// We must add the contact materials to the world
world.addContactMaterial(slippery_ground_cm);

// We want to have a heavy impact on player collisions
var slippery_slippery_cm = new CANNON.ContactMaterial(
    slipperyMaterial,
    slipperyMaterial,
    {
        friction: 0.1,
        restitution: 2, // the bounce back of the collision
    }
);

// We must add the contact materials to the world
world.addContactMaterial(slippery_slippery_cm);

/*
let levelMesh;
let levelBody;
let levelLoaded = false;
const objLoader = new OBJLoader();
objLoader.load(
    "maps/monkey.obj",
    (object) => {
        scene.add(object);

        levelMesh = object.children[0];
        levelMesh.material = new THREE.MeshNormalMaterial();
        levelMesh.position.x = 0;
        levelMesh.position.y = 3;

        var vertices = [
            0,
            0,
            0, // vertex 0
            1,
            0,
            0, // vertex 1
            0,
            1,
            0, // vertex 2
        ];
        var indices = [
            0,
            1,
            2, // triangle 0
        ];

        const levelShape = new CANNON.Trimesh(vertices, indices);

        console.log(levelShape);
        levelBody = new CANNON.Body({ mass: 1, material: groundMaterial });
        levelBody.addShape(levelShape);
        levelBody.position.x = levelMesh.position.x;
        levelBody.position.y = levelMesh.position.y;
        levelBody.position.z = levelMesh.position.z;

        world.addBody(levelBody);

        levelLoaded = true;
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
    },
    (error) => {
        console.log("An error happened " + error);
    }
);
*/

// create player 1
const player1Geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const player1Material = new THREE.MeshLambertMaterial({ color: 0xff9999 });
const player1 = new THREE.Mesh(player1Geometry, player1Material);
player1.castShadow = true;
player1.position.set(-1, 3, 0);
scene.add(player1);

// create physics for player 1
const shape = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
const body = new CANNON.Body({ mass: 1, material: slipperyMaterial });
body.addShape(shape);
body.position.set(-1, 3, 0);

// create player 2
const player2Geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const player2Material = new THREE.MeshLambertMaterial({ color: 0x99ff99 });
const player2 = new THREE.Mesh(player2Geometry, player2Material);
player2.castShadow = true;
player2.position.set(1, 3, 0);
scene.add(player2);

// create physics for player 2
const shape2 = new CANNON.Box(new CANNON.Vec3(0.25, 0.25, 0.25));
const body2 = new CANNON.Body({ mass: 1, material: slipperyMaterial });
body2.addShape(shape2);
body2.position.set(1, 3, 0);

world.addBody(body);
world.addBody(body2);

// create skybox
const cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
const cubeMaterials = [
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_nx.jpg"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_px.jpg"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_nz.jpg"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_ny.jpg"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_py.jpg"),
        side: THREE.DoubleSide,
    }),
    new THREE.MeshBasicMaterial({
        map: new THREE.TextureLoader().load("images/skybox_pz.jpg"),
        side: THREE.DoubleSide,
    }),
];
const cube = new THREE.Mesh(cubeGeometry, cubeMaterials);
scene.add(cube);

// add fog
//const fog = new THREE.Fog(0x666666, 1000, 5000);
//scene.add(fog);

// set up the lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(10, 20, 0);
directionalLight.castShadow = true;
scene.add(directionalLight);

// move the camera
camera.position.z = 4;
camera.position.y = 5;
camera.position.x = 0;
camera.lookAt(
    (body2.position.x + body.position.x) / 2,
    (body2.position.y + body.position.y) / 2,
    (body2.position.z + body.position.z) / 2
);

// set camera offset
cameraOffset[0] = camera.position.x - (body2.position.x + body.position.x) / 2;
cameraOffset[1] = camera.position.y - (body2.position.y + body.position.y) / 2;
cameraOffset[2] = camera.position.z - (body2.position.z + body.position.z) / 2;

document.addEventListener("keyup", (event) => {
    const keyName = event.key;

    // player 1
    if (keyName == "w") {
        // move player forwards
        body.applyForce(new CANNON.Vec3(0, 0, -180), body.position);
    }
    if (keyName == "s") {
        // move player backwards
        body.applyForce(new CANNON.Vec3(0, 0, 180), body.position);
    }
    if (keyName == "a") {
        // move player left
        body.applyForce(new CANNON.Vec3(-180, 0, 0), body.position);
    }
    if (keyName == "d") {
        // move player right
        body.applyForce(new CANNON.Vec3(180, 0, 0), body.position);
    }

    // player 2
    if (keyName == "ArrowUp") {
        // move player forwards
        body2.applyForce(new CANNON.Vec3(0, 0, -180), body2.position);
    }
    if (keyName == "ArrowDown") {
        // move player backwards
        body2.applyForce(new CANNON.Vec3(0, 0, 180), body2.position);
    }
    if (keyName == "ArrowLeft") {
        // move player left
        body2.applyForce(new CANNON.Vec3(-200, 0, 0), body2.position);
    }
    if (keyName == "ArrowRight") {
        // move player right
        body2.applyForce(new CANNON.Vec3(200, 0, 0), body2.position);
    }
});

const clock = new THREE.Clock();
let delta;

// game logic
const update = function () {
    //console.log(player1.position.y);
    //executeMoves();

    // camera

    cameraFocus = [
        (body2.position.x + body.position.x) / 2,
        (body2.position.y + body.position.y) / 2,
        (body2.position.z + body.position.z) / 2,
    ];
    camera.position.set(
        cameraOffset[0] + cameraFocus[0],
        cameraOffset[1] + cameraFocus[1],
        cameraOffset[2] + cameraFocus[2]
    );

    if (body.position.y < -5 || body2.position.y < -5) {
        reset();
    }

    // update three.js player 1
    player1.position.set(body.position.x, body.position.y, body.position.z);
    player1.quaternion.set(
        body.quaternion.x,
        body.quaternion.y,
        body.quaternion.z,
        body.quaternion.w
    );

    // update three.js player 2
    player2.position.set(body2.position.x, body2.position.y, body2.position.z);
    player2.quaternion.set(
        body2.quaternion.x,
        body2.quaternion.y,
        body2.quaternion.z,
        body2.quaternion.w
    );

    /*
    if (levelLoaded) {
        levelMesh.position.set(
            levelBody.position.x,
            levelBody.position.y,
            levelBody.position.z
        );
        levelMesh.quaternion.set(
            levelBody.quaternion.x,
            levelBody.quaternion.y,
            levelBody.quaternion.z,
            levelBody.quaternion.w
        );
    }
    */
};

// draw Scene
const render = function () {
    renderer.render(scene, camera);
};

//resets players to original positions
const reset = function () {
    body.position.x = -1;
    body.position.y = 3;
    body.position.z = 0;
    body2.position.x = 1;
    body2.position.y = 3;
    body2.position.z = 0;
    body.velocity = new CANNON.Vec3(0, 0, 0);
    body2.velocity = new CANNON.Vec3(0, 0, 0);
};

// run game loop (update, render, repeat)
const GameLoop = function () {
    requestAnimationFrame(GameLoop);
    delta = Math.min(clock.getDelta(), 0.1);
    world.step(delta);
    update();
    render();
};

GameLoop();
