function    update_collision_points(obj)
{
    if (obj === undefined)
        return ;

    obj.collisionPoint.top = obj.position.z - (obj.size.length / 2);
    obj.collisionPoint.bottom = obj.position.z + (obj.size.length / 2);
    obj.collisionPoint.left = obj.position.x - (obj.size.width / 2);
    obj.collisionPoint.right = obj.position.x + (obj.size.width / 2);
}

function    update_status_objects(pongGame)
{
    update_collision_points(pongGame.ball);

    pongGame.listPaddle.forEach(paddle => {
        if (paddle !== undefined) {
            update_collision_points(paddle);
        }
    })

    pongGame.listBorder.forEach(border => {
        if (border !== undefined) {
            update_collision_points(border);
        }
    })
}

module.exports = {
    update_status_objects
};

