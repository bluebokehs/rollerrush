import * as THREE from 'three';

const scene = new THREE.Scene();

const reset = function () {
    player1.position.set(-1, 3, 0);
    player2.position.set(1, 3, 0);
}