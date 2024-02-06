import "./style.css";

import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const buildings = new URL("./public/AnimationAssets/buildingAttempt01.glb", import.meta.url)

const loader = new GLTFLoader();


//setting up the loading of the model from blender
let mixer;
loader.load("./public/AnimationAssets/buildingAttempt01.glb", function (gltf) {
  const model = gltf.scene;

  // Iterate through materials and set them to MeshStandardMaterial
  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true; // Enable receiving shadows
      const standardMaterial = new THREE.MeshStandardMaterial({
        metalness: 1,
        roughness: 0.0, // Adjust as needed
        color: "#9151a6", // Set your desired color
      });

      child.material = standardMaterial;
    }
  });

  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;
  clips.forEach(function (clip) {
    const action = mixer.clipAction(clip);
    action.play();
  });
}, undefined, function (error) {
  console.error(error);
});


//create scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

camera.position.setZ(30);


//render setup
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Adjust as needed
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

// const rainbow = new THREE.TextureLoader().load("rainbow.jpg");

// const geometry = new THREE.TorusGeometry(10, 1.2, 6, 32);
// //just the wire frame
// // const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true});
// //real material... needs light to appear
// const material = new THREE.MeshStandardMaterial({

//   metalness: 0.75,
//   transparent: true,
//   opacity: 0.99,
//   map: rainbow


// });
// const torus = new THREE.Mesh(geometry, material);
// torus.rotation.x = Math.PI / 2;
// // torus.rotateX(180)

// scene.add(torus);

// const geometry2 = new THREE.CylinderGeometry(2, 4, 20, 7);
// //just the wire frame
// // const material = new THREE.MeshBasicMaterial( {color: 0xFF6347, wireframe: true});
// //real material... needs light to appear
// const material2 = new THREE.MeshBasicMaterial({
//   color: 0xfffff3,
//   wireframe: true

// });
// const shape = new THREE.Mesh(geometry2, material2);

// scene.add(shape);

const pointLight = new THREE.PointLight(0xffffff, 200, 20, 1);
pointLight.castShadow = true;
pointLight.position.set(5, 5, 3);

const pointLight2 = new THREE.PointLight(0xffffff, 200, 2000, 1);
pointLight2.castShadow = true;
pointLight2.position.set(-5, 5, -10);

const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(pointLight, pointLight2, ambientLight);


const spotLight = new THREE.SpotLight(0x00ff00, 2000,);
spotLight.position.set(2, 2, 3);
// spotLight.map = new THREE.TextureLoader().load( url );

spotLight.castShadow = true;
const spotLight2 = new THREE.SpotLight(0xff00ff, 2000,);
spotLight2.position.set(-2, 2, -3);
// spotLight.map = new THREE.TextureLoader().load( url );

spotLight2.castShadow = true;

// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024;

spotLight.shadow.camera.near = 500;
spotLight.shadow.camera.far = 4000;
spotLight.shadow.camera.fov = 30;

scene.add(spotLight, spotLight2);

//helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
const lightHelper2 = new THREE.PointLightHelper(pointLight2);
const spotLightHelper = new THREE.SpotLightHelper(spotLight)
const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2)
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(lightHelper, gridHelper, lightHelper2, spotLightHelper, spotLightHelper2);

const controls = new OrbitControls(camera, renderer.domElement);

// function addStar() {
//   const geometry = new THREE.SphereGeometry(0.25, 24, 24);
//   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
//   const star = new THREE.Mesh(geometry, material);

//   const [x, y, z] = Array(3)
//     .fill()
//     .map(() => THREE.MathUtils.randFloatSpread(100));

//   star.position.set(x, y, z);
//   scene.add(star);
// }
// // add the stars 200 times
// Array(200).fill().forEach(addStar);

//moon

// const moonTexture = new THREE.TextureLoader().load("moon.jpeg");
// const normalTexture = new THREE.TextureLoader().load("normalMap.jpg");

// const moon = new THREE.Mesh(
//   new THREE.SphereGeometry(3, 32, 32),
//   new THREE.MeshStandardMaterial({
//     map: moonTexture,
//     normalMap: normalTexture,
//   })
// );

// scene.add(moon);

// moon.position.z = 0;
// moon.position.y = 10;
// // moon.position.setX(-1)

function moveCamera() {
  const t = document.body.getBoundingClientRect().top

  camera.position.z = t * -0.01
  camera.position.x = t * -0.01
  camera.position.y = t * -0.01
}

document.body.onscroll = moveCamera

// background
// const spaceTexture = new THREE.TextureLoader().load("newSpace.jpg");
// //fix color issue
// spaceTexture.colorSpace = THREE.SRGBColorSpace;
// scene.background = spaceTexture;


const clock = new THREE.Clock();
function animate() {

  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.01;
  // torus.rotation.z += 0.01;

  // shape.rotation.y += 0.01;

  // moon.rotation.y += 0.01;

  controls.update();


  if (mixer)
    mixer.update(clock.getDelta());

  renderer.render(scene, camera);
}

animate();
