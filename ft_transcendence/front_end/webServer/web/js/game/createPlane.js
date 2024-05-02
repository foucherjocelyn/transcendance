import { gameSettings } from "../gameSettings/getInputsGameSettings.js";
import { createPlane, delete_old_object } from "./createObjects.js";
import { pongGame } from "./startGame.js";

function    setup_limit_table(wTable, hTable)
{
    pongGame.limit.top = -(hTable / 2);
    pongGame.limit.bottom = hTable / 2;
    pongGame.limit.left = -(wTable / 2);
    pongGame.limit.right = wTable / 2;
}

function    delete_old_plane()
{
    let table = pongGame.plane;

    for (let row = 0; row < table.length; row++)
    {
        for (let column = 0; column < table[row].length; column++)
        {
            let plane = table[row][column];
            delete_old_object(plane);
            table[row][column] = null;
        }
    }
    table = [];
}

function    create_plane()
{
    if (pongGame.plane !== undefined)
        delete_old_plane();

    pongGame.plane = [];

    const   wTable = gameSettings.size.table.width;
    const   hTable = gameSettings.size.table.height;
    const   colorBorder = gameSettings.color.border;
    const   colorPlane = gameSettings.color.plane;

    setup_limit_table(wTable, hTable);

    let poZ = -(hTable / 2) + 0.5;
    for (let row = 0; row < hTable; row++)
    {
        let poX = -(wTable / 2) + 0.5;
        pongGame.plane[row] = [];
        
        for (let column = 0; column < wTable; column++)
        {
            let plane = (poX === 0 && row % 2 === 0) ?
            createPlane(colorBorder) :
            createPlane(colorPlane);
            
            plane.position.set(poX, 0, poZ);
            pongGame.scene.add(plane);

            pongGame.plane[row][column] = plane;

            poX += 1;
        }
        poZ += 1;
    }
}

export {
    create_plane
};
