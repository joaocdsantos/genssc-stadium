// services/ThreeService.js
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ChairModel} from "../models/ChairModel";
import {COLORS, ROW_LETTERS, STADIUM} from "../constants/stadium";
import { MaterialFactory } from "../factories/threeFactories"


export class ThreeService {
    constructor(container, occupants = [], onSeatClick = () => {}) {
        this.container = container;

        //TODO - to check
        // mapping original JSON key from Portuguese to English
        this.occupants = occupants.map(seat => ({
            section: seat.seccao,
            row: seat.fila,
            seat: seat.lugar,
            sponsor_name: seat.nome,
        }));

        this.onSeatClick = onSeatClick;

        // Three core
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;

        //internal data
        this.chairMeshes = [];
        this._raf = null;

        // binds
        this.onResize = this.onResize.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
    }

    init() {
        this.setupScene();
        this.buildStadiumStructure();
        this.setupCameraAndControls()
        this.animate();

        // listeners
        window.addEventListener('resize', this.onResize);
        window.addEventListener('click', this.onMouseClick);
    }

    /**
     * Renderer & lights configuration
     */
    setupScene() {
        // configs
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container.appendChild(this.renderer.domElement);
        // lights
        this.scene.add(new THREE.AmbientLight(COLORS.ECLIPSE));
        this.scene.add(new THREE.DirectionalLight(COLORS.WHITE, 0.5));
    }
    buildStadiumStructure(){
        // creating materials for seats
        const redMaterial = MaterialFactory.basic(COLORS.RED);
        const whiteMaterial = MaterialFactory.basic(COLORS.WHITE);
        const greenMaterial = MaterialFactory.basic(COLORS.GREEN);

        // starting seat positions
        const redStartX = 0;
        const whiteStartX = redStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;
        const greenStartX = whiteStartX + STADIUM.WHITE_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;

        // build stadium seats
        const createChair = (x, y, z, material, chairModel) => {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const chair = new THREE.Mesh(geometry, material);
            chair.position.set(x, y, z);
            chair.rotation.y = Math.PI;
            chair.userData = {...chairModel, originalVisibility: true, originalMaterial: material};

            // Adicionar evento de clique
            chair.onClick = () => this.onSeatClick({...chair.userData})
            console.log(chair.userData);

            // Verificar colisão com pilares e esconder a cadeira que colide
            const pillarCollision = isCollisionWithPillar(x, z);
            if (pillarCollision) {
                chair.visible = false;
                chair.userData.originalVisibility = false;
            }
            return chair;
        }

        // build stadium pillars
        function createPillar(x, y, z, height, color) {
            const geometry = new THREE.BoxGeometry(0.3, height, 0.3);
            const material = new THREE.MeshBasicMaterial({color: color});
            const pillar = new THREE.Mesh(geometry, material);
            pillar.position.set(x, y - height / 2, z);
            return pillar;
        }

        // check collision between seats and pillars
        function isCollisionWithPillar(chairX, chairZ) {
            const pillarPositions = [
                {x: greenPillarX, z: STADIUM.Z_START + 5},
                {x: whitePillarX, z: STADIUM.Z_START + 5},
                {x: redPillarX, z: STADIUM.Z_START + 5}
            ];

            const chairRadius = 0.25;
            const pillarRadius = 0.15;

            for (const pillar of pillarPositions) {
                const distanceSquared = (pillar.x - chairX) ** 2 + (pillar.z - chairZ) ** 2;
                const minDistance = (pillarRadius + chairRadius) ** 2;

                if (distanceSquared < minDistance) {
                    return true;
                }
            }
            return false;
        }

        // build stadium step
        function createStep(width, depth, height, x, y, z) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({color: COLORS.LIGHT_GREY});
            const step = new THREE.Mesh(geometry, material);
            step.position.set(x, y, z);
            return step;
        }

