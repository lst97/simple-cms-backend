var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "joi"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthSchema = void 0;
    const joi_1 = __importDefault(require("joi"));
    class AuthSchema {
        static loginFormSchema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required().messages({
                'string.min': 'Invalid password'
            })
        });
        static registrationFormSchema = joi_1.default.object({
            username: joi_1.default.string().min(2).max(64).required(),
            email: joi_1.default.string().email().required(),
            password: joi_1.default.string().min(8).required(),
            image: joi_1.default.alternatives()
                .try(joi_1.default.string().base64(), joi_1.default.string().uri())
                .optional()
        });
        static urlParamSchema = joi_1.default.object({});
        // weekViewId=14-2024
        static urlQuerySchema = joi_1.default.object({});
    }
    exports.AuthSchema = AuthSchema;
});
