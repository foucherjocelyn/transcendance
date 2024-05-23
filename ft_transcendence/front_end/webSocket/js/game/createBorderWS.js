const { send_data } = require("../webSocket/dataToClient");
const { boxWS } = require("./formBox");

function create_border(name, width, height, length, posX, posY, posZ) {
    const distanceToTable = 0.01;
    const border = new boxWS();

    // name
    border.name = name;

    // size
    border.size.width = width;
    border.size.height = height;
    border.size.length = length;

    // position
    border.position.x = posX;
    border.position.y = posY + distanceToTable;
    border.position.z = posZ;

    return border;
}

function create_left_border(gameSettings) {
    return create_border(
        'left border',
        gameSettings.size.border,
        gameSettings.size.border,
        gameSettings.size.table.height + (gameSettings.size.border * 2),
        -(gameSettings.size.table.width / 2) - (gameSettings.size.border / 2),
        gameSettings.size.border / 2,
        0
    );
}

function create_right_border(gameSettings) {
    return create_border(
        'right border',
        gameSettings.size.border,
        gameSettings.size.border,
        gameSettings.size.table.height + (gameSettings.size.border * 2),
        (gameSettings.size.table.width / 2) + (gameSettings.size.border / 2),
        gameSettings.size.border / 2,
        0
    );
}

function create_top_border(gameSettings) {
    return create_border(
        'top border',
        gameSettings.size.table.width + (gameSettings.size.border * 2),
        gameSettings.size.border,
        gameSettings.size.border,
        0,
        gameSettings.size.border / 2,
        -(gameSettings.size.table.height / 2) - (gameSettings.size.border / 2)
    );
}

function create_bottom_border(gameSettings) {
    return create_border(
        'bottom border',
        gameSettings.size.table.width + (gameSettings.size.border * 2),
        gameSettings.size.border,
        gameSettings.size.border,
        0,
        gameSettings.size.border / 2,
        (gameSettings.size.table.height / 2) + (gameSettings.size.border / 2)
    );
}

function    create_borders_ws(match)
{
    match.pongGame.listBorder = [];

    const createBorderFunctions = [
        create_left_border,
        create_right_border,
        create_top_border,
        create_bottom_border
    ];

    for (let i = 0; i < createBorderFunctions.length; i++) {
        const border = createBorderFunctions[i](match.gameSettings);
        match.pongGame.listBorder.push(border);
    }
    send_data('update borders', match.pongGame.listBorder, 'server', match.listUser)
}

module.exports = {
    create_borders_ws
};
