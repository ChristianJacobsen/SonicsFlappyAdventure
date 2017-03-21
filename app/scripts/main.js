/**
 * Bootstrap and start the game.
 */
$(function () {
    "use strict";
    var gameElem = $(".GameCanvas");

    /**
     * Resize the game canvas to fit the screen. Landscape.
     */
    function resizeCanvas() {
        var fontSize = Math.min(
            window.innerWidth / 102.4,
            window.innerHeight / 57.6
        );

        gameElem[0].style.fontSize = fontSize + "px";
    }

    // Initial canvas resiz
    resizeCanvas();

    // Resize canvas on window resize
    window.onresize = function () {
        resizeCanvas();
    };

    var game = new window.Game(gameElem);
    game.start();
});
