window.Ground = (function () {
    "use strict";

    var SWEET_SPOT = 75;

    var Ground = function (el, game) {
        this.el = el;
        this.game = game;
        this.pos = {
            x: 0,
            y: 0
        };
        this.count = 0;
    };

    Ground.prototype.onFrame = function () {
        // Apply speed to x position
        this.pos.x -= this.game.PIPE_GROUND_SPEED;
        this.count++;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    Ground.prototype.checkCollisionWithBounds = function () {
        if (this.count === SWEET_SPOT) {
            this.count = 0;
            this.pos.x = 0;
        }
    };

    return Ground;

})();
