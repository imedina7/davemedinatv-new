<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  Mesh,
  Object3D,
  AmbientLight,
  MeshPhysicalMaterial,
  Raycaster,
  PerspectiveCamera,
} from "three";
import {
  getCubeMapByName,
  isScreenTooThin,
  getCameraDistance,
  THIN_SCREEN_ASPECT_THRESHOLD,
  BASE_CAMERA_DISTANCE,
} from "@/utils/helpers/three";
import { MouseEventType, useMouseDirection, usePerspective } from "@/hooks";

const envMap = getCubeMapByName("Lycksele2");

const mouseDirection = useMouseDirection();
const mouseClick = useMouseDirection(MouseEventType.CLICK, () => {
  const intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((intersect) => {
    if (intersect.object.isObject3D) {
      const mesh = intersect.object as Mesh;
      console.log("mesh clicked", mesh);
    }
  });
});

const container = ref<HTMLDivElement>();

const { scene, camera, renderer } = usePerspective(
  {
    fov: 60,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
  },
  { antialias: true },
);

const raycaster = new Raycaster();

const daveLogo = ref<Object3D>();

renderer.setSize(window.innerWidth, window.innerHeight);

function updateCameraAndRenderer() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const aspect = width / height;

  renderer.setSize(width, height);

  if (camera instanceof PerspectiveCamera) {
    camera.aspect = aspect;
    camera.position.z = getCameraDistance(aspect);
    camera.updateProjectionMatrix();
  }
}

function render() {
  requestAnimationFrame(render);
  const { x, y } = mouseDirection.value;
  raycaster.setFromCamera(mouseClick.value, camera);
  if (daveLogo.value) {
    daveLogo.value.rotation.x = y * 0.5;
    daveLogo.value.rotation.y = x * 0.5;
  }
  renderer.render(scene, camera);
}

async function loadScene() {
  const loader = new GLTFLoader();

  const { scene: gltfScene } = await loader.loadAsync("/models/dave_logo.glb");

  const newMat = new MeshPhysicalMaterial({
    color: 0x777777,
    roughness: 0,
    envMap,
    reflectivity: 1,
    emissive: 0xffffff,
    emissiveIntensity: 0.1,
  });

  const newMesh = gltfScene.children[0] as Mesh;
  const newObj = new Mesh(newMesh.geometry, newMat);

  newObj.position.set(0, 0, 0);
  newObj.scale.set(0.2, 0.2, 0.2);

  daveLogo.value = newObj;
  scene.add(newObj);

  camera.position.set(0, -1, getCameraDistance(window.innerWidth / window.innerHeight));
  camera.rotation.set(0, 0, 0);

  const ambientLight = new AmbientLight(0xffffff, 2);

  scene.add(ambientLight);
}

onMounted(() => {
  if (container.value && renderer && scene) {
    container.value.appendChild(renderer.domElement);
    renderer.setClearAlpha(0.0);

    updateCameraAndRenderer();

    window.addEventListener("resize", updateCameraAndRenderer);

    loadScene();
    render();
  }
});

onUnmounted(() => {
  window.removeEventListener("resize", updateCameraAndRenderer);
});

</script>
<template>
  <div class="absolute inset-0 flex -z-20" ref="container"></div>
</template>