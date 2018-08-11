"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var localize_1 = require("./localize");
var LocalizePipe = (function () {
    function LocalizePipe() {
    }
    LocalizePipe.prototype.transform = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return localize_1.localize.apply(void 0, [key].concat(args));
    };
    LocalizePipe.decorators = [
        { type: core_1.Pipe, args: [{ name: "L" },] },
    ];
    return LocalizePipe;
}());
exports.LocalizePipe = LocalizePipe;
