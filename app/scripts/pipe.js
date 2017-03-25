window.Pipe = (function () {
    "use strict";

    var Pipe = function (el, game) {
        this.active = false; // Active flag
        this.point = false; // Point flag
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
        };
        this.gapStartY = 0;
        this.gapEndY = 0;
        this.gapEl = this.el.find(".Gap"); // Gap element
    };

    Pipe.prototype.onFrame = function () {
        // Apply speed to x position
        this.pos.x -= this.game.PIPE_GROUND_SPEED;
        this.pipeBoundingBox.topLeft.x -= this.game.PIPE_GROUND_SPEED;
        this.pipeBoundingBox.botRight.x -= this.game.PIPE_GROUND_SPEED;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    /**
     * Sets the point flag to false and removes the ring
     */
    Pipe.prototype.collect = function () {
        this.point = false;
        this.gapEl.addClass("collectedGap");
    };

    /**
     * Check if the pipe is out of frame and disables itself if so
     */
    Pipe.prototype.checkCollisionWithBounds = function () {
        if (this.pos.x < -10) {
            this.active = false;
            this.el.hide();
        }
    };

    return Pipe;

})();
