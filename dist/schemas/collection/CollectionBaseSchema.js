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
    exports.SupportedAttributes = void 0;
    class SupportedAttributes {
        static text = 'text';
        static code = 'code';
        static media = 'media';
        static post = 'post';
        static document = 'document';
        static date = 'date';
        static decimal = 'decimal';
        static number = 'number';
        static boolean = 'boolean';
        static dynamic = 'dynamic';
    }
    exports.SupportedAttributes = SupportedAttributes;
});
