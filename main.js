import "./style.css";
import * as THREE from "three";

let scene, camera, renderer, ball;
let direction = 1;
let speed = 0.05;
const boundsX = 5;
let isPaused = false;
let isSoundOn = true;
let hitCounter = 0; // Initialize the hit counter
const hitSound = new Audio("/ball_hit.mp3");
hitSound.load();

function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9b1c2);

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 6;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const geometry = new THREE.SphereGeometry(0.5, 64, 64); // Increased segments for smoother appearance
  const material = new THREE.MeshStandardMaterial({
    color: 0xff0000,
    metalness: 0.5,
    roughness: 0.5,
    envMapIntensity: 1,
  });
  ball = new THREE.Mesh(geometry, material);
  scene.add(ball);

  function createBox(x) {
    const geometry = new THREE.BoxGeometry(1, 2.5, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x444648,
      metalness: 0.5,
      roughness: 0.5,
    });
    const box = new THREE.Mesh(geometry, material);
    box.position.set(x, 0, 0);
    return box;
  }

  const leftBox = createBox(-boundsX - 1);
  const rightBox = createBox(boundsX + 1);
  scene.add(leftBox);
  scene.add(rightBox);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add environment map for reflections ??
  const cubeTextureLoader = new THREE.CubeTextureLoader();
  const envMap = cubeTextureLoader.load([
    "/px.png",
    "/nx.png",
    "/py.png",
    "/ny.png",
    "/pz.png",
    "/nz.png",
  ]);
  scene.environment = envMap;

  document.querySelectorAll("#menu button[data-color]").forEach((button) => {
    button.addEventListener("click", changeColor);
  });

  const speedSlider = document.getElementById("speed");
  if (speedSlider) {
    speedSlider.addEventListener("input", changeSpeed);
    document.getElementById("speedValue").textContent = speed.toFixed(2);
  }

  const pausePlayButton = document.getElementById("pausePlay");
  if (pausePlayButton) {
    pausePlayButton.addEventListener("click", togglePause);
  }

  const soundToggleButton = document.getElementById("soundToggle");
  if (soundToggleButton) {
    soundToggleButton.addEventListener("click", toggleSound);
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    ball.position.x += speed * direction;

    if (ball.position.x > boundsX || ball.position.x < -boundsX) {
      direction *= -1;
      if (ball.position.x > boundsX) {
        hitCounter++;
        document.getElementById("hitCounter").textContent =
          `Hits: ${hitCounter}`;
      }
      if (isSoundOn) {
        hitSound.play().catch((e) => console.error("Error playing sound:", e));
      }
    }
  }
  renderer.render(scene, camera);
}

function changeColor(event) {
  const color = event.target.dataset.color;
  ball.material.color.setStyle(color);
}

function changeSpeed(event) {
  speed = parseFloat(event.target.value);
  const speedValueElement = document.getElementById("speedValue");
  if (speedValueElement) {
    speedValueElement.textContent = speed.toFixed(2);
  }
}

function togglePause() {
  isPaused = !isPaused;
  const pausePlayButton = document.getElementById("pausePlay");
  if (pausePlayButton) {
    pausePlayButton.textContent = isPaused ? "Continue" : "Pause";
  }
}

function toggleSound() {
  isSoundOn = !isSoundOn;
  const soundToggleButton = document.getElementById("soundToggle");
  if (soundToggleButton) {
    soundToggleButton.textContent = isSoundOn ? "Sound On" : "Sound Off";
  }
}

init();

// responsive icin
// window.addEventListener("resize", onWindowResize, false);
//
// function onWindowResize() {
//   camera.aspect = window.innerWidth / window.innerHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
// }
