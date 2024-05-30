import { pongGame } from '../client/client.js';
import { THREE } from './gameWindows.js';

export function    delete_old_object(obj)
{
    pongGame.scene.remove(obj);
    obj.geometry.dispose();
    obj.material.dispose();
}

// Form Box
export function	createBox(w, h, l)
{
	const	boxGeometry = new THREE.BoxGeometry(w, h, l);
	const	boxMaterial = new THREE.MeshStandardMaterial({
		color: 0xFFFFFF
	});
	const	box = new THREE.Mesh(boxGeometry, boxMaterial);
	box.castShadow = true; // put shadow
	return box
}

// Form Plane
export function    createPlane(colorPlane)
{
    const	planeGeometry = new THREE.PlaneGeometry(1, 1);
    let planeMaterial = new THREE.MeshBasicMaterial({
        color: colorPlane,
        side: THREE.DoubleSide // fill 2 face of grind
    });
    let plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.receiveShadow = true; // receive shadow
    return plane;
}
