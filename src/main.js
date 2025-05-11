import './style.css';
import * as THREE from 'three';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const bgtexture = textureLoader.load('public/scenebg.jpg');
scene.background = bgtexture;

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

const boxGeometry = new THREE.BoxGeometry(5, 5, 5, 10);
const boxMaterial = new THREE.MeshNormalMaterial();
const box = new THREE.Mesh(boxGeometry, boxMaterial);
//これだけだと表示しない。カメラが原点を写している。boxがカメラと重なっているため表示されない
//x y z
box.position.set(0, 0.5, -15);
//回転させる
box.rotation.set(1,1,0);

const torusGeometry = new THREE.TorusGeometry(8, 2, 16, 100);
const torusMaterial = new THREE.MeshNormalMaterial();
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.set(0, 1, 10);
scene.add(box, torus);

//線形補間の実装　
//xがスタート地点、yはエンド地点、aは補間率、aが滑らかな直線になっていれば良い、一時線形補間　
function lerp(x, y, a) {
  return x * (1 - a) + y * a;
}  

function scaleParcent(start, end) {
  //各区間におけるどこに位置しているのかを算出する、lerp関数のaに入れる。そうすることで滑らかに変化
   return (scrollParcent - start) / (end - start);
}

//アニメーション
const animationScripts = [];
animationScripts.push({
  start: 0,
  end: 40,
  function () {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.position.z = lerp(-15, 2, scaleParcent(0, 40)); 
    torus.position.z = lerp(10, -20, scaleParcent(0, 40)); 
  },
});

animationScripts.push({
  start: 40,
  end: 60,
  function () {
    camera.lookAt(box.position);
    camera.position.set(0, 1, 10);
    box.rotation.z = lerp(1, Math.PI, scaleParcent(40, 60)); 
  },
});

animationScripts.push({
  start: 60,
  end: 80,
  function () {
    camera.lookAt(box.position);
    camera.position.x = lerp(0, -15, scaleParcent(60, 80));
    camera.position.y = lerp(1, 15, scaleParcent(60, 80));
    camera.position.z = lerp(10, 25, scaleParcent(60, 80));
  },
});

animationScripts.push({
  start: 80,
  end: 100,
  function () {
    camera.lookAt(box.position);
    box.rotation.x += 0.02;
    box.rotation.y += 0.02;
  },
});

function playScrollAnimation() {
  animationScripts.forEach((a) => {
    if (scrollParcent >= a.start && scrollParcent <= a.end) {
      a.function()
    }
  })
};

//ブラウザのスクロール率
let scrollParcent = 0;
document.body.onscroll = () => {
  scrollParcent = (document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;
};

const tick = () => {
  window.requestAnimationFrame(tick);
  playScrollAnimation();
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