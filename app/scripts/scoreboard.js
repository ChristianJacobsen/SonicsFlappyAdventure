window.Scoreboard = (function () {
    "use strict";

    var Scoreboard = function (el, game) {
        this.el = el;
        this.highSpan = this.el.find(".highscore > span");
        this.currentSpan = this.el.find(".currentscore > span");
        this.game = game;
    };

    Scoreboard.prototype.show = function () {
        this.highSpan.text(this.game.highscore);
        this.currentSpan.text(this.game.score);

        let scoreboard = this;
        this.el.addClass("is-visible")
            .find("button")
            .one("click", function () {
                scoreboard.el.removeClass("is-visible");
                scoreboard.game.start();
            });
    };

    return Scoreboard;

})();
