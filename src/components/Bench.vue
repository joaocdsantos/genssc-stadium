<template>
  <div class="main-container">
    <div ref="threeContainer" class="three-container"></div>

    <div class="search-container">
      <div class="image-container">
        <img src="../assets/gsc_logo_vector.png" alt="Logo vector Gens"/>
      </div>
      <input
          v-model="searchName"
          @input="searchSubject"
          placeholder="Pesquisar nome"
          class="search-input"
      >
    </div>

    <!-- COPYRIGHTS -->
    <div class="copyright-container">
      Gens Sport Clube © 2024 <br>
      Todos os direitos reservados
    </div>


    <!-- MODAL -->
    <div v-if="modalVisible" class="modal">
      <div class="modal-content">
        <div class="image-container">
          <img src="../assets/logo.png" alt="Logo Gens"/>
        </div>
        <p class="padrinho-info">
          <span class="padrinho-name">
        {{ selectedChair.nome }}
        <i class="fa fa-star"></i>
      </span>
        </p>
        <p>Secção: <strong>{{ selectedChair.seccao }} </strong></p>
        <p>Fila: <strong>{{ selectedChair.fila }}</strong></p>
        <p>Lugar: <strong>{{ selectedChair.lugar }}</strong></p>
        <button @click="closeModal" class="modal-close">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import occupants from '../assets/data.json'

