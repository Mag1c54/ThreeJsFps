import * as RAPIER from '@dimforge/rapier3d';

let gravity = new RAPIER.Vector3(0, -9.81, 0);
let world = new RAPIER.World(gravity);

export { RAPIER, world , gravity };