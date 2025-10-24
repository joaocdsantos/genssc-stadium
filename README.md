# Three.js stadium bench builder


[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen?logo=node.js&logoColor=white)](https://nodejs.org/)  
[![Three.js](https://img.shields.io/badge/Three.js-r160%2B-000000?logo=three.js&logoColor=white)](https://threejs.org/)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)  

---


A modular 3D stadium bench rendering engine built with **Three.js**, using a clean, scalable architecture
based on *factories* and a *scene service*.

This project implements a structure for an 3D application with clear separation between
configuration, geometry creation, materials, lighting, and scene orchestration.

---

## Features

- **Modular Architecture** — Factories for geometry, materials, lights, and meshes.
- **Procedural Stadium Generation** — Dynamically builds seats, steps, walls, pillars, and roof.
- **Dynamic Lighting** — Ambient and directional lights via `LightFactory`.
- **Interactive Camera** — Orbit controls with zoom, pan, and rotation.
- **Interactive Seats** — Clickable chairs linked to logical data models.
- **Optimized Scene Lifecycle** — Proper memory disposal and event management.

---

## Architecture Overview

### Core Structure

```

src/
├── services/
│       └── ThreeService.js # Scene management and stadium building
├── factories/
│       └── ThreeFactories.js # Generic Three.js factories (geometry, material, lights, mesh)
├── models/
│       └── SeatModel.js # Data structure for seats
├── constants/
│       ├── stadium.js
│       ├── colors.js
│       └── configs.js

```

---

## Design Philosophy

This project follows a **factory-driven architecture**:

| Factory             | Responsibility                                                             |
|---------------------|----------------------------------------------------------------------------|
| **ConfigsFactory**  | Creates the base Three.js setup (scene, camera, renderer)                  |
| **MaterialFactory** | Handles different material types (`phong`, `basic`, `standard`, `lambert`) |
| **LightFactory**    | Creates ambient, directional, and point lights                             |
| **GeometryFactory** | Provides primitive geometries (`box`, `sphere`, `cylinder`, `plane`)       |
| **MeshFactory**     | Combines geometry + material + transforms into reusable meshes             |

These factories are **generic** — reusable in *any* other Three.js project.

---

## ThreeService - The Scene Orchestrator

`ThreeService` is the central class that builds, animates, and manages the 3D scene.

### Main Lifecycle

```js
init();
setupScene();
buildStadiumStructure();
setupCameraAndControls();
animation();
eventListeners();
```
### Responsibilities

* Initializes the scene, renderer, and camera.
* Builds the full stadium structure (seats, steps, pillars, wall, roof).
* Adds ambient and directional lights.
* Handles user input (clicks, resize).
* Provides seat highlighting and sponsor search.
* Disposes of all GPU and DOM resources cleanly. 

Each stage represents a clear and isolated responsibility within the rendering flow.

---

## Requirements
* Node.js ≥ 18
* Three.js ≥ r160
---

## Installation
```
npm install
```

## Development Server
```
npm run dev
```
---
## License
* MIT © 2025