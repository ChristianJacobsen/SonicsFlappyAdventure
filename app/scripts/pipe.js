window.Pipe = (function () {
    "use strict";

    var SPEED = 0.5;
    var WIDTH = 5;
    var HEIGHT = 5;

    var Pipe = function (el, game) {
        this.el = el;
        this.game = game;
        this.pos = {
            x: game.WORLD_WIDTH,
            y: 0
        };
    };

    Pipe.prototype.onFrame = function () {
        // Apply speed to x position
        this.pos.x -= SPEED;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    Pipe.prototype.checkCollisionWithBounds = function () {
        if (this.pos.x < -10) {
            this.el.remove();
            this.game.pipes.splice(0, 1);
        }
    };

    return Pipe;

})();
