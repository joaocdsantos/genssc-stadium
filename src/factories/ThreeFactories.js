import * as THREE from 'three';

export const MaterialFactory = {
    basic(color){
        return new THREE.MeshBasicMaterial({color: color});
    },
    phong(color){
        return new THREE.MeshPhongMaterial({color: color});
    }
}