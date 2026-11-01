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
} from "@/utils/helpers/three";
import { usePerspective } from "@/hooks";

const envMap = getCubeMapByName("Lycksele2");

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

// Drag state
const isDragging = ref(false);
const dragStart = ref({ x: 0, y: 0 });
const rotationStart = ref({ x: 0, y: 0 });

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

function onPointerDown(event: PointerEvent) {
  isDragging.value = true;
  dragStart.value = { x: event.clientX, y: event.clientY };
  if (daveLogo.value) {
    rotationStart.value = {
      x: daveLogo.value.rotation.x,
      y: daveLogo.value.rotation.y,
    };
  }
  (event.target as HTMLElement)?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
  if (!isDragging.value || !daveLogo.value) return;
  const dx = event.clientX - dragStart.value.x;
  const dy = event.clientY - dragStart.value.y;
  daveLogo.value.rotation.y = rotationStart.value.y + dx * 0.005;
  daveLogo.value.rotation.x = rotationStart.value.x + dy * 0.005;
}

function onPointerUp(event: PointerEvent) {
  isDragging.value = false;
  (event.target as HTMLElement)?.releasePointerCapture?.(event.pointerId);
}

function render() {
  requestAnimationFrame(render);
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

    // Attach drag handlers directly to the canvas element so that
    // interactions only fire where the canvas is directly visible.
    // pointer-events on the canvas stays auto; elements in front
    // (higher z-index) naturally capture their own events first.
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointerleave", onPointerUp);

    window.addEventListener("resize", updateCameraAndRenderer);

    loadScene();
    render();
  }
});

onUnmounted(() => {
  renderer.domElement.removeEventListener("pointerdown", onPointerDown);
  renderer.domElement.removeEventListener("pointermove", onPointerMove);
  renderer.domElement.removeEventListener("pointerup", onPointerUp);
  renderer.domElement.removeEventListener("pointerleave", onPointerUp);
  window.removeEventListener("resize", updateCameraAndRenderer);
});

</script>
<template>
  <div class="absolute inset-0 flex -z-20" ref="container"></div>
</template>