(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateCollectionName = void 0;
    const validateCollectionName = (value) => {
        return /^[a-zA-Z0-9\s]+$/.test(value);
    };
    exports.validateCollectionName = validateCollectionName;
});
