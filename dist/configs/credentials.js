var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "./config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs_1 = __importDefault(require("fs"));
    const config_1 = __importDefault(require("./config"));
    class Credentials {
        tls = {
            key: fs_1.default.readFileSync(config_1.default.certificates.privateKey, 'utf8'),
            cert: fs_1.default.readFileSync(config_1.default.certificates.certificate, 'utf8'),
            ca: fs_1.default.readFileSync(config_1.default.certificates.ca, 'utf8')
        };
    }
    exports.default = Credentials;
});
