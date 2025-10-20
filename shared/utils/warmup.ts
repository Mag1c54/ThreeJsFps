// import * as THREE from "three";

// export function warmupShaders(
//   models:
//     | Map<string, THREE.Object3D>
//     | THREE.Object3D[]
//     | Record<string, THREE.Object3D>,
//   scene: THREE.Scene,
//   renderer: THREE.WebGLRenderer,
//   camera: THREE.Camera
// ): void {
//   console.log("Прогрев шейдеров...");

//   const modelArray: THREE.Object3D[] = [];
//   if (models instanceof Map) {
//     models.forEach((model) => modelArray.push(model));
//   } else if (Array.isArray(models)) {
//     modelArray.push(...models);
//   } else {
//     modelArray.push(...Object.values(models));
//   }

//   modelArray.forEach((model) => {
//     model.visible = false;
//     scene.add(model);
//   });

//   renderer.render(scene, camera);

//   modelArray.forEach((model) => {
//     scene.remove(model);
//   });

//   console.log("✅ Прогрев завершен.");
// }


// to do