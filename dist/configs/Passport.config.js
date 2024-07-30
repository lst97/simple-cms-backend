var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "passport", "passport-jwt", "../inversify.config", "../services/UserService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const passport_1 = __importDefault(require("passport"));
    const passport_jwt_1 = require("passport-jwt");
    const inversify_config_1 = __importDefault(require("../inversify.config"));
    const UserService_1 = __importDefault(require("../services/UserService"));
    class PassportConfig {
        static _instance;
        static _opts = {
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.ACCESS_TOKEN_SECRET
        };
        constructor() {
            this.setup();
        }
        get opts() {
            return PassportConfig._opts;
        }
        set opts(opts) {
            PassportConfig._opts = opts;
            this.setup();
        }
        static get instance() {
            if (!PassportConfig._instance) {
                PassportConfig._instance = new PassportConfig();
            }
            return PassportConfig._instance;
        }
        setup() {
            passport_1.default.use(new passport_jwt_1.Strategy(this.opts, async (jwt_payload, done) => {
                try {
                    const user = await inversify_config_1.default
                        .get(UserService_1.default)
                        .getUserByEmail(jwt_payload.email);
                    if (user) {
                        return done(null, user);
                    }
                    return done(new Error('Email not found'), false);
                }
                catch (error) {
                    return done(error, false);
                }
            }));
        }
        init() {
            return passport_1.default.initialize();
        }
    }
    exports.default = PassportConfig;
});
