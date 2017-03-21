window.Controls = (function () {
    "use strict";

    /**
     * Key codes we"re interested in.
     */
    var KEYS = {
        32: "space",
        37: "left",
        38: "up",
        39: "right",
        40: "down"
    };

    /**
     * A singleton class which abstracts all player input,
     * should hide complexity of dealing with keyboard, mouse
     * and touch devices.
     * @constructor
     */
    var Controls = function () {
        this.keys = {};
        $(window)
            .on("keydown", this._onKeyDown.bind(this))
            .on("keyup", this._onKeyUp.bind(this))
            .on("mousedown", this._onMouseDown.bind(this))
            .on("mouseup", this._onMouseUp.bind(this));
    };

    Controls.prototype._onKeyDown = function (e) {
        // Remember that this button is down.
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = true;
            return false;
        }
    };

    Controls.prototype._onKeyUp = function (e) {
        if (e.keyCode in KEYS) {
            var keyName = KEYS[e.keyCode];
            this.keys[keyName] = false;
            return false;
        }
    };

    Controls.prototype._onMouseDown = function (e) {
        // Remember that this button is down.
        if (e.button === 0) {
            this.keys.leftmouse = true;
            return false;
        }
    };

    Controls.prototype._onMouseUp = function (e) {
        if (e.button === 0) {
            this.keys.leftmouse = false;
            return false;
        }
    };

    // Export singleton.
    return new Controls();
})();
