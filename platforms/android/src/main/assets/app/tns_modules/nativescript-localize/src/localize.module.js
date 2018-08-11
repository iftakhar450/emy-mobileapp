"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var localize_pipe_1 = require("./localize.pipe");
var NativeScriptLocalizeModule = (function () {
    function NativeScriptLocalizeModule() {
    }
    NativeScriptLocalizeModule.decorators = [
        { type: core_1.NgModule, args: [{ declarations: [localize_pipe_1.LocalizePipe], exports: [localize_pipe_1.LocalizePipe] },] },
    ];
    return NativeScriptLocalizeModule;
}());
exports.NativeScriptLocalizeModule = NativeScriptLocalizeModule;
