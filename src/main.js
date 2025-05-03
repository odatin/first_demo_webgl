import './style.css';
import * as THREE from 'three';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();

const sizes = {
  width: innerWidth,
  height: innerHeight
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);


const tick = () => {
  window.requestAnimationFrame(tick);
  renderer.render(scene, camera);
};

tick();

window.addEventListener('reseize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
});