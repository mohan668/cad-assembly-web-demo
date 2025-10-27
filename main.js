import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';




// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

// Scene
const scene = new THREE.Scene();

// Camera - Fixed Isometric View
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Animation variables
const clock = new THREE.Clock();
let mixer = null;
let action = null;
let isAnimating = false;

// Checkpoint times (in seconds)
const checkpoints = [
  { level: 0, time: 0, label: 'Base (5ft)' },
  { level: 1, time: 3, label: 'Level 1 (10ft)' },
  { level: 2, time: 6, label: 'Level 2 (15ft)' },
  { level: 3, time: 9, label: 'Level 3 (20ft)' },
  { level: 4, time: 12, label: 'Level 4 (25ft)' }
];

let currentLevel = 0;

// UI Elements
const levelButtons = [
  document.getElementById('level0'),
  document.getElementById('level1'),
  document.getElementById('level2'),
  document.getElementById('level3'),
  document.getElementById('level4')
];

// Load GLB
const loader = new GLTFLoader().setPath('/');
loader.load(
  'assembly_glb.glb',
  (gltf) => {
    const model = gltf.scene;
    scene.add(model);

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    model.position.sub(center);

    // Set fixed isometric camera position
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 2;
    const angle = Math.PI / 4;
    const elevation = Math.atan(1 / Math.sqrt(2));
    
    camera.position.set(
      distance * Math.cos(elevation) * Math.cos(angle),
      distance * Math.sin(elevation),
      distance * Math.cos(elevation) * Math.sin(angle)
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();

    // Setup animation
    if (gltf.animations && gltf.animations.length > 0) {
      mixer = new THREE.AnimationMixer(model);
      action = mixer.clipAction(gltf.animations[0]);
      action.setLoop(THREE.LoopOnce);
      action.clampWhenFinished = true;
      action.play();
      action.paused = true;
      action.time = 0; // Start at base position
      
      // Enable buttons
      levelButtons.forEach(btn => btn.disabled = false);
      updateButtonStates();
    }
  }
);

// Move to specific checkpoint
function moveToLevel(targetLevel) {
  if (!action || isAnimating) return;
  
  const targetTime = checkpoints[targetLevel].time;
  const currentTime = action.time;
  
  if (Math.abs(targetTime - currentTime) < 0.1) {
    // Already at this position
    return;
  }
  
  isAnimating = true;
  action.paused = false;
  action.timeScale = targetTime > currentTime ? 1 : -1; // Forward or backward
  
  currentLevel = targetLevel;
  updateButtonStates();
}

// Update button visual states
function updateButtonStates() {
  levelButtons.forEach((btn, index) => {
    if (index === currentLevel) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// Button event listeners
levelButtons.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    moveToLevel(index);
  });
});

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  const delta = clock.getDelta();
  
  if (mixer) {
    mixer.update(delta);
    
    // Check if we've reached target checkpoint
    if (isAnimating && action) {
      const targetTime = checkpoints[currentLevel].time;
      const currentTime = action.time;
      
      // Stop when we reach the target
      if (
        (action.timeScale > 0 && currentTime >= targetTime) ||
        (action.timeScale < 0 && currentTime <= targetTime)
      ) {
        action.time = targetTime;
        action.paused = true;
        isAnimating = false;
      }
    }
  }
  
  renderer.render(scene, camera);
}

animate();
