import * as THREE from 'three';

export const MaterialFactory = {
    basic(color){
        return new THREE.MeshBasicMaterial({color: color});
    },
    phong(color){
        return new THREE.MeshPhongMaterial({color: color});
    }
}

export const LightFactory = {
    ambient(color, intensity) {
        return new THREE.AmbientLight(color, intensity)
    },
    directional(color, intensity, position) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...position);
        return light;
    }
}