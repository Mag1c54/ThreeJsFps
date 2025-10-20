import * as RAPIER from "@dimforge/rapier3d-compat";

let gravity: RAPIER.Vector3 | null = null;
let world: RAPIER.World | null = null;

export async function initPhysics() {
  await RAPIER.init();
  gravity = new RAPIER.Vector3(0, -40.81, 0);
  world = new RAPIER.World(gravity);
  console.log("✅ Rapier3D успешно инициализирован.");
}

export function getWorld(): RAPIER.World {
  if (!world)
    throw new Error(
      "❌ Мир Rapier не инициализирован! Сначала вызови initPhysics()."
    );
  return world;
}

export function getGravity(): RAPIER.Vector3 {
  if (!gravity) throw new Error("❌ Гравитация не инициализирована!");
  return gravity;
}

export { RAPIER };
