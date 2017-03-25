window.Scoreboard = (function () {
    "use strict";

    const SPACEBAR_WAIT = 500; // Milliseconds of how long the spacebar will not restart the game

    var Scoreboard = function (el, game) {
        this.el = el;
        this.highSpan = this.el.find(".highscore > span"); // Span for highscore value
        this.currentSpan = this.el.find(".currentscore > span"); // Span for current score balue
        this.game = game;
    };

    /**
     * Show the scoreboard
     */
    Scoreboard.prototype.show = function () {
        this.highSpan.text(this.game.highscore); // Set highscore
        this.currentSpan.text(this.game.score); // Set current score

        // Show scoreboard and add click event
        let scoreboard = this;
        this.el.addClass("is-visible")
            .find("button")
            .one("click", function () {
                scoreboard.restart();
            });

        // Wait a bit until enabling spacebar for restarting
        setTimeout(function () {
            document.body.onkeyup = function (e) {
                if (e.keyCode === 32) {
                    scoreboard.restart();
                }
            };
        }, SPACEBAR_WAIT);
    };

    /**
     * Hides the scoreboard and restarts the game
     */
    Scoreboard.prototype.restart = function () {
        document.body.onkeyup = null;
        this.el.removeClass("is-visible");
        this.game.start();
    };

    return Scoreboard;

})();
