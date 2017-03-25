window.Game = (function () {
    "use strict";

    var PIPE_FRAME_COUNT = 120;
    var GAP_HEIGHT = 17;
    var PIPE_WIDTH = 8;
    var CLOUD_COUNT = 4;
    var PIPE_COUNT = 3;

    /**
     * Main game class.
     * @param {Element} el jQuery element containing the game.
     * @constructor
     */
    var Game = function (el) {
        this.el = el;
        this.player = new window.Player(this.el.find(".Player"), this);
        this.isPlaying = false;
        this.score = 0;
        this.highscore = 0;
        this.scoreElem = this.el.find(".Score > p");
        this.scoreboard = new window.Scoreboard(this.el.find(".Scoreboard"), this);
        this.pipeFrameCount = 0;
        this.nextPipe = 0;
        this.ground = new window.Ground(this.el.find(".Ground"), this);

        this.pipes = [];

        for (let i = 0; i < PIPE_COUNT; i++) {
            this.pipes.push(new window.Pipe($(".Pipe" + (i + 1) + ""), this));
        }

        this.clouds = [];

        for (let i = 0; i < CLOUD_COUNT; i++) {
            this.clouds.push(new window.Cloud($(".Cloud" + (i + 1) + ""), this));
        }

        // Cache a bound onFrame since we need it each frame.
        this.onFrame = this.onFrame.bind(this);
    };

    /**
     * Runs every frame. Calculates a delta and allows each game
     * entity to update itself.
     */
    Game.prototype.onFrame = function () {
        // Check if the game loop should stop.
        if (!this.isPlaying) {
            return;
        }

        // Calculate how long since last frame in seconds.
        var now = +new Date() / 1000,
            delta = now - this.lastFrame;
        this.lastFrame = now;

        // Pipe timer
        this.pipeFrameCount++;
        this.pipe();

        // Update player
        this.player.onFrame(delta);

        // Update pipes
        for (let i = 0; i < this.pipes.length; i++) {
            if (this.pipes[i].active) {
                this.pipes[i].onFrame();
            }
        }

        // Update ground
        this.ground.onFrame();

        // Update clouds
        for (let i = 0; i < this.clouds.length; i++) {
            this.clouds[i].onFrame();
        }

        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    };

    /**
     * Checks if a pipe should be spawned and spawns if so.
     */
    Game.prototype.pipe = function () {
        if (PIPE_FRAME_COUNT < this.pipeFrameCount) {
            // Reset timer
            this.pipeFrameCount = 0;

            let pipe = this.pipes[this.nextPipe % 3];
            this.nextPipe++;

            // Randomize the height of each segment of pipe
            let gapCenter = Math.random() * ((this.WORLD_HEIGHT * 0.8) - (this.WORLD_HEIGHT * 0.2)) + (this.WORLD_HEIGHT * 0.2);
            let topHeight = gapCenter - (GAP_HEIGHT / 2);
            let botHeight = this.WORLD_HEIGHT - GAP_HEIGHT - topHeight;

            pipe.el.children(".Top").css("height", topHeight + "em");
            pipe.el.children(".Gap").css("height", GAP_HEIGHT + "em");
            pipe.el.children(".Bot").css("height", botHeight + "em");

            pipe.pos.x = this.WORLD_WIDTH + 10;

            pipe.gapStartY = topHeight;
            pipe.gapEndY = gapCenter + (GAP_HEIGHT / 2);

            // Pipe bounding box
            pipe.pipeBoundingBox.topLeft.x = pipe.pos.x - (PIPE_WIDTH / 2);
            pipe.pipeBoundingBox.topLeft.y = -99999;
            pipe.pipeBoundingBox.botRight.x = pipe.pos.x + (PIPE_WIDTH / 2);
            pipe.pipeBoundingBox.botRight.y = this.WORLD_HEIGHT;

            // Show, set point and activate
            pipe.el.show();
            pipe.point = true;
            pipe.active = true;
        }
    };

    /**
     * Adds a point to the current score
     */
    Game.prototype.addPoint = function () {
        this.score++;
        this.scoreElem.text(this.score);
    };

    /**
     * Starts a new game.
     */
    Game.prototype.start = function () {
        this.reset();
        this.scoreElem.show();

        // Restart the onFrame loop
        this.lastFrame = +new Date() / 1000;
        window.requestAnimationFrame(this.onFrame);
        this.isPlaying = true;
    };

    /**
     * Resets the state of the game so a new game can be started.
     */
    Game.prototype.reset = function () {
        this.player.reset();

        for (let i = 0; i < this.pipes.length; i++) {
            this.pipes[i].active = false;
            this.pipes[i].el.hide();
        }

        this.score = 0;
        this.scoreElem.text(0);
    };

    /**
     * Signals that the game is over.
     */
    Game.prototype.gameover = function () {
        this.isPlaying = false;

        if (this.highscore < this.score) {
            this.highscore = this.score;
        }

        this.scoreElem.hide();
        this.scoreboard.show();
    };

    /**
     * Some shared constants.
     */
    Game.prototype.WORLD_WIDTH = 102.4;
    Game.prototype.WORLD_HEIGHT = 57.6;
    Game.prototype.PIPE_GROUND_SPEED = 0.35;
    Game.prototype.GROUND_HEIGHT = 3.5;

    return Game;
})();
