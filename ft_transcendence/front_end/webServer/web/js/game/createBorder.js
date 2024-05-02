import { THREE } from './gameWindows.js';
import { gameSettings } from "../gameSettings/getInputsGameSettings.js";
import { box, createBox, delete_old_object } from "./createObjects.js";
import { pongGame } from "./startGame.js";

function    create_left_border()
{
    const   distanceToTable = 0.01;
    const   border  = new box();

    // name
    border.name = 'left border';

    // size
    border.size.width = gameSettings.size.border;
    border.size.height = gameSettings.size.border;
    border.size.length = gameSettings.size.table.height + (gameSettings.size.border * 2);

    // position
    border.position.x = -(gameSettings.size.table.width / 2) - (border.size.width / 2);
    border.position.y = (border.size.height / 2) + distanceToTable;
    border.position.z = 0;

    // display
    border.display = createBox(border.size.width, border.size.height, border.size.length);
    border.display.material.color = new THREE.Color(gameSettings.color.border);
    border.display.position.set(border.position.x, border.position.y, border.position.z);
    pongGame.scene.add(border.display);

    return border;
}

function    create_right_border()
{
    const   distanceToTable = 0.01;
    const   border  = new box();

    // name
    border.name = 'right border';

    // size
    Object.assign(border.size, pongGame.border.left.size);

    // position
    border.position.x = (gameSettings.size.table.width / 2) + (border.size.width / 2);
    border.position.y = (border.size.height / 2) + distanceToTable;
    border.position.z = 0;

    // display
    border.display = createBox(border.size.width, border.size.height, border.size.length);
    border.display.material.color = new THREE.Color(gameSettings.color.border);
    border.display.position.set(border.position.x, border.position.y, border.position.z);
    pongGame.scene.add(border.display);

    return border;
}

function    create_top_border()
{
    const   distanceToTable = 0.01;
    const   border  = new box();

    // name
    border.name = 'top border';

    // size
    border.size.width = gameSettings.size.table.width + (gameSettings.size.border * 2);
    border.size.height = gameSettings.size.border;
    border.size.length = gameSettings.size.border;

    // position
    border.position.x = 0;
    border.position.y = (border.size.height / 2) + distanceToTable;
    border.position.z = -(gameSettings.size.table.height / 2) - (border.size.length / 2);

    // display
    border.display = createBox(border.size.width, border.size.height, border.size.length);
    border.display.material.color = new THREE.Color(gameSettings.color.border);
    border.display.position.set(border.position.x, border.position.y, border.position.z);
    pongGame.scene.add(border.display);

    return border;
}

function    create_bottom_border()
{
    const   distanceToTable = 0.01;
    const   border  = new box();

    // name
    border.name = 'bottom border';
    
    // size
    Object.assign(border.size, pongGame.border.top.size);

    // position
    border.position.x = 0;
    border.position.y = (border.size.height / 2) + distanceToTable;
    border.position.z = (gameSettings.size.table.height / 2) + (border.size.length / 2);

    // display
    border.display = createBox(border.size.width, border.size.height, border.size.length);
    border.display.material.color = new THREE.Color(gameSettings.color.border);
    border.display.position.set(border.position.x, border.position.y, border.position.z);
    pongGame.scene.add(border.display);

    return border;
}

function    delete_old_border()
{
    if (pongGame.listBorder === undefined)
        return ;

    pongGame.listBorder.forEach(border => {
        if (border !== undefined)
        {
            delete_old_object(border.display);
            border = undefined;
        }
    })

    pongGame.border.left = undefined;
    pongGame.border.right = undefined;
    pongGame.border.top = undefined;
    pongGame.border.bottom = undefined;
}

function    define_border(id)
{
    for (let i = 0; i < pongGame.listBorder.length; i++)
    {
        const   border = pongGame.listBorder[i];
        if (i === id)
            return border;
    }
    return undefined;
}

function    create_border()
{
    delete_old_border();

    pongGame.border.left = create_left_border();
    pongGame.border.right = create_right_border();
    pongGame.border.top = create_top_border();
    pongGame.border.bottom = create_bottom_border();

    pongGame.listBorder = [];
    pongGame.listBorder.push(pongGame.border.left);
    pongGame.listBorder.push(pongGame.border.right);
    pongGame.listBorder.push(pongGame.border.top);
    pongGame.listBorder.push(pongGame.border.bottom);
}

export {
    create_border,
    define_border
};
