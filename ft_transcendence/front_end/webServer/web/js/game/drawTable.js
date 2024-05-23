import { pongGame } from "../client/client.js";
import { gameSettings } from "../gameSettings/updateGameSetting.js";
import { createPlane, delete_old_object } from "./createObjects.js";
import { displayPongGame } from "./startGame.js";

function    delete_old_plane()
{
    if (displayPongGame.table.length === 0)
        return ;
    
    const   pongTable = displayPongGame.table;
    for (let row = 0; row < pongTable.length; row++)
    {
        for (let column = 0; column < pongTable[row].length; column++)
        {
            let plane = pongTable[row][column];
            delete_old_object(plane);
        }
    }
}

export function draw_table()
{
    delete_old_plane();

    displayPongGame.table = [];

    const   pongTable = displayPongGame.table;
    const   wTable = gameSettings.size.table.width;
    const   hTable = gameSettings.size.table.height;
    const   colorBorder = gameSettings.color.border;
    const   colorPlane = gameSettings.color.plane;

    let poZ = -(hTable / 2) + 0.5;
    for (let row = 0; row < hTable; row++)
    {
        let poX = -(wTable / 2) + 0.5;
        pongTable[row] = [];
        
        for (let column = 0; column < wTable; column++)
        {
            let plane = (poX === 0 && row % 2 === 0) ?
            createPlane(colorBorder) :
            createPlane(colorPlane);
            
            plane.position.set(poX, 0, poZ);
            pongGame.scene.add(plane);

            pongTable[row][column] = plane;

            poX += 1;
        }
        poZ += 1;
    }
}
