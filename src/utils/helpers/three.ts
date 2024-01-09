import { CubeTexture, CubeTextureLoader } from "three";

export const getCubeMapByName = (name: string): CubeTexture => {
  const loader = new CubeTextureLoader();
  loader.setPath(`/textures/cube/${name}/`);
  return loader.load([
    "posx.jpg",
    "negx.jpg",
    "posy.jpg",
    "negy.jpg",
    "posz.jpg",
    "negz.jpg",
  ]);
};
