window.Pipe = (function () {
    "use strict";

    var SPEED = 0.35;

    var Pipe = function (el, game) {
        this.active = false;
        this.point = false;
        this.el = el;
        this.game = game;
        this.pos = {
            x: 0,
            y: 0
        };
        this.pipeBoundingBox = {
            topLeft: {
                x: 0,
                y: 0
            },
            botRight: {
                x: 0,
                y: 0
            }
        }
        this.topBoundingBox = {
            topLeft: {
                x: 0,
                y: 0
            },
            botRight: {
                x: 0,
                y: 0
            }
        }
        this.gapBoundingBox = {
            topLeft: {
                x: 0,
                y: 0
            },
            botRight: {
                x: 0,
                y: 0
            }
        }
        this.botBoundingBox = {
            topLeft: {
                x: 0,
                y: 0
            },
            botRight: {
                x: 0,
                y: 0
            }
        }
    };

    Pipe.prototype.onFrame = function () {
        // Apply speed to x position
        this.pos.x -= SPEED;
        this.pipeBoundingBox.topLeft.x -= SPEED;
        this.pipeBoundingBox.botRight.x -= SPEED;
        this.topBoundingBox.topLeft.x -= SPEED;
        this.topBoundingBox.botRight.x -= SPEED;
        this.gapBoundingBox.topLeft.x -= SPEED;
        this.gapBoundingBox.botRight.x -= SPEED;
        this.botBoundingBox.topLeft.x -= SPEED;
        this.botBoundingBox.botRight.x -= SPEED;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    Pipe.prototype.checkCollisionWithBounds = function () {
        if (this.pos.x < -10) {
            this.active = false;
            this.el.hide();
        }
    };

    return Pipe;

})();
