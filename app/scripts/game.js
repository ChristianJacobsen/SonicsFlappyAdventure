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
        this.el = el; // Game canvas
        this.player = new window.Player(this.el.find(".Player"), this); // Player
        this.isPlaying = false; // Playing flag
        this.score = 0; // Current score
        this.highscore = 0; // Highscore
        this.scoreElem = this.el.find(".Score > p"); // Current score element
        this.scoreboard = new window.Scoreboard(this.el.find(".Scoreboard"), this); // Scoreboard
        this.pipeFrameCount = 0; // Increment every frame
        this.nextPipe = 0; // Next pipe in array to select when spawning a pipe
        this.ground = new window.Ground(this.el.find(".Ground"), this); // Ground
        this.mute = false; // Mute flag
        this.speakerElem = this.el.find(".Speaker"); // Speaker button
        this.firstRun = true; // Flag indicating whether this is the first run or not

        // Audio
        // Background
        this.audioBackground = this.el.find(".BackgroundMusic")[0];
        // Crash
        this.audioCrash = this.el.find(".crashSound")[0];
        // Jump
        this.audioJump = this.el.find(".jumpSound")[0];
        // Button
        this.audioButton = this.el.find(".buttonSound")[0];
        // Ring
        this.audioRing = this.el.find(".ringSound")[0];

        // Click event on speaker button
        let game = this;
        this.speakerElem.on("click", function () {
            game.toggleSound(game);
        });

        // Create pipes
        this.pipes = [];
        for (let i = 0; i < PIPE_COUNT; i++) {
            this.pipes.push(new window.Pipe($(".Pipe" + (i + 1) + ""), this));
        }

        // Create clouds
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
        this.audioRing.play();
    };

    /**
     * Play the jump sound for the player
     */
    Game.prototype.jump = function () {
        this.audioJump.pause();
        this.audioJump.currentTime = 0;
        this.audioJump.play();
    };

    /**
     * Mute or unmute sound
     */
    Game.prototype.toggleSound = function (game) {
        if (game.mute) {
            game.speakerElem.removeClass("Mute");
            game.audioBackground.volume = 1.0;
            game.audioButton.volume = 1.0;
            game.audioCrash.volume = 1.0;
            game.audioJump.volume = 1.0;
            game.audioRing.volume = 1.0;
        } else {
            game.speakerElem.addClass("Mute");
            game.audioBackground.volume = 0.0;
            game.audioButton.volume = 0.0;
            game.audioCrash.volume = 0.0;
            game.audioJump.volume = 0.0;
            game.audioRing.volume = 0.0;
        }

        game.mute = !game.mute;
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

        // Play button sound if not the first time, since then the Restart button was pressed
        if (!this.firstRun) {
            this.audioButton.play();

            // Play background music
            let game = this;
            setTimeout(function () {
                game.audioBackground.loop = true;
                game.audioBackground.play();
            }, 250);
        } else {
            this.firstRun = false;
            this.audioBackground.loop = true;
            this.audioBackground.play();
        }
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
        this.isPlaying = false; // Set playing flag to false

        // Stop the background music
        this.audioBackground.pause();
        this.audioBackground.currentTime = 0;

        // Play the crash sound
        this.audioCrash.play();

        // Update highscore if applicable
        if (this.highscore < this.score) {
            this.highscore = this.score;
        }

        // Hide current score and show scoreboard
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
