import * as THREE from 'three';
import {PERSPECTIVE_CAMERA, SCENE} from "../constants/configs.js";

/** Configs Factory */
export const ConfigsFactory = {
    scene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(SCENE.BACKGROUND_COLOR);
        return scene;
    },
    perspectiveCamera() {
        return new THREE.PerspectiveCamera(PERSPECTIVE_CAMERA.FOV, window.innerWidth / window.innerHeight, PERSPECTIVE_CAMERA.NEAR, PERSPECTIVE_CAMERA.FAR);
    },
    webGlRenderer() {
        const width = window.innerWidth || window.clientWidth;
        const height = window.innerHeight || window.clientHeight;
        const renderer = new THREE.WebGLRenderer({antialias: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        return renderer;
    }
}

/** Material Factory */
export const MaterialFactory = {
    basic(color) {
        return new THREE.MeshBasicMaterial({color: color});
    },
    phong(color) {
        return new THREE.MeshPhongMaterial({color: color});
    },
    standard(color) {
        return new THREE.MeshStandardMaterial({color, roughness: 0.6, metalness: 0.3});
    },
    lambert(color) {
        return new THREE.MeshLambertMaterial({color});
    }
}

/** Lights Factory */
export const LightFactory = {
    ambient(color, intensity) {
        return new THREE.AmbientLight(color, intensity)
    },
    directional(color, intensity, position) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(...position);
        return light;
    },
    point(color, intensity, position) {
        const light = new THREE.PointLight(color, intensity);
        light.position.set(...position);
        return light;
    }
}

/** Geometry Factory */
export const GeometryFactory = {
    box(width, height, depth) {
        return new THREE.BoxGeometry(width, height, depth)
    },
    cylinder(radiusTop, radiusBottom, height, radialSegments = 32) {
        return new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    },
    sphere(radius = 1, widthSegments = 16, heightSegments = 12) {
        return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    },
    plane(width, height) {
        return new THREE.PlaneGeometry(width, height);
    }
};

/** Mesh Factory */
export const MeshFactory = {
    create(geometry, material, {
        position = [0, 0, 0],
        rotation = [0, 0, 0],
        castShadow = true,
        receiveShadow = true,
        userData = {}
    } = {}) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...position);
        mesh.rotation.set(...rotation);
        mesh.castShadow = castShadow;
        mesh.receiveShadow = receiveShadow;
        mesh.userData = userData;
        return mesh;
    },
}