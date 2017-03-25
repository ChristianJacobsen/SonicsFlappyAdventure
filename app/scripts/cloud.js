window.Cloud = (function () {
    "use strict";

    const CLOUD_WIDTH = 23; // Width of cloud

    var Cloud = function (el, game) {
        this.el = el;
        this.game = game;
        this.pos = {
            x: 0,
            y: 0
        };
        this.speed = 0;

        this.reset();
    };

    /**
     * Randomize the cloud position and speed
     */
    Cloud.prototype.reset = function () {
        // Randomize position and speed
        this.pos.x = this.game.WORLD_WIDTH + Math.random() * 20;
        this.pos.y = Math.random() * (this.game.WORLD_HEIGHT * 0.3);
        this.speed = Math.random() * (0.15 - 0.05) + 0.05;
    };

    Cloud.prototype.onFrame = function () {
        // Apply speed to x position
        this.pos.x -= this.speed;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    /**
     * Check if the cloud is out of frame and resets if so
     */
    Cloud.prototype.checkCollisionWithBounds = function () {
        if (this.pos.x < -CLOUD_WIDTH) {
            this.reset();
        }
    };

    return Cloud;

})();
