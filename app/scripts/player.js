window.Player = (function () {
    "use strict";

    var Controls = window.Controls;

    // All these constants are in em"s, multiply by 10 pixels
    // for 1024x576px canvas.
    var JUMP = 0.6;
    var TIMER = 0;
    var TIMER_LIMIT = 0.3;
    var WIDTH = 5;
    var HEIGHT = 5;
    var INITIAL_POSITION_X = 51.2;
    var INITIAL_POSITION_Y = 28.8;

    var Player = function (el, game) {
        this.el = el;
        this.game = game;
        this.pos = {
            x: 0,
            y: 0
        };
        this.speed = 0;
        this.timer = 0;
    };

    /**
     * Resets the state of the player for a new game.
     */
    Player.prototype.reset = function () {
        this.pos.x = INITIAL_POSITION_X;
        this.pos.y = INITIAL_POSITION_Y;
        this.speed = 0;
    };

    Player.prototype.onFrame = function (delta) {
        // Gravity working against speed
        this.speed += delta;

        // Jump on SPACE if timer is not set
        if (Controls.keys.space && this.timer === 0) {
            this.timer = delta;
            this.speed = -JUMP;
        }

        // Increase the timer if counting
        if (this.timer !== 0) {
            this.timer += delta;

            // Reset timer if limit reached
            if (TIMER_LIMIT < this.timer) {
                this.timer = 0;
            }
        }

        // Apply speed to y position
        this.pos.y += this.speed;

        this.checkCollisionWithBounds();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    Player.prototype.checkCollisionWithBounds = function () {
        if (this.game.WORLD_HEIGHT < this.pos.y + (HEIGHT / 2)) {
            return this.game.gameover();
        }
    };

    return Player;

})();
