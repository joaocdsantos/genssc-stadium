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
    initThreeJS() {
      const occupantData = [
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 1,
          "nome": "Quiteria, Tim e Marco"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 2,
          "nome": "Manuel Sousa"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 3,
          "nome": "Cristina R. Sousa"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 4,
          "nome": "Rosa Ferreira"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 5,
          "nome": "José Gonçalves"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 6,
          "nome": "Armando Santos"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 7,
          "nome": "Helder Pacheco"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 8,
          "nome": "Salvador Barbosa"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 9,
          "nome": "Ricardo Barbosa"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 10,
          "nome": "Paulo Sérgio"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 11,
          "nome": "Nelson Fernandes"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 12,
          "nome": "Pilar Verde - Não existe cadeira"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 13,
          "nome": "TREVO"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 14,
          "nome": "José Fernando Moreira"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 15,
          "nome": "AMIGAS DO GENS"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 16,
          "nome": "Jorge Sanguedo"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 17,
          "nome": "Zé Pedro 96"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 18,
          "nome": "Mário Santos"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 19,
          "nome": "Dulce Sanguedo"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 20,
          "nome": "Inácia Moreira"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 21,
          "nome": "Constança Santos"
        },
        {
          "seccao": "verde",
          "fila": "A",
          "lugar": 22,
          "nome": "Mário Jorge Santos"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 1,
          "nome": "Dina Veiga"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 2,
          "nome": "Daniela Veiga"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 3,
          "nome": "Benedita Barbosa"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 4,
          "nome": "Francisco Barbosa"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 5,
          "nome": "Fernando Alves"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 6,
          "nome": "Rui Pinho"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 7,
          "nome": "Ema e Lourenço"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 8,
          "nome": "Tomé e Francisco"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 9,
          "nome": "Daniel Ferreira"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 10,
          "nome": "Leonor Barbosa"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 11,
          "nome": "Filipa Ramos Coelho"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 12,
          "nome": "Ari Ramos Coelho"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 13,
          "nome": "Luís Lobo"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 14,
          "nome": "Alvarim Pereira"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 15,
          "nome": "Eduardo Monteiro"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 16,
          "nome": "Carmindo Alves"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 17,
          "nome": "Bruno Oliveira"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 18,
          "nome": "Pedro Azevedo"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 19,
          "nome": "Jerónimo Azevedo"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 20,
          "nome": "Daniel Santos"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 21,
          "nome": "Tiago Santos"
        },
        {
          "seccao": "verde",
          "fila": "B",
          "lugar": 22,
          "nome": "Flávio Nogueira"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 1,
          "nome": "Alexandre Perfeito"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 2,
          "nome": "Vicente de Castro"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 3,
          "nome": "De Castro Coelho"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 4,
          "nome": "Diogo Emanuel Silva"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 5,
          "nome": "Manuel Laranjeira"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 6,
          "nome": "Manuel Martins Rodrigues"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 7,
          "nome": "Manuel Sofia Soares"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 8,
          "nome": "Joaquim Soares"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 9,
          "nome": "Serafim Sofia Castro"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 10,
          "nome": "António Tavares de Almeida"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 11,
          "nome": "Joaquim Alves da Costa"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 12,
          "nome": "Paula Almeida"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 13,
          "nome": "Virgílio Silva"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 14,
          "nome": "Adriana Santos"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 15,
          "nome": "Maria Inês Silva"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 16,
          "nome": "Jaime Silva"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 17,
          "nome": "Manuel Rocha"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 18,
          "nome": "Filomena Santos"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 19,
          "nome": "António Pedrosa"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 20,
          "nome": "Dario Castro"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 21,
          "nome": "Rosa Maria Cruz"
        },
        {
          "seccao": "verde",
          "fila": "C",
          "lugar": 22,
          "nome": "Jerónimo Rocha"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 1,
          "nome": "Filipe Almeida"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 2,
          "nome": "David Santos"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 3,
          "nome": "Marta & Queirós"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 4,
          "nome": "Lela, Pedro e Marcos"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 5,
          "nome": "J.C. LASCASAS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 6,
          "nome": "ECO BUS Autocarros"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 7,
          "nome": "Serralharia GOMES"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 8,
          "nome": "Serralharia GOMES"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 9,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 10,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 11,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 12,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 13,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 14,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 15,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 16,
          "nome": "Materiais de Construção JÚLIO SANTOS"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 17,
          "nome": "Nuno Santos"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 18,
          "nome": "Luísa Matias"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 19,
          "nome": "Miguel Matias"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 20,
          "nome": "José Matias"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 21,
          "nome": "Arminda Santos"
        },
        {
          "seccao": "verde",
          "fila": "D",
          "lugar": 22,
          "nome": "Hernani Castro"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 1,
          "nome": ""
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 2,
          "nome": ""
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 3,
          "nome": "Os Rodrigues CAFÉ"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 4,
          "nome": "Isys Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 5,
          "nome": "Willow Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 6,
          "nome": "Marquinho Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 7,
          "nome": "Ramses Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 8,
          "nome": "Fernando Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 9,
          "nome": "Eliandro M. Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 10,
          "nome": "Eliandro M. Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 11,
          "nome": "Carla M. Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 12,
          "nome": "Liliana Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 13,
          "nome": "Liliana Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 14,
          "nome": "Sónia Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 15,
          "nome": "Sónia Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 16,
          "nome": "Emma Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 17,
          "nome": "Andreia Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 18,
          "nome": "Andreia Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 19,
          "nome": "Marco Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 20,
          "nome": "Marco Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 21,
          "nome": "Marco Vila Real"
        },
        {
          "seccao": "verde",
          "fila": "E",
          "lugar": 22,
          "nome": "Casimiro Santos Sousa"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 1,
          "nome":""
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 2,
          "nome":""
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 3,
          "nome":""
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 4,
          "nome":""
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 5,
          "nome": "Henrique Nogueira"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 6,
          "nome": "Diogo Moura"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 7,
          "nome": "Inês Monterio"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 8,
          "nome": "Gonçalo e Afonso"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 9,
          "nome": "Afonso Castro"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 10,
          "nome": "Guilherme Luís"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 11,
          "nome": "Filipe Luís"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 12,
          "nome": "Tiago Pedrosa"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 13,
          "nome": "Ricardo Pedrosa"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 14,
          "nome": "Bruno Costa"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 15,
          "nome": "Salvas 25 Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 16,
          "nome": "Sub 15 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 17,
          "nome": "Sub 11 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 18,
          "nome": "Sub 10 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 19,
          "nome": "Sub 9 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 20,
          "nome": "Sub 8 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 21,
          "nome": "Sub 7 - Época 2023/2024"
        },
        {
          "seccao": "verde",
          "fila": "F",
          "lugar": 22,
          "nome": "Gens Sport Clube Trail"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 1,
          "nome": "Delfim Francisco Sanguedo"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 2,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 3,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 4,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 5,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 6,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 7,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 8,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 9,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 10,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 11,
          "nome": "Pilar Branco - não existe cadeira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 12,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 13,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 14,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 15,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 16,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 17,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 18,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 19,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 20,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "A",
          "lugar": 21,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 1,
          "nome": "Carolina Martino"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 2,
          "nome": "ROVI"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 3,
          "nome": "ROVI"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 4,
          "nome": "ROVI"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 5,
          "nome": "ROVI"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 6,
          "nome": "Raquel Pinho"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 7,
          "nome": "Tiago Soares"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 8,
          "nome": "Leonel Soares"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 9,
          "nome": "Rosa Márcia Soares"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 10,
          "nome": "Daniela Pinto"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 11,
          "nome": "Pedro Pinto"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 12,
          "nome": "Dulce Silva"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 13,
          "nome": "João Pinho"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 14,
          "nome": "Jerónimo Silva"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 15,
          "nome": "Delfim Pinho"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 16,
          "nome": "Jerónimo Silva"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 17,
          "nome": "Delfim Silva"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 18,
          "nome": "Delfim Silva"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 19,
          "nome": "Padre Delfim Rocha Santos"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 20,
          "nome": "Manuel Carreira"
        },
        {
          "seccao": "branca",
          "fila": "B",
          "lugar": 21,
          "nome": "Transportes Paiva Castro"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 1,
          "nome": "Rosalina Sousa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 2,
          "nome": "Orquídia Castro"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 3,
          "nome": "Amílcar Castro"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 4,
          "nome": "Orlando Paiva"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 5,
          "nome": "Leonel Sousa Neves"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 6,
          "nome": "Carla Fernandes"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 7,
          "nome": "Sofia Neves"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 8,
          "nome": "Carlos Neves"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 9,
          "nome": "Leonel Neves"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 10,
          "nome": "Manuel Mota"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 11,
          "nome": "Fernando Ferreira da Costa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 12,
          "nome": "Adriano Castro Sousa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 13,
          "nome": "David Sousa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 14,
          "nome": "Joaquim Alves"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 15,
          "nome": "Vasco Silva"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 16,
          "nome": "Adérito Martins Oliveira"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 17,
          "nome": "Manuel Santos Barbosa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 18,
          "nome": "Serafim Santos"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 19,
          "nome": "Pedro Ferreira"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 20,
          "nome": "Arlindo Ferreira da Costa"
        },
        {
          "seccao": "branca",
          "fila": "C",
          "lugar": 21,
          "nome": "Beatriz Ferreira da Costa"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 1,
          "nome": "Carlos Cabral"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 2,
          "nome": "Rui Vieira"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 3,
          "nome": "António Barbosa"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 4,
          "nome": "André Pinto"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 5,
          "nome": "Salgueiro"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 6,
          "nome": "Irmã Rosa"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 7,
          "nome": "Delfim Sousa"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 8,
          "nome": "David Castro Capela"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 9,
          "nome": "Família Dias"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 10,
          "nome": "Mónica Querido"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 11,
          "nome": "Adérito Castro"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 12,
          "nome": "João Santos"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 13,
          "nome": "João Santos"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 14,
          "nome": "Abílio Vinha"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 15,
          "nome": "José Monteiro"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 16,
          "nome": "Guilhermino Vieira"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 17,
          "nome": "Manuel Moreira Nunes"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 18,
          "nome": "A. Passos"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 19,
          "nome": "Joel Cruz"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 20,
          "nome": "Daniel França"
        },
        {
          "seccao": "branca",
          "fila": "D",
          "lugar": 21,
          "nome": "Fernando Gomes"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 1,
          "nome": "Fernando Ferreira"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 2,
          "nome": "Morgane Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 3,
          "nome": "Maria Inês Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 4,
          "nome": "Pilar M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 5,
          "nome": "Tânia R. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 6,
          "nome": "Fernando Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 7,
          "nome": "Eliandro M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 8,
          "nome": "Eliandro M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 9,
          "nome": "Carla M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 10,
          "nome": "Carla M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 11,
          "nome": "Carla M. Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 12,
          "nome": "Liliana Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 13,
          "nome": "Liliana Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 14,
          "nome": "Sónia Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 15,
          "nome": "Sónia Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 16,
          "nome": "Ema Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 17,
          "nome": "Ema Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 18,
          "nome": "Ema Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 19,
          "nome": "Andreia Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 20,
          "nome": "Andreia Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "E",
          "lugar": 21,
          "nome": "Marco Vila Real"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 1,
          "nome": "Eduardo Marinheiro"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 2,
          "nome": "Dalila Silva"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 3,
          "nome": "Maria 95"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 4,
          "nome": "Nevita 25"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 5,
          "nome": "Tiago Pizzi"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 6,
          "nome": "CAVIROL"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 7,
          "nome": "Gaio"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 8,
          "nome": "Luís Gomes"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 9,
          "nome": "Rui Gomes"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 10,
          "nome": "Gabriel Vieira"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 11,
          "nome": "Fátima Vieira"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 12,
          "nome": "Catarina Rocha"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 13,
          "nome": "Bruno Monteiro"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 14,
          "nome": "Armando Monteiro"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 15,
          "nome": "Alexandre Sousa"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 16,
          "nome": "André Sousa"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 17,
          "nome": "Vicente Pinto"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 18,
          "nome": "Isac Ferreira"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 19,
          "nome": "Anónimo"
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 20,
          "nome": ""
        },
        {
          "seccao": "branca",
          "fila": "F",
          "lugar": 21,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 1,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 2,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 3,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 4,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 5,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 6,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 7,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 8,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 9,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 10,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 11,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 12,
          "nome": "Pilar Vermelho - não existe cadeira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 13,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 14,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 15,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 16,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 17,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 18,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 19,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 20,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 21,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "A",
          "lugar": 22,
          "nome": "Joaquim Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 1,
          "nome": "A. TÁXIS"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 2,
          "nome": "Tiago Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 3,
          "nome": "APLICOFIL"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 4,
          "nome": "APLICOFIL"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 5,
          "nome": "APLICOFIL"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 6,
          "nome": "APLICOFIL"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 7,
          "nome": "APLICOFIL"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 8,
          "nome": "Fernando Pinto"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 9,
          "nome": "Carmo Pinto"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 10,
          "nome": "João M. Cunha"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 11,
          "nome": "José Bernardino M. Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 12,
          "nome": "Valdemar Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 13,
          "nome": "ORIGEMÉTRICA"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 14,
          "nome": "Fernando Monteiro"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 15,
          "nome": "David Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 16,
          "nome": "Paulo Jorge Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 17,
          "nome": "Sérgio Silva"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 18,
          "nome": "Agostinho M. Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 19,
          "nome": "Jorge Rodrigues"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 20,
          "nome": "Mário Lopes"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 21,
          "nome": "Pedro Pereira"
        },
        {
          "seccao": "vermelha",
          "fila": "B",
          "lugar": 22,
          "nome": "Bruno Almeida"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 1,
          "nome": "Maria Manuela S. Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 2,
          "nome": "Bryan Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 3,
          "nome": "Filipe S. Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 4,
          "nome": "Pedro Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 5,
          "nome": "Fernando Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 6,
          "nome": "Eliandro M. Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 7,
          "nome": "Carla M. Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 8,
          "nome": "Liliana Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 9,
          "nome": "Sónia Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 10,
          "nome": "Emma Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 11,
          "nome": "Andreia Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 12,
          "nome": "Marco Vila Real"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 13,
          "nome": "José Paiva de Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 14,
          "nome": "José Paiva de Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 15,
          "nome": "Manuel Paiva"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 16,
          "nome": "Sérgio Paiva"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 17,
          "nome": "Sara Paiva"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 18,
          "nome": "Hélia Lopes"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 19,
          "nome": "Lucílio Alves"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 20,
          "nome": "Ernesto Sousa Alves"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 21,
          "nome": "Silvino Paiva"
        },
        {
          "seccao": "vermelha",
          "fila": "C",
          "lugar": 22,
          "nome": "Jorge Moreira"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 1,
          "nome": "Aurélio Rocha"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 2,
          "nome": "Artur Santos Rocha"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 3,
          "nome": "Manuel Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 4,
          "nome": "Manuel Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 5,
          "nome": "GREEN STADIUM"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 6,
          "nome": "GREEN STADIUM"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 7,
          "nome": "BICAFÉ"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 8,
          "nome": "MACRON"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 9,
          "nome": "Rodri Campeão 2022/2023"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 10,
          "nome": "João Guedes Libério"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 11,
          "nome": "José Germano de Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 12,
          "nome": "Rosalina Carvalho Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 13,
          "nome": "Sérgio Gonçalves"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 14,
          "nome": "Manuel Gonçalves"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 15,
          "nome": "Maria Gonçalves"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 16,
          "nome": "Ângela Gonçalves"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 17,
          "nome": "Eduardo Santos Cruz"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 18,
          "nome": "José Sousa Silva"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 19,
          "nome": "Casimiro Oliveira Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 20,
          "nome": "Tomás Oliveira Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 21,
          "nome": "Maria Amélia M. Santos"
        },
        {
          "seccao": "vermelha",
          "fila": "D",
          "lugar": 22,
          "nome": "Alexandre Sousa"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 1,
          "nome": "Anónimo"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 2,
          "nome": "Anónimo"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 3,
          "nome": "Anónimo"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 4,
          "nome": "Anónimo"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 5,
          "nome": "INCIDÊNCIAS DE LUZ"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 6,
          "nome": "Luís Filipe Araújo"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 7,
          "nome": "Lúcia e Porfírio"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 8,
          "nome": "José Martins dos Santos"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 9,
          "nome": "Mini Mercado Olga Queirós"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 10,
          "nome": "José Queirós"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 11,
          "nome": "Fernando Oliveira"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 12,
          "nome": "Manuel António Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 13,
          "nome": "Beatriz Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 14,
          "nome": "Bianca Castro"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 15,
          "nome": "Beatriz Soares"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 16,
          "nome": "Jorge Soares"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 17,
          "nome": "António Santos"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 18,
          "nome": "Manuel Martins dos Santos"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 19,
          "nome": "Tiago Silva"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 20,
          "nome": "Ricardo Castro Miau"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 21,
          "nome": "Bruno Alves"
        },
        {
          "seccao": "vermelha",
          "fila": "E",
          "lugar": 22,
          "nome": "João Malheiro"
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 1,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 2,
        "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 3,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 4,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 5,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 6,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 7,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 8,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 9,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 10,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 11,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 12,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 13,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 14,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 15,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 16,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 17,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 18,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 19,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 20,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 21,
          "nome": ""
        },
        {
          "seccao": "vermelha",
          "fila": "F",
          "lugar": 22,
          "nome": ""
        }
      ]
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
      const redPillarX = redStartX + 10 * spacing;

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