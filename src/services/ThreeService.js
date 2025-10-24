// services/ThreeService.js
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {SeatModel} from "../models/SeatModel";
import {COLORS} from "../constants/colors.js";
import {LIGHT, PILLAR, ROW_LETTERS, SEAT, STADIUM} from "../constants/stadium.js";
import {ConfigsFactory, GeometryFactory, LightFactory, MaterialFactory, MeshFactory} from "../factories/ThreeFactories.js"


export class ThreeService {
    constructor(container, occupants = [], onSeatClick = () => {}) {
        this.container = container;

        //TODO - original JSON key from Portuguese to English
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

    // ======================================
    //          PUBLIC METHODS
    // ======================================
    /** Creates the Three.js scene, camera, renderer, and lights. */
    setupScene() {

        // Three.js base configurations
        this.scene = ConfigsFactory.scene()
        this.camera = ConfigsFactory.perspectiveCamera()
        this.renderer = ConfigsFactory.webGlRenderer()
        this.container.appendChild(this.renderer.domElement);

        // Ambient & directional lights
        this.scene.add(LightFactory.ambient(COLORS.ECLIPSE, LIGHT.AMBIENT.INTENSITY));
        this.scene.add(LightFactory.directional(COLORS.WHITE, LIGHT.DIRECTIONAL.INTENSITY, LIGHT.DIRECTIONAL.POSITION));
    }

    /** Builds the entire stadium structure. */
    buildStadiumStructure() {
        this._createMaterials();
        this._buildPillars();
        this._buildSeatSections()
        this._buildSteps()
        this._buildWall()
        this._buildRoof()
        this.updateNames()
    }

    /** Initializes the camera position and orbit controls. */
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

    /**  Starts the render loop for continuous scene updates */
    animate() {
        const loop = () => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this._raf = requestAnimationFrame(loop);
        }
        loop();
    }

    /** Adds window event listeners for resize and click */
    eventListeners() {
        window.addEventListener('resize', this.onResize);
        window.addEventListener('click', this.onMouseClick);
    }
    // ======================================


    // ======================================
    //          PRIVATE METHODS
    // ======================================
    /** creates needed three materials */
    _createMaterials(){
        this.materials = {
            red: MaterialFactory.basic(COLORS.RED),
            white: MaterialFactory.basic(COLORS.WHITE),
            green: MaterialFactory.basic(COLORS.GREEN),
            lightGrey: MaterialFactory.phong(COLORS.LIGHT_GREY),
            metalGrey: MaterialFactory.basic(COLORS.GREY_METAL),
            phongMetalGrey: MaterialFactory.phong(COLORS.GREY_METAL),
            gold: MaterialFactory.basic(COLORS.GOLD)
        };
    }

    /** builds stadium pillars */
    _buildPillars() {
        const { metalGrey } = this.materials;

        const pillarHeight = STADIUM.ROWS * STADIUM.STEP_HEIGHT + 3;

        const redStartX = 0;
        const whiteStartX = redStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;
        const greenStartX = whiteStartX + STADIUM.WHITE_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;

        const redPillarX = redStartX + 11;
        const whitePillarX = whiteStartX + 10;
        const greenPillarX = greenStartX + 10;

        this._pillarPositions = [
            { x: greenPillarX, z: STADIUM.Z_START + 5 },
            { x: whitePillarX, z: STADIUM.Z_START + 5 },
            { x: redPillarX, z: STADIUM.Z_START + 5 },
        ];

        const pillars = this._pillarPositions.map(pos =>
            this._buildPillarMesh(PILLAR.WIDTH, pillarHeight, PILLAR.DEPTH, pos.x, pillarHeight, pos.z, metalGrey)
        );

        pillars.forEach(pillar => this.scene.add(pillar));
    }

    /** build stadium section and seats */
    _buildSeatSections(){
        const { red, white, green } = this.materials;

        const redStartX = 0;
        const whiteStartX = redStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;
        const greenStartX = whiteStartX + STADIUM.WHITE_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;

        this._buildSectionSeats({ sectionName: 'verde', material: green, startX: greenStartX, columns: STADIUM.GREEN_COLUMNS });
        this._buildSectionSeats({ sectionName: 'branca', material: white, startX: whiteStartX, columns: STADIUM.WHITE_COLUMNS });
        this._buildSectionSeats({ sectionName: 'vermelha', material: red, startX: redStartX, columns: STADIUM.RED_COLUMNS });
    }

