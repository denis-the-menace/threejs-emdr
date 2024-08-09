import "./style.css";
import * as THREE from "three";

let scene, camera, renderer, ball;
let direction = 1;
let speed = 0.05; // Changed from const to let
const boundsX = 5;
let isPaused = false;

function init() {
  // Create scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9b1c2); // Set background color

  // Create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 10;

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas: document.getElementById("bg") });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Create ball
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshPhongMaterial({ color: 0xff0000 });
  ball = new THREE.Mesh(geometry, material);
  scene.add(ball);

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add event listeners for color changing buttons
  document.querySelectorAll("#menu button").forEach((button) => {
    button.addEventListener("click", changeColor);
  });

  // Add event listener for speed slider
  const speedSlider = document.getElementById("speed");
  if (speedSlider) {
    speedSlider.addEventListener("input", changeSpeed);
    // Initialize speed display
    document.getElementById("speedValue").textContent = speed.toFixed(2);
  }

  const pausePlayButton = document.getElementById("pausePlay");
  if (pausePlayButton) {
    pausePlayButton.addEventListener("click", togglePause);
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);

  if (!isPaused) {
    ball.position.x += speed * direction;
    // Check bounds and reverse direction if needed
    if (ball.position.x > boundsX || ball.position.x < -boundsX) {
      direction *= -1;
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

init();

// Add window resize event listener
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
