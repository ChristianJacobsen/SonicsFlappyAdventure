window.Player = (function () {
    "use strict";

    var Controls = window.Controls;

    // All these constants are in em"s, multiply by 10 pixels
    // for 1024x576px canvas.
    var JUMP = 0.7;
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
        this.boundingBox = {
            topLeft: {
                x: 0,
                y: 0
            },
            botRight: {
                x: 0,
                y: 0
            }
        }
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
        this.boundingBox.topLeft.x = this.pos.x - (WIDTH / 2);
        this.boundingBox.topLeft.y = this.pos.y - (HEIGHT / 2);
        this.boundingBox.botRight.x = this.pos.x + (WIDTH / 2);
        this.boundingBox.botRight.y = this.pos.y + (HEIGHT / 2);
    };

    Player.prototype.onFrame = function (delta) {
        // Gravity working against speed
        this.speed += delta * 2;

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
        this.boundingBox.topLeft.y += this.speed;
        this.boundingBox.botRight.y += this.speed;

        this.checkCollisions();

        // Update UI
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em)");
    };

    Player.prototype.intersects = function (box) {
        return (this.boundingBox.topLeft.x < box.botRight.x && box.topLeft.x < this.boundingBox.botRight.x &&
            this.boundingBox.topLeft.y < box.botRight.y && box.topLeft.y < this.boundingBox.botRight.y);
    }

    Player.prototype.checkCollisions = function () {
        // Ground
        if (this.game.WORLD_HEIGHT < this.pos.y + (HEIGHT / 2)) {
            return this.game.gameover();
        }

        // Pipes
        for (let i = 0; i < this.game.pipes.length; i++) {
            let pipe = this.game.pipes[i];

            if (pipe.active && pipe.point) {
                // Pipe
                if (this.intersects(pipe.pipeBoundingBox)) {

                    if (this.intersects(pipe.topBoundingBox)) {
                        console.log("TOP");
                    }

                    if (this.intersects(pipe.botBoundingBox)) {
                        console.log("BOTTOM");
                    }

                    // Top and bot
                    if (this.intersects(pipe.topBoundingBox) || this.intersects(pipe.botBoundingBox)) {
                        console.log("HERE");
                        return this.game.gameover();
                    }
                    // Gap
                    else if (this.intersects(pipe.gapBoundingBox)) {
                        pipe.point = false;
                        this.game.score++;
                        this.game.scoreElem.text(this.game.score);
                    }
                    // Collision out of scope
                    else {
                        return this.game.gameover();
                    }
                }
            }
        }
    };

    return Player;

})();
