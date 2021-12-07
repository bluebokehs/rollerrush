import * as THREE from "./three.js";
import * as CANNON from "./cannon-es.js";
import { OBJLoader } from "https://cdn.skypack.dev/three@0.131.1/examples/jsm/loaders/OBJLoader.js";

function loadLevel(gameData) {
    const objLoader = new OBJLoader();

    switch(gameData.gameLevel) {
        case 1:
            gameData.gameLevel = "../maps/level5.obj"
            break;
        case 2:
            gameData.gameLevel = "../maps/level6.obj"
            break;
        default:
            gameData.gameLevel = "../maps/level5.obj"
    }

    objLoader.load(
        "../maps/level5.obj",
        (object) => {
            gameData.gameScene.add(object);

            var levelMesh = object.children[0];
            levelMesh.material = gameData.gameLevelMaterial;
            levelMesh.position.x = 0;
            levelMesh.position.y = -3;

            const vertices = levelMesh.geometry.attributes.position.array;
            const indices = Object.keys(vertices).map(Number);
            const levelShape = new CANNON.Trimesh(vertices, indices);

            gameData.gameLevelBody.addShape(levelShape);
            gameData.gameLevelBody.position.x = levelMesh.position.x;
            gameData.gameLevelBody.position.y = levelMesh.position.y;
            gameData.gameLevelBody.position.z = levelMesh.position.z;

            gameData.gameLevelMesh = levelMesh;
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

export function LevelLoader(gameData) {
    return loadLevel(gameData);
}
