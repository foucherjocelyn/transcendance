import { THREE } from './gameWindows.js';
import { pongGame } from './startGame.js';

class   box {
    constructor() {
        this.size = {
            width: undefined,
            height: undefined,
            length: undefined
        },
        this.position = {
            x: undefined,
            y: undefined,
            z: undefined
        },
        this.collisionPoint = {
            top: undefined,
            bottom: undefined,
            left: undefined,
            right: undefined
        },
        this.vector = {
            x: 0,
            y: 0
        },
        this.control = {
            left: undefined,
            right: undefined
        },
        this.collision = {
            touch: undefined,
            who: undefined,
            distance: undefined
        }
        this.name = undefined,
        this.speed = undefined,
        this.display = undefined
    }
};

function    delete_old_object(obj)
{
    pongGame.scene.remove(obj);
    obj.geometry.dispose();
    obj.material.dispose();
}

// Form Box
function	createBox(w, h, l)
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
function    createPlane(colorPlane)
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

export {
    createBox,
    createPlane,
    delete_old_object,
    box
};
