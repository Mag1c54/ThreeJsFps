import * as THREE from 'three';

export const particles: THREE.Points[] = [];

export function makeParticles(position: THREE.Vector3, scene: THREE.Scene): void {
	const geometry = new THREE.BufferGeometry();
	const vertices: number[] = [];
	const colors: number[] = [];

	for (let i = 0; i < 80; i++) {
		const dir = new THREE.Vector3().randomDirection().multiplyScalar(Math.random());
		vertices.push(dir.x, dir.y, dir.z);
		const color = new THREE.Color(Math.random() * 0xffffff);
		colors.push(color.r, color.g, color.b);
	}

	geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
	geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

	const material = new THREE.PointsMaterial({
		size: 0.8,
		vertexColors: true,
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	});

	const points = new THREE.Points(geometry, material);
	points.position.copy(position);
	scene.add(points);
	particles.push(points);
}

export function updateParticle(points: THREE.Points, index: number, scene: THREE.Scene): void {
	const pos = points.geometry.getAttribute('position') as THREE.BufferAttribute;
	for (let i = 0; i < pos.count; i++) {
		pos.setY(i, pos.getY(i) - 0.03);
	}
	pos.needsUpdate = true;

	if (points.position.y + pos.getY(0) <= 0) {
		scene.remove(points);
		particles.splice(index, 1);
	}
}
