import * as THREE from 'three';

export const ConfigsFactory= {
    scene() {
        return new THREE.Scene()
    },
    perspectiveCamera() {
       return  new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    },
    webGlRenderer(){
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setSize(window.innerWidth, window.innerHeight);
        return renderer;
    }
}
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

export const GeometryFactory ={
    box(width, height, depth){
        return new THREE.BoxGeometry(width, height, depth)
    }
}