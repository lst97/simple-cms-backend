var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "bcrypt", "dotenv"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.verifyPassword = exports.hashPassword = void 0;
    const bcrypt_1 = __importDefault(require("bcrypt"));
    const dotenv_1 = __importDefault(require("dotenv"));
    dotenv_1.default.config();
    async function hashPassword(password) {
        const saltRounds = process.env.BCRYPT_SALT_ROUNDS;
        if (!saltRounds) {
            throw new Error('BCRYPT_SALT_ROUNDS is not set in .env file.');
        }
        const hash = await bcrypt_1.default.hash(password, parseInt(saltRounds, 10));
        return hash;
    }
    exports.hashPassword = hashPassword;
    async function verifyPassword(password, hash) {
        const match = await bcrypt_1.default.compare(password, hash);
        return match;
    }
    exports.verifyPassword = verifyPassword;
});