    /** build stadium steps */
    _buildSteps() {
        const { lightGrey } = this.materials;

        const totalWidth = this._getTotalWidth();

        const stepCenterX = totalWidth / 2;
        const extraSteps = 3;

        for (let i = -extraSteps; i < STADIUM.ROWS; i++) {
            const y = i * STADIUM.STEP_HEIGHT - STADIUM.STEP_HEIGHT / 2;
            const z = STADIUM.Z_START + i * STADIUM.SPACING;

            const step = this._buildStepMesh(
                totalWidth + 2,
                STADIUM.SPACING,
                STADIUM.STEP_HEIGHT,
                stepCenterX,
                y,
                z,
                lightGrey
            );

            this.scene.add(step);
        }
    }

    /** build stadium wall */
    _buildWall() {
        const { lightGrey } = this.materials;

        const totalWidth = this._getTotalWidth();

        const stepCenterX = totalWidth / 2;
        const extraSteps = 3;

        const wallHeight = 2;
        const wallThickness = 0.2;
        const wallY = -extraSteps * STADIUM.STEP_HEIGHT - wallHeight / 2;
        const wallZ = -extraSteps - STADIUM.SPACING / 2;
        const wallWidth = totalWidth + 2;

        const wall = this._buildWallMesh(
            wallWidth,
            wallHeight,
            wallThickness,
            stepCenterX,
            wallY,
            wallZ,
            lightGrey
        );

        this.scene.add(wall);
    }

    /** build stadium roof */
    _buildRoof() {
        const { phongMetalGrey } = this.materials;

        // cálculo das dimensões gerais do estádio
        const totalWidth = this._getTotalWidth();

        const coverWidth = totalWidth;
        const coverDepth = STADIUM.ROWS * STADIUM.SPACING;
        const coverHeight = 0.5;
        const coverThickness = 0.5;

        const roofX = totalWidth / 2;
        const roofY =
            STADIUM.ROWS * STADIUM.STEP_HEIGHT +
            2 +
            coverHeight +
            coverThickness / 2;
        const roofZ =
            STADIUM.Z_START +
            (STADIUM.ROWS * STADIUM.SPACING) / 2 -
            STADIUM.SPACING / 2;

        // cria a geometria do teto
        const roof = this._buildRoofMesh(
            coverWidth,
            coverHeight,
            coverDepth,
            roofX,
            roofY,
            roofZ,
            phongMetalGrey
        );

        this.scene.add(roof);
    }

    /** get letter based on row */
    _getLetterForRow(rowIndex) {
        return ROW_LETTERS[rowIndex] || '';
    }

    /** get number seat */
    _getNumberForColumn(colIndex) {
        return (STADIUM.GREEN_COLUMNS - colIndex) || '';
    }

    /** get total width */
    _getTotalWidth() {
        return (
            (STADIUM.RED_COLUMNS + STADIUM.WHITE_COLUMNS + STADIUM.GREEN_COLUMNS) * STADIUM.SPACING +
            2 * STADIUM.GAP_BETWEEN_GROUPS
        );
    }

    /**  check if seat collides with a pillar */
    _isCollisionWithPillar(x, z) {
        const positions = this._pillarPositions || [];
        const chairRadius = 0.25, pillarRadius = 0.15;

        return positions.some(p => ((p.x - x) ** 2 + (p.z - z) ** 2) < (pillarRadius + chairRadius) ** 2);
    }