export default {

  name: 'ChairBench',
  data() {
    return {
      searchName: '',
      occupantData: [],
      chairMeshes: [],
      modalVisible: false,
      selectedChair: {}
    }
  },
  mounted() {
    this.initThreeJS();
  },
  methods: {
    async initThreeJS() {
      const occupantData = occupants;
      this.chairMeshes = [];

      // Configuração básica
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({antialias: true});
      renderer.setSize(window.innerWidth, window.innerHeight);
      this.$refs.threeContainer.appendChild(renderer.domElement);

      // Adicionar luzes
      const ambientLight = new THREE.AmbientLight(0x404040);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      scene.add(directionalLight);

      // Criar materiais para as cadeiras
      const redMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
      const whiteMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      const greenMaterial = new THREE.MeshBasicMaterial({color: 0x006400});

      // Configurar parâmetros
      const rows = 6;
      const greenCols = 22;
      const whiteCols = 21;
      const redCols = 22;
      const spacing = 1.0;
      const gapBetweenGroups = 1.5 * spacing;
      const stepHeight = 0.5;
      const zStart = 0;

      //cCores
      const metalGrayColor = 0x555555;
      const pillarColor = metalGrayColor;
      const lightGrayColor = 0xCCCCCC;

      // Função para criar uma cadeira
      function createChair(x, y, z, material, chairInfo, onChairClick) {
        const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const chair = new THREE.Mesh(geometry, material);
        chair.position.set(x, y, z);
        chair.rotation.y = Math.PI;
        chair.userData = {...chairInfo, originalVisibility: true, originalMaterial: material};

        // Adicionar evento de clique
        chair.onClick = () => {
          onChairClick(chairInfo);
          console.log(chair.userData);
        };

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
          {x: greenPillarX, z: zStart + 5},
          {x: whitePillarX, z: zStart + 5},
          {x: redPillarX, z: zStart + 5}
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
        const material = new THREE.MeshPhongMaterial({color: lightGrayColor});
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
        const letters = ['F', 'E', 'D', 'C', 'B', 'A'];
        return letters[rowIndex] || '';
      }

      // Função auxiliar para obter a numeração correta
      function getNumberForColumn(colIndex) {
        return (greenCols - colIndex) || '';
      }

      // Definir posições de início das cadeiras
      const redStartX = 0;
      const whiteStartX = redStartX + greenCols * spacing + gapBetweenGroups;
      const greenStartX = whiteStartX + whiteCols * spacing + gapBetweenGroups;

      // Largura total dos degraus
      const totalWidthDegree = (redCols + whiteCols + greenCols) * spacing + 2 * gapBetweenGroups;
      // Centro dos degraus
      const stepCenterX = (redStartX + greenStartX + greenCols * spacing) / 2;

      // Definir posições dos pilares
      const greenPillarX = greenStartX + 10 * spacing;
      const whitePillarX = whiteStartX + 10 * spacing;
      const redPillarX = redStartX + 11 * spacing;

      for (let i = 0; i < rows; i++) {
        // Adicionar cadeiras Verdes (22x6)
        for (let j = 0; j < greenCols; j++) {
          const chairX = greenStartX + j * spacing;
          const chairZ = zStart + i * spacing;
          const chair = createChair(chairX, i * stepHeight, chairZ, greenMaterial,
              {
                seccao: 'verde',
                fila: getLetterForRow(i),
                lugar: getNumberForColumn(j),
                nome: ``
              },
              () => {
                this.selectedChair = {...chair.userData};
                this.modalVisible = true;
              }
          );
          this.chairMeshes.push(chair);
          scene.add(chair);
        }
        // Adicionar cadeiras brancas (21x6)
        for (let j = 0; j < whiteCols; j++) {
          const chairX = whiteStartX + j * spacing;
          const chairZ = zStart + i * spacing;
          const chair = createChair(chairX, i * stepHeight, chairZ, whiteMaterial, {
                seccao: 'branca',
                fila: getLetterForRow(i),
                lugar: getNumberForColumn(j + 1),
                nome: ``
              },
              () => {
                this.selectedChair = {...chair.userData};
                this.modalVisible = true;
              });
          this.chairMeshes.push(chair);
          scene.add(chair);
        }

        // Adicionar cadeiras vermelhas (22x6)
        for (let j = 0; j < redCols; j++) {
          const chairX = redStartX + j * spacing;
          const chairZ = zStart + i * spacing;
          const chair = createChair(chairX, i * stepHeight, chairZ, redMaterial,
              {
                seccao: 'vermelha',
                fila: getLetterForRow(i),
                lugar: getNumberForColumn(j),
                nome: ``
              },
              () => {
                this.selectedChair = {...chair.userData};
                this.modalVisible = true;
              });
          this.chairMeshes.push(chair);
          scene.add(chair);
        }
      }
      updateNames()
      // ADICIONAR DEGRAUS
      const extraSteps = 3;
      for (let i = -extraSteps; i < rows; i++) {
        const extraStepLength = 1.0;
        const step = createStep(totalWidthDegree + 2 * extraStepLength, spacing, stepHeight, stepCenterX, i * stepHeight - stepHeight / 2, zStart + i * spacing);
        scene.add(step);
      }

      // ADICIONAR DEGRAUS COBERTURA
      const coverWidth = totalWidthDegree;
      const coverDepth = rows * spacing;
      const coverThickness = 0.5;

      const coverGeometry = new THREE.BoxGeometry(coverWidth, coverThickness, coverDepth);
      const coverMaterial = new THREE.MeshPhongMaterial({color: metalGrayColor});
      const cover = new THREE.Mesh(coverGeometry, coverMaterial);

      const coverHeight = 2.0;

      cover.position.set(
          stepCenterX,
          rows * stepHeight + 0.5 + coverHeight + coverThickness / 2,
          zStart + (rows * spacing) / 2 - spacing / 2
      );
      scene.add(cover);

      // ADICIONAR PILARES
      const pillarHeight = rows * stepHeight + 0.5 + coverHeight;

      const greenPillar = createPillar(greenPillarX, pillarHeight, zStart + 5, pillarHeight, pillarColor);
      scene.add(greenPillar);

      const whitePillar = createPillar(whitePillarX, pillarHeight, zStart + 5, pillarHeight, pillarColor);
      scene.add(whitePillar);

      const redPillar = createPillar(redPillarX, pillarHeight, zStart + 5, pillarHeight, pillarColor);
      scene.add(redPillar);

      // Adicionar muro junto ao primeiro degrau
      const wallHeight = 2;
      const wallThickness = 0.2;
      const wallY = -extraSteps * stepHeight - wallHeight / 2;
      const wallZ = -extraSteps - spacing / 2;

      // Definir a largura do muro igual ao comprimento dos degraus prolongados
      const wallWidth = totalWidthDegree + 2 * 1;

      // Ajustar a posição do muro para centralizá-lo
      const wall = createWall(wallWidth, wallHeight, wallThickness, stepCenterX, wallY, wallZ);
      scene.add(wall);

      // Configurar a câmera para mostrar a bancada de frente
      const totalHeight = rows * stepHeight;
      const totalDepth = rows * spacing;
      const centerX = totalWidthDegree / 2;
      const centerY = totalHeight / 2;
      const centerZ = totalDepth / 2;

      // Configurar a câmera para mostrar a bancada do lado oposto
      const cameraDistance = Math.max(
          totalWidthDegree / (2 * Math.tan(camera.fov * Math.PI / 360)),
          totalHeight / (2 * Math.tan(camera.fov * Math.PI / 360))
      );

      camera.position.set(centerX, centerY + 15, centerZ - cameraDistance);
      camera.lookAt(new THREE.Vector3(centerX, centerY, centerZ));

      // Configurar os controles
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(centerX, centerY, centerZ);
      controls.enablePan = true;
      controls.enableZoom = true;
      controls.enableRotate = true;
      controls.panSpeed = 0.5;
      controls.zoomSpeed = 1.0;
      controls.rotateSpeed = 0.5;
      controls.minDistance = 25;
      controls.maxDistance = 40;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      // // Limite rotação vertical:
      controls.minPolarAngle = Math.PI / 4; // 45 graus
      controls.maxPolarAngle = Math.PI / 2; // 90 graus
      //
      // // Limite rotação horizontal (ajustado para 180 graus):
      controls.minAzimuthAngle = Math.PI * 7 / 8; // 157.5 graus
      controls.maxAzimuthAngle = (Math.PI * 7 / 8) * -1; // 202.5 graus


      // Configuração da animação
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      }


      animate();

      // Ajustar o renderizador ao tamanho da tela
      window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        controls.update();
      });

      // Função para detectar clique
      function onMouseClick(event) {
        // Converta as coordenadas do mouse para coordenadas normalizadas do dispositivo
        const rect = renderer.domElement.getBoundingClientRect();
        const x = (event.clientX / rect.width) * 2 - 1;
        const y = -(event.clientY / rect.height) * 2 + 1;

        // Crie um vetor de projeção a partir das coordenadas do mouse
        const mouseVector = new THREE.Vector2(x, y);
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVector, camera);

        // Calcule quais objetos intersectam o raio
        const intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
          const object = intersects[0].object;
          if (object.onClick) {
            object.onClick(); // Chama a função de clique
          }
        }
      }

      // Adiciona o listener para cliques do mouse
      window.addEventListener('click', onMouseClick);

      function updateNames() {
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh && object.userData.seccao) {
            const chairInfo = object.userData;

            // Procure por um ocupante correspondente no JSON
            const occupant = occupantData.find(data =>
                data.seccao === chairInfo.seccao &&
                data.fila === chairInfo.fila &&
                data.lugar === chairInfo.lugar
            );

            // Se encontrar um ocupante, atualize o nome da cadeira
            if (occupant) {
              object.userData.nome = occupant.nome;
            }
          }
        });
      }

    },
    searchSubject() {
      const searchQuery = this.searchName.trim().toLowerCase();

      // Restaurar todas as cadeiras para suas cores originais
      this.chairMeshes.forEach(mesh => {
        mesh.material = mesh.userData.originalMaterial;
        if (mesh.userData.originalVisibility === false) {
          mesh.visible = false;
        } else {
          mesh.visible = true;
        }
      });

      if (searchQuery !== '') {
        // Filtrar e destacar as cadeiras correspondentes
        this.chairMeshes.forEach(mesh => {
          const chairInfo = mesh.userData;
          if (chairInfo && chairInfo.nome && chairInfo.nome.toLowerCase().includes(searchQuery)) {
            // Armazenar o material original se ainda não estiver armazenado
            if (!mesh.userData.originalMaterial) {
              mesh.userData.originalMaterial = mesh.material;
            }
            // Alterar a cor da cadeira encontrada
            mesh.material = new THREE.MeshBasicMaterial({color: 0xFFD700}); // Amarelo
          }
        });
      }
    },
    closeModal() {
      this.modalVisible = false;
    }
  }
}
</script>

