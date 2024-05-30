function    verticalCheck(point, obj)
{
    if (point > obj.collisionPoint.left && point < obj.collisionPoint.right)
        return (1);
    return (0);
}

function    verticalCollisionCheck(obj, obj2)
{
    if (verticalCheck(obj.collisionPoint.left, obj2))
        return (1);
    else if (verticalCheck(obj.collisionPoint.right, obj2))
        return (1);
    else if (verticalCheck(obj2.collisionPoint.left, obj))
        return (1);
    else if (verticalCheck(obj2.collisionPoint.right, obj))
        return (1);
    return (0);
}

function    verticalCollision(obj, obj2)
{
    let   speed = (obj.vector.y < 0) ? -obj.vector.y : obj.vector.y;

    if ((obj.vector.y < 0) && (obj.position.z > obj2.position.z))
    {
        if (obj.collisionPoint.top - speed <= obj2.collisionPoint.bottom)
            return (1);
    }
    else if ((obj.vector.y >= 0) && (obj.position.z < obj2.position.z))
    {
        if (obj.collisionPoint.bottom + speed >= obj2.collisionPoint.top)
            return (-1);
    }
    return (0);
}

/* --------------- */
function    horizontalCheck(point, obj)
{
    if (point > obj.collisionPoint.top && point < obj.collisionPoint.bottom)
        return (1);
    return (0);
}

function    horizontalCollisionCheck(obj, obj2)
{
    if (horizontalCheck(obj.collisionPoint.top, obj2))
        return (1);
    else if (horizontalCheck(obj.collisionPoint.bottom, obj2))
        return (1);
    else if (horizontalCheck(obj2.collisionPoint.top, obj))
        return (1);
    else if (horizontalCheck(obj2.collisionPoint.bottom, obj))
        return (1);
    return (0);
}

function    horizontalCollision(obj, obj2)
{
    let speed = (obj.vector.x < 0) ? -obj.vector.x : obj.vector.x;

    if ((obj.vector.x < 0) && (obj.position.x > obj2.position.x))
    {
        if (obj.collisionPoint.left - speed <= obj2.collisionPoint.right)
            return (1);
    }
    else if ((obj.vector.x >= 0) && (obj.position.x < obj2.position.x))
    {
        if (obj.collisionPoint.right + speed >= obj2.collisionPoint.left)
            return (-1);
    }
    return (0);
}

/* --------------- */
function    updateInformationsCollision(obj, obj2, distance, touch)
{
    obj.collision.touch = touch;
    obj.collision.who = obj2;
    obj.collision.distance = distance;
}

function    resetInformationsCollision(obj)
{
    obj.collision.touch = undefined;
    obj.collision.who = undefined;
    obj.collision.distance = -1;
}

function    check_collision(obj, obj2)
{
    if (obj === undefined || obj2 === undefined)
        return false;
    
    resetInformationsCollision(obj);

    if (verticalCollisionCheck(obj, obj2))
    {
        const   collision = verticalCollision(obj, obj2);
        if (collision == 1)
        {
            // console.log('top ' + obj2.name);
            const   distance = obj.collisionPoint.top - obj2.collisionPoint.bottom;
            updateInformationsCollision(obj, obj2, distance, 'top');
            return (true);
        }
        else if (collision == -1)
        {
            // console.log('bottom ' + obj2.name);
            const   distance = obj2.collisionPoint.top - obj.collisionPoint.bottom;
            updateInformationsCollision(obj, obj2, distance, 'bottom');
            return (true);
        }
    }
    else if (horizontalCollisionCheck(obj, obj2))
    {
        const   collision = horizontalCollision(obj, obj2);
        if (collision == 1)
        {
            // console.log('left ' + obj2.name);
            const   distance = obj.collisionPoint.left - obj2.collisionPoint.right;
            updateInformationsCollision(obj, obj2, distance, 'left');
            return (true);
        }
        else if (collision == -1)
        {
            // console.log('right ' + obj2.name);
            const   distance = obj2.collisionPoint.left - obj.collisionPoint.right;
            updateInformationsCollision(obj, obj2, distance, 'right');
            return (true);
        }
    }
    return (false);
}

module.exports = {
    check_collision
};