        // build stadium wall
        function createWall(width, height, depth, x, y, z) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({color: greenMaterial});
            const wall = new THREE.Mesh(geometry, material);
            wall.position.set(x, y, z);
            return wall;
        }

        // Função auxiliar para obter a letra baseada na linha
        function getLetterForRow(rowIndex) {
            return ROW_LETTERS[rowIndex] || '';
        }

        // Função auxiliar para obter a numeração correta
        function getNumberForColumn(colIndex) {
            return (STADIUM.GREEN_COLUMNS - colIndex) || '';
        }

        // steps total width
        const totalWidthDegree = (STADIUM.RED_COLUMNS + STADIUM.WHITE_COLUMNS + STADIUM.GREEN_COLUMNS) * STADIUM.SPACING + 2 * STADIUM.GAP_BETWEEN_GROUPS;
        // steps center
        const stepCenterX = (redStartX + greenStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING) / 2;

        // Definir posições dos pilares
        const greenPillarX = greenStartX + 10 * STADIUM.SPACING;
        const whitePillarX = whiteStartX + 10 * STADIUM.SPACING;
        const redPillarX = redStartX + 11 * STADIUM.SPACING;

        for (let i = 0; i < STADIUM.ROWS; i++) {
            // Adicionar cadeiras Verdes (22x6)
            for (let j = 0; j < STADIUM.GREEN_COLUMNS; j++) {
                const chairX = greenStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'verde',
                    row: getLetterForRow(i),
                    seat: getNumberForColumn(j),
                    sponsor_name: ''
                });

                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, greenMaterial, chairModel,
                    () => {
                        selectedChair.value = {...chair.userData};
                        modalVisible.value = true;
                    }
                );
                this.chairMeshes.push(chair);
                this.scene.add(chair);
            }
            // Adicionar cadeiras brancas (21x6)
            for (let j = 0; j < STADIUM.WHITE_COLUMNS; j++) {
                const chairX = whiteStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'branca',
                    row: getLetterForRow(i),
                    seat: getNumberForColumn(j + 1),
                    sponsor_name: ''
                });

                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, whiteMaterial, chairModel,
                    () => {
                        selectedChair.value = {...chair.userData};
                        modalVisible.value = true;
                    });
                this.chairMeshes.push(chair);
                this.scene.add(chair);
            }
            // Adicionar cadeiras vermelhas (22x6)
            for (let j = 0; j < STADIUM.RED_COLUMNS; j++) {
                const chairX = redStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'vermelha',
                    row: getLetterForRow(i),
                    seat: getNumberForColumn(j),
                    sponsor_name: ''
                });

                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, redMaterial, chairModel,
                    () => {
                        selectedChair.value = {...chair.userData};
                        modalVisible.value = true;
                    });
                this.chairMeshes.push(chair);
                this.scene.add(chair);
            }
        }
        this.updateNames()
        // ADICIONAR DEGRAUS
        const extraSteps = 3;
        for (let i = -extraSteps; i < STADIUM.ROWS; i++) {
            const extraStepLength = 1.0;
            const step = createStep(totalWidthDegree + 2 * extraStepLength, STADIUM.SPACING, STADIUM.STEP_HEIGHT, stepCenterX, i * STADIUM.STEP_HEIGHT - STADIUM.STEP_HEIGHT / 2, STADIUM.Z_START + i * STADIUM.SPACING);
            this.scene.add(step);
        }

        // ADICIONAR DEGRAUS COBERTURA
        const coverWidth = totalWidthDegree;
        const coverDepth = STADIUM.ROWS * STADIUM.SPACING;
        const coverThickness = 0.5;

        const coverGeometry = new THREE.BoxGeometry(coverWidth, coverThickness, coverDepth);
        const coverMaterial = new THREE.MeshPhongMaterial({color: COLORS.GREY_METAL});
        const cover = new THREE.Mesh(coverGeometry, coverMaterial);

        const coverHeight = 2.0;

        cover.position.set(
            stepCenterX,
            STADIUM.ROWS * STADIUM.STEP_HEIGHT + 0.5 + coverHeight + coverThickness / 2,
            STADIUM.Z_START + (STADIUM.ROWS * STADIUM.SPACING) / 2 - STADIUM.SPACING / 2
        );
        this.scene.add(cover);

        // ADICIONAR PILARES
        const pillarHeight = STADIUM.ROWS * STADIUM.STEP_HEIGHT + 0.5 + coverHeight;

        const greenPillar = createPillar(greenPillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, COLORS.GREY_METAL);
        this.scene.add(greenPillar);

        const whitePillar = createPillar(whitePillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, COLORS.GREY_METAL);
        this.scene.add(whitePillar);

        const redPillar = createPillar(redPillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, COLORS.GREY_METAL);
        this.scene.add(redPillar);

        // Adicionar muro junto ao primeiro degrau
        const wallHeight = 2;
        const wallThickness = 0.2;
        const wallY = -extraSteps * STADIUM.STEP_HEIGHT - wallHeight / 2;
        const wallZ = -extraSteps - STADIUM.SPACING / 2;

        // Definir a largura do muro igual ao comprimento dos degraus prolongados
        const wallWidth = totalWidthDegree + 2;

        // Ajustar a posição do muro para centralizá-lo
        const wall = createWall(wallWidth, wallHeight, wallThickness, stepCenterX, wallY, wallZ);
        this.scene.add(wall);
    }
    setupCameraAndControls(){
        // Configurar a câmera para mostrar a bancada de frente
        const totalWidth = (STADIUM.RED_COLUMNS + STADIUM.WHITE_COLUMNS + STADIUM.GREEN_COLUMNS) * STADIUM.SPACING;
        const totalHeight = STADIUM.ROWS * STADIUM.STEP_HEIGHT;
        const totalDepth = STADIUM.ROWS * STADIUM.SPACING;

        const centerX = totalWidth / 2;
        const centerY = totalHeight / 2;
        const centerZ = totalDepth / 2;

        const cameraDistance = Math.max(
            totalWidth / (2 * Math.tan(this.camera.fov * Math.PI / 360)),
            totalHeight / (2 * Math.tan(this.camera.fov * Math.PI / 360))
        );

        this.camera.position.set(centerX, centerY + 15, centerZ - cameraDistance);
        this.camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        Object.assign(this.controls, { target: new THREE.Vector3(centerX, centerY, centerZ),
            enablePan: true,
            enableZoom: true,
            enableRotate: true,
            panSpeed: 0.5,
            zoomSpeed: 1.0,
            rotateSpeed: 0.5,
            minDistance: 25,
            maxDistance: 40,
            enableDamping: true,
            dampingFactor: 0.05,
            minPolarAngle: Math.PI / 4,
            maxPolarAngle: Math.PI / 2,
            minAzimuthAngle: (Math.PI * 7 / 8),
            maxAzimuthAngle: -(Math.PI * 7 / 8),
        })
    }
    animate(){
        const loop = () => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this._raf = requestAnimationFrame(animate);
        }
        loop();
    }

    updateNames = () => {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh && object.userData.section) {
                const chairInfo = object.userData;

                // Procure por um ocupante correspondente no JSON
                const occupant = this.occupants.find(data =>
                    data.section === chairInfo.section &&
                    data.row === chairInfo.row &&
                    String(data.seat) === String(chairInfo.seat)
                );
                // Se encontrar um ocupante, atualize o nome da cadeira
                if (occupant) {
                    object.userData.sponsor_name = occupant.sponsor_name;
                }
            }
        });
    }
    highlightByName(query) {
        const searchQuery = (query || '').trim().toLowerCase();

        // restore all seats
        this.chairMeshes.forEach((mesh) => {
            mesh.material = mesh.userData.originalMaterial;
            mesh.visible = mesh.userData.originalVisibility !== false;
        });

        if (!searchQuery) return 0;

        let hits = 0;
        this.chairMeshes.forEach((mesh) => {
            const chairInfo = mesh.userData;
            if (
                chairInfo &&
                chairInfo.sponsor_name &&
                String(chairInfo.sponsor_name).toLowerCase().includes(searchQuery)
            ) {
                if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
                mesh.material = new THREE.MeshBasicMaterial({color: COLORS.GOLD});
                hits++;
            }
        });
        return hits;
    }
    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls?.update?.();
    }
    onMouseClick(event) {
        // Raycast
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height * 2 - 1);

        const mouseVector = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVector, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.onClick) object.onClick();
        }
    }
    dispose() {
        cancelAnimationFrame(this._raf);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('click', this.onMouseClick);

        // dispose de geometrias/materiais
        this.scene?.traverse?.((obj) => {
            if (obj.isMesh) {
                obj.geometry?.dispose?.();
                if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
                else obj.material?.dispose?.();
            }
        });
        this.renderer?.dispose?.();

        if (this.renderer?.domElement?.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }

        this.scene = this.camera = this.renderer = this.controls = null;
        this.chairMeshes = [];
    }
}