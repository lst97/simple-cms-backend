var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "short-unique-id"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GeneratorsUtil = void 0;
    const short_unique_id_1 = __importDefault(require("short-unique-id"));
    class GeneratorsUtil {
        static generateUrlSlug(prefix) {
            // Trim whitespace and replace spaces with hyphens
            const sanitizedPrefix = prefix.trim().replace(/\s+/g, '-');
            // Allow only alphanumeric characters
            const filteredPrefix = sanitizedPrefix.replace(/[^a-zA-Z0-9-]/g, '');
            const uid = new short_unique_id_1.default({
                dictionary: 'alpha_lower',
                length: 8
            });
            return `${filteredPrefix.toLowerCase()}_${uid.rnd()}`;
        }
    }
    exports.GeneratorsUtil = GeneratorsUtil;
});
