var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@lst97/express-common-middlewares", "express", "inversify", "../schemas/AuthSchema", "../controllers/auth/AuthenticateController"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_common_middlewares_1 = require("@lst97/express-common-middlewares");
    const express_1 = __importDefault(require("express"));
    const inversify_1 = require("inversify");
    const AuthSchema_1 = require("../schemas/AuthSchema");
    const AuthenticateController_1 = __importDefault(require("../controllers/auth/AuthenticateController"));
    let AuthenticateRoutes = class AuthenticateRoutes {
        authController;
        requestValidationMiddleware;
        router;
        get routers() {
            return this.router;
        }
        constructor(authController, requestValidationMiddleware) {
            this.authController = authController;
            this.requestValidationMiddleware = requestValidationMiddleware;
            this.router = express_1.default.Router();
            this.configureRoutes();
        }
        configureRoutes() {
            this.router.post('/auth/login', this.requestValidationMiddleware.requestValidator(new express_common_middlewares_1.RequestBodyValidationStrategy(AuthSchema_1.AuthSchema.loginFormSchema)), (req, res) => this.authController.login(req, res));
            this.router.post('/auth/register', this.requestValidationMiddleware.requestValidator(new express_common_middlewares_1.RequestBodyValidationStrategy(AuthSchema_1.AuthSchema.registrationFormSchema)), (req, res) => this.authController.register(req, res));
        }
    };
    AuthenticateRoutes = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(AuthenticateController_1.default)),
        __param(1, (0, inversify_1.inject)(express_common_middlewares_1.RequestValidationMiddlewareService)),
        __metadata("design:paramtypes", [Object, Object])
    ], AuthenticateRoutes);
    exports.default = AuthenticateRoutes;
});
