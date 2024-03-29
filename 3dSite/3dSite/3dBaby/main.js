import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

renderer.render(scene, camera);

const geometry = new THREE.TorusGeometry(10, 2, 6, 5);
//just the wire frame
// const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true});
//real material... needs light to appear
const material = new THREE.MeshStandardMaterial({
  color: 0x99ffb3,
  metalness: 0.75,
});
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);



const pointLight = new THREE.PointLight(0xffffff, 20, 20, 1);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// const lightHelper = new THREE.PointLightHelper(pointLight);
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}
// add the stars 200 times
Array(200).fill().forEach(addStar);

//moon

const moonTexture = new THREE.TextureLoader().load("moon.jpeg");
const normalTexture = new THREE.TextureLoader().load("normalMap.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 5;
moon.position.setX(-1)

function moveCamera(){
  const t = document.body.getBoundingClientRect().top

  camera.position.z = t * -0.01
  camera.position.x = t * -0.01
  camera.position.y = t * -0.01
}

document.body.onscroll = moveCamera


const spaceTexture = new THREE.TextureLoader().load("newSpace.jpg");
//fix color issue
spaceTexture.colorSpace = THREE.SRGBColorSpace;
scene.background = spaceTexture;

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  torus.rotation.z += 0.0;

  moon.rotation.y += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

animate();
