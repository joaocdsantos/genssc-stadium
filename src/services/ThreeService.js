// services/ThreeService.js
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {COLORS, ROW_LETTERS, STADIUM} from "../constants/stadium";


export class ThreeService {
    constructor(container, occupants = [], onSeatClick = () => {
    }) {
        this.container = container;
        this.occupants = occupants;
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


        // creating materials for seats
        const redMaterial = new THREE.MeshBasicMaterial({color: COLORS.RED});
        const whiteMaterial = new THREE.MeshBasicMaterial({color: COLORS.WHITE});
        const greenMaterial = new THREE.MeshBasicMaterial({color: COLORS.GREEN});


        // seat creation factory
        const createChair = (x, y, z, material, chairInfo) => {
            const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
            const chair = new THREE.Mesh(geometry, material);
            chair.position.set(x, y, z);
            chair.rotation.y = Math.PI;
            chair.userData = {...chairInfo, originalVisibility: true, originalMaterial: material};

            // Adicionar evento de clique
            chair.onClick = () => this.onSeatClick({...chair.userData})
            console.log(chair.userData);

            // Verificar colisão com pilares e esconder a cadeira que colide
            const pillarCollision = isCollisionWithPillar(x, z);
            if (pillarCollision) {
                chair.visible = false;
                chair.userData.originalVisibility = false; // Atualiza a visibilidade original se a cadeira estiver oculta
            }
            return chair;
        }

        // Função para criar um pilar
        function createPillar(x, y, z, height, color) {
            const geometry = new THREE.BoxGeometry(0.3, height, 0.3);
            const material = new THREE.MeshBasicMaterial({color: color});
            const pillar = new THREE.Mesh(geometry, material);
            pillar.position.set(x, y - height / 2, z);
            return pillar;
        }

        // Função para verificar colisão com pilares
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

        // Função para criar um degrau
        function createStep(width, depth, height, x, y, z) {
            const geometry = new THREE.BoxGeometry(width, height, depth);
            const material = new THREE.MeshPhongMaterial({color: COLORS.LIGHT_GREY});
            const step = new THREE.Mesh(geometry, material);
            step.position.set(x, y, z);
            return step;
        }

        // Função para criar um muro
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

        // Definir posições de início das cadeiras
        const redStartX = 0;
        const whiteStartX = redStartX + STADIUM.GREEN_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;
        const greenStartX = whiteStartX + STADIUM.WHITE_COLUMNS * STADIUM.SPACING + STADIUM.GAP_BETWEEN_GROUPS;

        // Largura total dos degraus
        const totalWidthDegree = (STADIUM.RED_COLUMNS + STADIUM.WHITE_COLUMNS + STADIUM.GREEN_COLUMNS) * STADIUM.SPACING + 2 * STADIUM.GAP_BETWEEN_GROUPS;
        // Centro dos degraus
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
                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, greenMaterial,
                    {
                        seccao: 'verde',
                        fila: getLetterForRow(i),
                        lugar: getNumberForColumn(j),
                        nome: ``
                    },
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
                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, whiteMaterial, {
                        seccao: 'branca',
                        fila: getLetterForRow(i),
                        lugar: getNumberForColumn(j + 1),
                        nome: ``
                    },
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
                const chair = createChair(chairX, i * STADIUM.STEP_HEIGHT, chairZ, redMaterial,
                    {
                        seccao: 'vermelha',
                        fila: getLetterForRow(i),
                        lugar: getNumberForColumn(j),
                        nome: ``
                    },
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

        // Configurar a câmera para mostrar a bancada de frente
        const totalHeight = STADIUM.ROWS * STADIUM.STEP_HEIGHT;
        const totalDepth = STADIUM.ROWS * STADIUM.SPACING;
        const centerX = totalWidthDegree / 2;
        const centerY = totalHeight / 2;
        const centerZ = totalDepth / 2;

        // Configurar a câmera para mostrar a bancada do lado oposto
        const cameraDistance = Math.max(
            totalWidthDegree / (2 * Math.tan(this.camera.fov * Math.PI / 360)),
            totalHeight / (2 * Math.tan(this.camera.fov * Math.PI / 360))
        );

        this.camera.position.set(centerX, centerY + 15, centerZ - cameraDistance);
        this.camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));

        // Configurar os controles
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.target.set(centerX, centerY, centerZ);
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.panSpeed = 0.5;
        this.controls.zoomSpeed = 1.0;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 25;
        this.controls.maxDistance = 40;
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // // Limite rotação vertical:
        this.controls.minPolarAngle = Math.PI / 4; // 45 graus
        this.controls.maxPolarAngle = Math.PI / 2; // 90 graus
        //
        // // Limite rotação horizontal (ajustado para 180 graus):
        this.controls.minAzimuthAngle = Math.PI * 7 / 8; // 157.5 graus
        this.controls.maxAzimuthAngle = (Math.PI * 7 / 8) * -1; // 202.5 graus


        // Configuração da animação
        const animate = () => {
            this.controls.update();
            this.renderer.render(this.scene, this.camera);
            this._raf = requestAnimationFrame(animate);
        }
        animate();

        // listeners
        window.addEventListener('resize', this.onResize);
        window.addEventListener('click', this.onMouseClick);
    }

    /**
     * Render & lights configuration
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

    updateNames = () => {
        this.scene.traverse((object) => {
            if (object instanceof THREE.Mesh && object.userData.seccao) {
                const chairInfo = object.userData;

                // Procure por um ocupante correspondente no JSON
                const occupant = this.occupants.find(data =>
                    data.seccao === chairInfo.seccao &&
                    data.fila === chairInfo.fila &&
                    String(data.lugar) === String(chairInfo.lugar)
                );
                // Se encontrar um ocupante, atualize o nome da cadeira
                if (occupant) {
                    object.userData.nome = occupant.nome;
                }
            }
        });
    }

    /**
     * Mesma lógica do teu searchSubject original.
     * - repõe material/visibilidade originais
     * - destaca em amarelo as cadeiras cujo nome contém a query
     */
    highlightByName(query) {
        const searchQuery = (query || '').trim().toLowerCase();

        // Restaurar todas as cadeiras
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
                chairInfo.nome &&
                String(chairInfo.nome).toLowerCase().includes(searchQuery)
            ) {
                if (!mesh.userData.originalMaterial) mesh.userData.originalMaterial = mesh.material;
                mesh.material = new THREE.MeshBasicMaterial({color: COLORS.GOLD});
                hits++;
            }
        });
        return hits;
    }

    // Eventos
    onResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.controls?.update?.();
    }

    // Quando se clica na cadeira
    onMouseClick(event) {
        // Raycast como no original (scene.children)
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

    // descartar geometrias e materiais
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