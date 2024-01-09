<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  Mesh,
  Object3D,
  AmbientLight,
  MeshPhysicalMaterial,
  Vector2,
} from "three";
import { getCubeMapByName } from "@/utils/helpers/three";
import { useMouseDirection, usePerspective } from "@/hooks";

const envMap = getCubeMapByName("Lycksele2");

const mouseDirection = useMouseDirection();

envMap.transformUv(new Vector2(0.5, 0.5));

const container = ref<HTMLDivElement>();

const { scene, camera, renderer } = usePerspective(
  {
    fov: 45,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,
  },
  { antialias: true },
);

const daveLogo = ref<Object3D>();

renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);

function render() {
  requestAnimationFrame(render);

  const [mouseX, mouseY] = mouseDirection.value;
  if (daveLogo.value) {
    daveLogo.value.rotation.x = mouseY * 0.5;
    daveLogo.value.rotation.y = mouseX * 0.5;
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

  camera.position.set(0, 0, 7);
  camera.rotation.set(0, 0, 0);

  const ambientLight = new AmbientLight(0xffffff, 2);

  scene.add(ambientLight);
}

renderer.domElement.removeAttribute("style");
renderer.domElement.setAttribute("class", "-z-20");

onMounted(() => {
  if (container.value && renderer && scene) {
    container.value.appendChild(renderer.domElement);
    renderer.setClearAlpha(0.0);

    loadScene();
    render();
  }
});
</script>
<template>
  <div class="absolute inset-0 flex" ref="container"></div>
</template>
