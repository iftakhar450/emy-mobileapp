"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sprintf_js_1 = require("sprintf-js");
var utils = require("utils/utils");
var resource_1 = require("./resource");
var getResources = (function () {
    var resources = null;
    return function () {
        if (resources === null) {
            resources = utils.ad.getApplicationContext().getResources();
        }
        return resources;
    };
})();
function localize(key) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        args[_i - 1] = arguments[_i];
    }
    var localizedString;
    try {
        var identifier = utils.ad.resources.getStringId(resource_1.encodeKey(key));
        localizedString = identifier === 0 ? key : getResources().getString(identifier);
    }
    catch (error) {
        localizedString = key;
    }
    return sprintf_js_1.vsprintf(localizedString, args);
}
exports.localize = localize;
