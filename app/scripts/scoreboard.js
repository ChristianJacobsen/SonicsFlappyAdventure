window.Scoreboard = (function () {
    "use strict";

    const WAIT = 500; // Milliseconds of how long the spacebar will not restart the game

    var Scoreboard = function (el, game) {
        this.el = el;
        this.highSpan = this.el.find(".highscore > span"); // Span for highscore value
        this.currentSpan = this.el.find(".currentscore > span"); // Span for current score balue
        this.game = game;
        this.visible = false;

        let scoreboard = this;
        this.el.find("button").on("click", function () {
            if (scoreboard.visible) {
                scoreboard.restart();
            }
        });

        document.body.onkeyup = function (e) {
            if (scoreboard.visible && e.keyCode === 32) {
                scoreboard.restart();
            }
        };
    };

    /**
     * Show the scoreboard
     */
    Scoreboard.prototype.show = function () {
        this.highSpan.text(this.game.highscore); // Set highscore
        this.currentSpan.text(this.game.score); // Set current score

        // Show scoreboard
        this.el.addClass("is-visible");

        // Wait a bit until enabling restarting
        let scoreboard = this;
        setTimeout(function () {
            scoreboard.visible = true;
        }, WAIT);
    };

    /**
     * Hides the scoreboard and restarts the game
     */
    Scoreboard.prototype.restart = function () {
        this.visible = false;
        this.el.removeClass("is-visible");
        this.game.start();
    };

    return Scoreboard;

})();
