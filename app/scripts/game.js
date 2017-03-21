window.Game = (function () {
    "use strict";

    var PIPE_TIME = 3;
    var GAP_HEIGHT = 15;

    /**
     * Main game class.
     * @param {Element} el jQuery element containing the game.
     * @constructor
     */
    var Game = function (el) {
        this.el = el;
        this.player = new window.Player(this.el.find(".Player"), this);
        this.isPlaying = false;
        this.pipe_timer = 0;
        this.pipes = [];

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
        this.pipe_timer += delta;
        this.pipe();

        // Update game entities.
        this.player.onFrame(delta);

        // Update pipes
        this.pipes.filter(pipe => {
            pipe.onFrame();
        });

        // Request next frame.
        window.requestAnimationFrame(this.onFrame);
    };

    /**
     * Checks if a pipe should be spawned and spawns if so.
     */
    Game.prototype.pipe = function () {
        if (PIPE_TIME < this.pipe_timer) {
            // Reset timer
            this.pipe_timer = 0;

            // Create elements
            let pipeElem = $("<div class=\"Pipe\"></div>");
            let topElem = $("<div class=\"Top\"></div>");
            let gapElem = $("<div class=\"Gap\"></div>");
            let botElem = $("<div class=\"Bot\"></div>");

            // Append inner elements to the pipe element
            pipeElem.append(topElem);
            pipeElem.append(gapElem);
            pipeElem.append(botElem);

            // Randomize the height of each segment of pipe
            let gapCenter = Math.random() * (this.WORLD_HEIGHT - (GAP_HEIGHT * 2)) + (GAP_HEIGHT * 2);
            let topHeight = gapCenter - GAP_HEIGHT;
            let botHeight = this.WORLD_HEIGHT - gapCenter + GAP_HEIGHT;

            topElem.css("height", topHeight + "em");
            gapElem.css("height", GAP_HEIGHT + "em");
            botElem.css("height", botHeight + "em");

            // Create the pipe object
            let pipe = new window.Pipe(pipeElem, this);

            // Append the pipe element to the game canvas
            this.el.append(pipeElem);

            // Push the pipe object into the pipes array
            this.pipes.push(pipe);
        }
    };

    /**
     * Starts a new game.
     */
    Game.prototype.start = function () {
        this.reset();

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

        $(".Pipe").remove();
        this.pipes = [];
    };

    /**
     * Signals that the game is over.
     */
    Game.prototype.gameover = function () {
        this.isPlaying = false;

        // Should be refactored into a Scoreboard class.
        var that = this;
        var scoreboardEl = this.el.find(".Scoreboard");
        scoreboardEl
            .addClass("is-visible")
            .find(".Scoreboard-restart")
            .one("click", function () {
                scoreboardEl.removeClass("is-visible");
                that.start();
            });
    };

    /**
     * Some shared constants.
     */
    Game.prototype.WORLD_WIDTH = 102.4;
    Game.prototype.WORLD_HEIGHT = 57.6;

    return Game;
})();
