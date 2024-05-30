class   formPongGameWS {
    constructor() {
        this.lostPoint = false,
        this.gameOver = false,
        this.plane = undefined,
        this.limit = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.border = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.listBorder = undefined,
        this.paddle = {
            left: undefined,
            right: undefined,
            top: undefined,
            bottom: undefined
        },
        this.listPaddle = undefined,
        this.ball = undefined
    }
};

class   boxWS {
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
        this.speed = undefined
    }
};

module.exports = {
    boxWS,
    formPongGameWS
};
