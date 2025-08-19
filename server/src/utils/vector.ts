import * as RAPIER from "@dimforge/rapier3d-compat";


export function normalizeVector3(vec: RAPIER.Vector3): RAPIER.Vector3 {
    const length = Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z);
    if (length === 0) return new RAPIER.Vector3(0, 0, 0);
    return new RAPIER.Vector3(vec.x / length, vec.y / length, vec.z / length);
  }