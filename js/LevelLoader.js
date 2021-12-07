import * as CANNON from "./cannon-es.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.131.1/examples/jsm/loaders/OBJLoader.js";

function loadLevel(gameData) {
    switch (gameData.gameLevel) {
        case 1:
            gameData = loadFirstMap(gameData);
            break;
        case 2:
            gameData = loadSecondMap(gameData);
            break;
    }

    return gameData;
}

function loadFirstMap(gameData) {
    const objLoader = new OBJLoader();
    objLoader.load(
        "../maps/level6/inner_ring.obj",
        (object) => {
            gameData.gameScene.add(object);

            var levelMesh = object.children[0];
            levelMesh.material = gameData.gameLevelMaterial;
            levelMesh.position.x = 0;
            levelMesh.position.y = -3;

            const vertices = levelMesh.geometry.attributes.position.array;
            const indices = Object.keys(vertices).map(Number);
            const levelShape = new CANNON.Trimesh(vertices, indices);

            let levelBody = new CANNON.Body({
                mass: 0,
                material: new CANNON.Material("groundMaterial"),
            });

            levelBody.addShape(levelShape);
            levelBody.position.x = levelMesh.position.x;
            levelBody.position.y = levelMesh.position.y;
            levelBody.position.z = levelMesh.position.z;

            gameData.gameWorld.addBody(levelBody);
            gameData.gameLevelLoaded = true;
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
        },
        (error) => {
            console.log("An error happened " + error);
        }
    );
    return gameData;
}

function loadSecondMap(gameData) {
    const objLoader = new OBJLoader();
    let objects = [
        "../maps/level6/outer_ring.obj",
        "../maps/level6/inner_ring.obj",
    ];
    objects.forEach((model) => {
        objLoader.load(
            model,
            (object) => {
                gameData.gameScene.add(object);

                let levelMesh = object.children[0];
                levelMesh.material = gameData.gameLevelMaterial;
                levelMesh.position.x = 0;
                levelMesh.position.y = -3;

                const vertices = levelMesh.geometry.attributes.position.array;
                const indices = Object.keys(vertices).map(Number);
                const levelShape = new CANNON.Trimesh(vertices, indices);

                let levelBody = new CANNON.Body({
                    mass: 0,
                    material: new CANNON.Material("groundMaterial"),
                });

                levelBody.addShape(levelShape);
                levelBody.position.x = levelMesh.position.x;
                levelBody.position.y = levelMesh.position.y;
                levelBody.position.z = levelMesh.position.z;

                gameData.gameWorld.addBody(levelBody);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
            },
            (error) => {
                console.log("An error happened " + error);
            }
        );
    });

    let droppable = [
        "../maps/level6/box2.obj",
        "../maps/level6/box3.obj",
        "../maps/level6/box4.obj",
        "../maps/level6/box5.obj",
        "../maps/level6/box6.obj",
        "../maps/level6/box7.obj",
    ];
    droppable.forEach((model) => {
        for (let i = 0; i < 60; i++) {
            objLoader.load(
                model,
                (object) => {
                    gameData.gameScene.add(object);

                    let levelMesh = object.children[0];
                    levelMesh.material = gameData.gameLevelMaterial;
                    levelMesh.position.x = 0;
                    levelMesh.position.y = -3;
                    levelMesh.rotateOnWorldAxis(
                        new THREE.Vector3(0, 1, 0),
                        THREE.Math.degToRad(i * 6)
                    );

                    const vertices =
                        levelMesh.geometry.attributes.position.array;
                    const indices = Object.keys(vertices).map(Number);
                    const levelShape = new CANNON.Trimesh(vertices, indices);

                    let levelBody = new CANNON.Body({
                        mass: 0,
                        material: new CANNON.Material("groundMaterial"),
                    });

                    levelBody.addShape(levelShape);
                    levelBody.position.x = levelMesh.position.x;
                    levelBody.position.y = levelMesh.position.y;
                    levelBody.position.z = levelMesh.position.z;
                    levelBody.quaternion.x = levelMesh.quaternion.x;
                    levelBody.quaternion.y = levelMesh.quaternion.y;
                    levelBody.quaternion.z = levelMesh.quaternion.z;
                    levelBody.quaternion.w = levelMesh.quaternion.w;

                    gameData.gameWorld.addBody(levelBody);
                    
                    let timeouts = [];

                    gameData.gameObjects.push([
                        levelMesh,
                        levelBody,
                        new CANNON.Vec3(
                            levelBody.position.x,
                            levelBody.position.y,
                            levelBody.position.z
                        ),
                        new CANNON.Quaternion(
                            levelBody.quaternion.x,
                            levelBody.quaternion.y,
                            levelBody.quaternion.z,
                            levelBody.quaternion.w
                        ),
                        timeouts,
                    ]);

                    levelBody.addEventListener("collide", function (e) {
                        timeouts.push(setTimeout(() => {
                            levelBody.type = CANNON.Body.DYNAMIC;
                            levelBody.mass = 1;
                            levelBody.updateMassProperties();
                        }, 1000));
                    });
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
                },
                (error) => {
                    console.log("An error happened " + error);
                }
            );
        }
    });
    gameData.gameLevelLoaded = true;

    return gameData;
}

export function LevelLoader(gameData) {
    return loadLevel(gameData);
}
