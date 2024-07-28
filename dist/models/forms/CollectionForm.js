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
    exports.CollectionForm = void 0;
    class CollectionForm {
        kind;
        info;
        attributes;
        ref;
        constructor(kind) {
            this.kind = kind;
            this.info = { name: '', description: '', subdirectory: '' };
            this.attributes = [];
        }
        setCollectionInfo({ name, description, subdirectory }) {
            this.info = { name, description, subdirectory };
        }
        addAttribute(attribute) {
            this.attributes.push(attribute);
        }
    }
    exports.CollectionForm = CollectionForm;
});
