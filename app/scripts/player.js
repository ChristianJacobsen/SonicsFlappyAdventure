window.Player = (function () {
    "use strict";

    var Controls = window.Controls;

    const JUMP = 0.7; // Jump force
    const TIMER_LIMIT = 0.3; // Jump timer limit
    const WIDTH = 5; // Player width
    const HEIGHT = 5; // Player height
    const INITIAL_POSITION_X = 51.2; // Center X
    const INITIAL_POSITION_Y = 28.8; // Center Y
    const JUMPANIM_TIME = 600; // Animation time of jump
    const JUMP_ROTATION = -45; // Rotation of jump
    const ROTATION_DECAY = 2; // How many degrees to rotate each frame
    const MAX_ROTATION = 90; // Max rotation

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
        };
        this.speed = 0;
        this.rotation = 0; // Rotation degree
        this.timer = 0; // Timer for jump
        this.animTimeout = undefined;
    };

    /**
     * Resets the state of the player for a new game.
     */
    Player.prototype.reset = function () {
        this.pos.x = INITIAL_POSITION_X;
        this.pos.y = INITIAL_POSITION_Y;
        this.speed = 0;
        this.rotation = 0;
        this.boundingBox.topLeft.x = this.pos.x - (WIDTH / 2);
        this.boundingBox.topLeft.y = this.pos.y - (HEIGHT / 2);
        this.boundingBox.botRight.x = this.pos.x + (WIDTH / 2);
        this.boundingBox.botRight.y = this.pos.y + (HEIGHT / 2);

        // Restore animation
        this.el.css("animation-play-state", "running");
        this.el.css("background-position-x", "left");
        this.el.css("animation-name", "play");
        this.el.css("animation-timing-function", "steps(2)");
    };

    Player.prototype.onFrame = function (delta) {
        // Gravity working against speed
        this.speed += delta * 2;
        this.rotation += ROTATION_DECAY;

        // Do not rotate beyond max rotation
        if (MAX_ROTATION < this.rotation) {
            this.rotation = MAX_ROTATION;
        }

        // Jump on SPACE if timer is not set
        if ((Controls.keys.space || Controls.keys.leftmouse) && this.timer === 0) {
            this.timer = delta;
            this.speed = -JUMP;
            this.rotation = JUMP_ROTATION;
            this.game.jump(); // Plays sound
            this.jumpAnim();
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
        this.el.css("transform", "translateZ(0) translate(" + this.pos.x + "em, " + this.pos.y + "em) rotate(" + this.rotation + "deg)");
    };

    /**
     * Play jump animation
     */
    Player.prototype.jumpAnim = function () {
        // Clear restore timout if ongoing
        if (this.animTimeout !== undefined) {
            clearTimeout(this.animTimeout);
        }

        // Set sprite animation
        this.el.css("background-position-x", "50%");
        this.el.css("animation-name", "jump");
        this.el.css("animation-timing-function", "steps(3)");

        // Restore idle animation after jump
        let elem = this.el;
        this.animTimeout = setTimeout(function () {
            elem.css("background-position-x", "left");
            elem.css("animation-name", "play");
            elem.css("animation-timing-function", "steps(2)");
        }, JUMPANIM_TIME);
    };

    /**
     * Stops animations and calls gameover in Game
     */
    Player.prototype.gameover = function () {
        // Clear restore timout if ongoing
        if (this.animTimeout !== undefined) {
            clearTimeout(this.animTimeout);
        }

        // Pause animation
        this.el.css("animation-play-state", "paused");

        return this.game.gameover();
    };

    /**
     * Check if the player intersects with a box
     */
    Player.prototype.intersects = function (box) {
        return (this.boundingBox.topLeft.x < box.botRight.x && box.topLeft.x < this.boundingBox.botRight.x &&
            this.boundingBox.topLeft.y < box.botRight.y && box.topLeft.y < this.boundingBox.botRight.y);
    };

    /**
     * Check if the player is colliding with anything
     */
    Player.prototype.checkCollisions = function () {
        // Ground
        if ((this.game.WORLD_HEIGHT - this.game.GROUND_HEIGHT) < this.pos.y + (HEIGHT / 2)) {
            return this.gameover();
        }

        // Pipes
        for (let i = 0; i < this.game.pipes.length; i++) {
            let pipe = this.game.pipes[i];

            if (pipe.active) {
                // Pipe
                if (this.intersects(pipe.pipeBoundingBox)) {
                    // Gap
                    if (pipe.gapStartY < this.boundingBox.topLeft.y &&
                        this.boundingBox.botRight.y < pipe.gapEndY) {
                        // Check if pipe has a point (ring)
                        if (pipe.point) {
                            pipe.collect();
                            this.game.addPoint();
                        }
                    }
                    // Collide with pipe 
                    else {
                        return this.gameover();
                    }
                }
            }
        }
    };

    return Player;

})();
