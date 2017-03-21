/**
 * Bootstrap and start the game.
 */
$(function () {
    "use strict";

    var gameElem = $(".GameCanvas");
    var game = new window.Game(gameElem);

    /**
     * Resize the game canvas to fit the screen. Landscape.
     */
    function resizeCanvas() {
        var fontSize = Math.min(
            window.innerWidth / game.WORLD_WIDTH,
            window.innerHeight / game.WORLD_HEIGHT
        );

        gameElem[0].style.fontSize = fontSize + "px";
    }

    // Initial canvas resize
    resizeCanvas();

    // Resize canvas on window resize
    window.onresize = function () {
        resizeCanvas();
    };

    game.start();
});
