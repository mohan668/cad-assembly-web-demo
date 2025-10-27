# cad-assembly-web-demo

This project is a modern, browser-based demonstration showing how to handle and visualize animated CAD assembly files on the web. It focuses on loading `.glb` (or `.gltf`) files exported from CAD software, handling embedded motion/animation, and providing an interactive user interface using Three.js.

## ✨ Purpose

The goal is **not** to replicate a full-featured industrial controller or CAD system, but rather to provide a learning and reference template for:

- Loading CAD assemblies (parts or mechanisms) exported as `.glb` with animation (e.g., from SolidWorks or Blender).
- Playing, scrubbing, and programmatically controlling animation on the web.
- Embedding the experience in a modern, responsive UI that’s easy to adapt for demos, dashboards, or learning purposes.

## Key Features

- 🏗️ **3D Viewer:** Interactive, orbit-controllable display of CAD assemblies directly in the browser.
- 🎥 **Animation Control:** Programmatic checkpoint playback and smooth transitions (move between keyframes, play up/down).
- 📦 **GLB/GLTF Support:** Supports any properly-exported animated file (export from SolidWorks/Blender with keyframes or rigid assembly animation).
- ⚡ **No Build Step:** Just clone, add your `glb`/`gltf` file, and open `index.html`.

## Usage

1. **Clone this repo:**