<style scoped>
.main-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

.three-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.search-container {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  width: 300px;
}

.search-input {
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  border: 2px solid #ffffff;
  border-radius: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #000000;
  outline: none;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: #ffffff;
}

.search-input:focus {
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

.search-input:not(:focus) {
  color: #808080;
}

.modal {
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  text-align: center;
  font-family: 'Roboto', sans-serif;;
  background-color: #fefefe;
  padding: 20px;
  border-radius: 5px;
  width: 300px;
  position: relative;
}

.padrinho-info {
  font-weight: bold;
  font-size: 16px;
  margin: 10px 0;
}

.padrinho-name {
  font-weight: bold;
  color: #333;
  display: inline-flex;
  align-items: center;
}

.padrinho-name i {
  color: gold;
  margin-left: 5px;
}

.modal-close {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.modal-close:hover {
  background-color: #45a049;
}

/* Estilo para a imagem dentro do modal */
.image-container {
  margin: 20px 0; /* Espaçamento em volta da imagem */
}

.image-container img {
  width: 25%; /* Reduz a imagem para 25% da largura do modal */
  height: auto; /* Mantém a proporção original da imagem */
  display: block; /* Remove o espaço extra abaixo da imagem */
  margin: 0 auto; /* Centraliza a imagem horizontalmente */
}
.copyright-container {
  text-align: center;
  font-family: 'Roboto', sans-serif;;
  font-size: smaller;
  color: grey;
  position: fixed;
  bottom: 0;
  margin-bottom:10px;
  width: 100%;
  background-color: black; /* Transparência para garantir que o texto seja visível sobre qualquer fundo */
}
</style>