    /** build sections */
    _buildSectionSeats({sectionName, material, startX, columns}) {
        for (let i = 0; i < STADIUM.ROWS; i++) {
            for (let j = 0; j < columns; j++) {
                const chairX = startX + j;
                const chairZ = STADIUM.Z_START + i * STADIUM.SPACING;

                const seatModel = new SeatModel({
                    section: sectionName,
                    row: this._getLetterForRow(i),
                    seat: this._getNumberForColumn(j),
                    sponsor_name: ''
                });

                const seat = this._buildChairMesh(SEAT.WIDTH, SEAT.HEIGHT, SEAT.DEPTH, chairX, i * STADIUM.STEP_HEIGHT + SEAT.HEIGHT / 2 - STADIUM.STEP_HEIGHT / 2, chairZ, material, seatModel);
                this.chairMeshes.push(seat);
                this.scene.add(seat);
            }
        }
    }

    /** build a seat */
    _buildChairMesh(width,height,depth, x, y, z, material, seatModel) {
        const geometry = GeometryFactory.box(width, height, depth);
        const seat = MeshFactory.create(geometry, material,
            {position: [x, y, z], rotation: [0,0,Math.PI]});

        seat.userData = {...seatModel, originalVisibility: true, originalMaterial: material};

        seat.onClick = () => this.onSeatClick({...seat.userData});

        if (this._isCollisionWithPillar(x, z)) {
            seat.visible = false;
            seat.userData.originalVisibility = false;
        }
        return seat;
    }

    /**  build a step */
    _buildStepMesh(width, depth, height, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth);
        return MeshFactory.create(geometry, material,
            {position: [x, y - height / 2, z]});
    }

    /**  build a pillar */
    _buildPillarMesh(width, height, depth, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth);
        return MeshFactory.create(geometry, material,
            {position: [x, y - height / 2, z]});
    }

    /**  build a wall */
    _buildWallMesh(width, height, depth, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth);
        return MeshFactory.create(geometry, material,
            {position: [x, y, z]});
    }

    /**  build a roof */
    _buildRoofMesh(width, height, depth, x, y, z, material) {
        const geometry = GeometryFactory.box(width, height, depth)
        return MeshFactory.create(geometry, material,
            {position: [x, y, z]});
    }



    // ======================================


    // ======================================
    //          OTHERS METHODS
    // ======================================

    /** update userData property of seat with JSON file data */
    updateNames = () => {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh && object.userData.section) {
                const chairInfo = object.userData;

                const occupant = this.occupants.find(data =>
                    data.section === chairInfo.section &&
                    data.row === chairInfo.row &&
                    String(data.seat) === String(chairInfo.seat)
                );
                // If founded, update seat sponsor name
                if (occupant) {
                    object.userData.sponsor_name = occupant.sponsor_name;
                }
            }
        });
    }

    /** highlights seats when a sponsor was selected */
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
                if (!mesh.userData.originalMaterial) {
                    mesh.userData.originalMaterial = mesh.material;
                }
                if (!this.materials.gold) {
                    this.materials.gold = MaterialFactory.basic(COLORS.GOLD);
                }
                mesh.material = this.materials.gold;
                hits++;
            }
        });
        return hits;
    }

    /** update size page properties when changed */
    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls?.update?.();
    }

    /** catch the mouse click on seat for display modal info */
    onMouseClick(event) {

        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height * 2 - 1);

        const mouseVector = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(),                 // start
            new THREE.Vector3(0, 0, -1), // direction
            0,                              // near
            Infinity                             // far
        );
        raycaster.setFromCamera(mouseVector, this.camera);

        const intersects = raycaster.intersectObjects(this.scene.children, true);
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.onClick) object.onClick();
        }
    }

    /** disposes of all Three.js resources and event listeners to prevent memory leaks */
    dispose() {
        cancelAnimationFrame(this._raf);
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('click', this.onMouseClick);

        // dispose of geometries/materials in scene
        this.scene?.traverse?.((obj) => {
            if (obj.isMesh) {
                obj.geometry?.dispose?.();
                if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose?.());
                else obj.material?.dispose?.();
            }
        });

        // dispose custom materials
        Object.values(this.materials || {}).forEach(m => m?.dispose?.());
        this.materials = {};

        this.renderer?.dispose?.();

        if (this.renderer?.domElement?.parentNode) {
            this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
        }

        this.scene = this.camera = this.renderer = this.controls = null;
        this.chairMeshes = [];
    }

    // ======================================
}