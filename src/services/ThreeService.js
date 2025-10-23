// services/ThreeService.js
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {ChairModel} from "../models/ChairModel";
import {COLORS, LIGHT, ROW_LETTERS, SEAT, STADIUM} from "../constants/stadium.js";
import {ConfigsFactory, GeometryFactory, LightFactory, MaterialFactory} from "../factories/ThreeFactories.js"


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
        this.eventListeners();
    }

    /**
     * Renderer & lights configuration
     */
    setupScene() {
        // configs
        this.scene = ConfigsFactory.scene()
        this.camera = ConfigsFactory.perspectiveCamera()
        this.renderer = ConfigsFactory.webGlRenderer()
        this.container.appendChild(this.renderer.domElement);

        // lights
        this.scene.add(LightFactory.ambient(COLORS.ECLIPSE, LIGHT.AMBIENT.INTENSITY));
        this.scene.add(LightFactory.directional(COLORS.WHITE, LIGHT.DIRECTIONAL.INTENSITY, LIGHT.DIRECTIONAL.POSITION));
    }

    buildStadiumStructure() {
        // creating materials
        const redMaterial = MaterialFactory.basic(COLORS.RED);
        const whiteMaterial = MaterialFactory.basic(COLORS.WHITE);
        const greenMaterial = MaterialFactory.basic(COLORS.GREEN);
        const lightGrey = MaterialFactory.phong(COLORS.LIGHT_GREY)
        const metalGrey = MaterialFactory.basic(COLORS.GREY_METAL)
        const phongMetalGrey = MaterialFactory.phong(COLORS.GREY_METAL)

        // starting seat positions
        const redStartX = 0;
        const whiteStartX = redStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;
        const greenStartX = whiteStartX + STADIUM.WHITE_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;

        // build stadium seats
        const createChair = (x, y, z, material, chairModel) => {
            const chairGeometry = GeometryFactory.box(SEAT.WIDTH, SEAT.HEIGHT, SEAT.DEPTH);
            const chair = new THREE.Mesh(chairGeometry, material);
            chair.position.set(x, y, z);
            chair.rotation.y = Math.PI;
            chair.userData = {...chairModel, originalVisibility: true, originalMaterial: material};

            // click event
            chair.onClick = () => this.onSeatClick({...chair.userData})

            // check if seat collide with pillars, and hide it
            const pillarCollision = isCollisionWithPillar(x, z);
            if (pillarCollision) {
                chair.visible = false;
                chair.userData.originalVisibility = false;
            }
            return chair;
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

        // steps total width
        const totalWidthDegree = (STADIUM.RED_COLUMNS + STADIUM.WHITE_COLUMNS + STADIUM.GREEN_COLUMNS) * STADIUM.SPACING + 2 * STADIUM.GAP_BETWEEN_GROUPS;
        // steps center
        const stepCenterX = (redStartX + greenStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING) / 2;


        // ******* PILLARS *********
        // pillar positions
        const greenPillarX = greenStartX + 10 * STADIUM.SPACING;
        const whitePillarX = whiteStartX + 10 * STADIUM.SPACING;
        const redPillarX = redStartX + 11 * STADIUM.SPACING;

        const pillarHeight = STADIUM.ROWS * STADIUM.STEP_HEIGHT + 0.5 + 2.0;

        // add pillars
        const greenPillar = this._buildPillar(greenPillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, metalGrey);
        const whitePillar = this._buildPillar(whitePillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, metalGrey);
        const redPillar = this._buildPillar(redPillarX, pillarHeight, STADIUM.Z_START + 5, pillarHeight, metalGrey);
        this.scene.add(whitePillar).add(greenPillar).add(redPillar);
        // ************************




        for (let i = 0; i < STADIUM.ROWS; i++) {
            // add green seats (22x6)
            for (let j = 0; j < STADIUM.GREEN_COLUMNS; j++) {
                const chairX = greenStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'verde',
                    row: this._getLetterForRow(i),
                    seat: this._getNumberForColumn(j),
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
            // add white seats (21x6)
            for (let j = 0; j < STADIUM.WHITE_COLUMNS; j++) {
                const chairX = whiteStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'branca',
                    row: this._getLetterForRow(i),
                    seat: this._getNumberForColumn(j + 1),
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
            // add red seats (22x6)
            for (let j = 0; j < STADIUM.RED_COLUMNS; j++) {
                const chairX = redStartX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: 'vermelha',
                    row: this._getLetterForRow(i),
                    seat: this._getNumberForColumn(j),
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

        // ************************

        this.updateNames()


        // ******* EXTRA STEPS *********
        // add steps
        const extraSteps = 3;
        for (let i = -extraSteps; i < STADIUM.ROWS; i++) {
            const step = this._buildStep(totalWidthDegree + 2, STADIUM.SPACING, STADIUM.STEP_HEIGHT, stepCenterX, i * STADIUM.STEP_HEIGHT - STADIUM.STEP_HEIGHT / 2, STADIUM.Z_START + i * STADIUM.SPACING, lightGrey);
            this.scene.add(step);
        }
        // ************************

        // ******* COVER *********
        // add cover
        const coverWidth = totalWidthDegree;
        const coverDepth = STADIUM.ROWS * STADIUM.SPACING;
        const coverThickness = 0.5;
        const coverHeight = 2.0;

        const roofX =stepCenterX;
        const roofY = STADIUM.ROWS * STADIUM.STEP_HEIGHT + 0.5 + coverHeight + coverThickness / 2;
        const roofZ = STADIUM.Z_START + (STADIUM.ROWS * STADIUM.SPACING) / 2 - STADIUM.SPACING / 2;

        const roof = this._buildRoof(coverWidth,coverHeight,coverDepth, roofX, roofY, roofZ, phongMetalGrey);
        this.scene.add(roof);
        // ************************

        // ******* WALL *********
        // add wall beside first step
        const wallHeight = 2;
        const wallThickness = 0.2;
        const wallY = -extraSteps * STADIUM.STEP_HEIGHT - wallHeight / 2;
        const wallZ = -extraSteps - STADIUM.SPACING / 2;
        const wallWidth = totalWidthDegree + 2; // define wall width equals to steps length

        const wall = this._buildWall(wallWidth, wallHeight, wallThickness, stepCenterX, wallY, wallZ,lightGrey);
        this.scene.add(wall);
        // ************************
    }
    setupCameraAndControls() {
        // configure camera to show bench on front
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
        Object.assign(this.controls, {
            target: new THREE.Vector3(centerX, centerY, centerZ),
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
    animate() {
        const loop = () => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this._raf = requestAnimationFrame(loop);
        }
        loop();
    }
    eventListeners() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('click', this.onMouseClick);
    }


// ======================================
// PRIVATE METHODS
// ======================================

    //* get letter based on row
    _getLetterForRow(rowIndex) {
        return ROW_LETTERS[rowIndex] || '';
    }

    //* get number seat
    _getNumberForColumn(colIndex) {
        return (STADIUM.GREEN_COLUMNS - colIndex) || '';
    }

    //* build seat on each section
    _buildSectionSeats({ sectionName, material, startX, columns }) {
        for (let i = 0; i < STADIUM.ROWS; i++) {
            for (let j = 0; j < columns; j++) {
                const chairX = startX + j * STADIUM.SPACING;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const chairModel = new ChairModel({
                    section: sectionName,
                    row: this._getLetterForRow(i),
                    seat: this._getNumberForColumn(j),
                    sponsor_name: ''
                });

                const chair = this._createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, material, chairModel);
                this.chairMeshes.push(chair);
                this.scene.add(chair);
            }
        }
    }

    //* build stadium steps
    _buildStep(width, depth, height, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth);
        const step = new THREE.Mesh(geometry, material);
        step.position.set(x, y, z);
        return step;
    }

    //* build stadium pillars
    _buildPillar(x, y, z, height, material) {
        const geometry = GeometryFactory.box(0.3, height, 0.3);
        const pillar = new THREE.Mesh(geometry, material);
        pillar.position.set(x, y - height / 2, z);
        return pillar;
    }

    //* build stadium wall
    _buildWall(width, height, depth, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth);
        const wall = new THREE.Mesh(geometry, material);
        wall.position.set(x, y, z);
        return wall;
    }

    //* build stadium roof
    _buildRoof(width,height,depth, x, y, z, material) {
        const geometry = GeometryFactory.box(width,height,depth, material)
        const roof = new THREE.Mesh(geometry, material);
        roof.position.set(x, y, z);
        return roof;
    }

// ======================================

    updateNames = () => {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh && object.userData.section) {
                const chairInfo = object.userData;

                // Search for correspondent sponsor name on JSON
                const occupant = this.occupants.find(data =>
                    data.section === chairInfo.section &&
                    data.row === chairInfo.row &&
                    String(data.seat) === String(chairInfo.seat)
                );
                // If founded, update chair sponsor name
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
                mesh.material = MaterialFactory.basic(COLORS.GOLD);
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
        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(),         // origem
            new THREE.Vector3(0, 0, -1), // direção
            0,                           // near
            Infinity                     // far
        );
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

        // dispose of geometries/materials
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