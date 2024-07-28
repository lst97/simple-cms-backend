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
        define(["require", "exports", "inversify", "../../services/auth/AuthenticateService", "@lst97/common_response"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const AuthenticateService_1 = __importDefault(require("../../services/auth/AuthenticateService"));
    const common_response_1 = require("@lst97/common_response");
    let AuthenticateController = class AuthenticateController {
        authenticateService;
        responseService;
        constructor(authenticateService, responseService) {
            this.authenticateService = authenticateService;
            this.responseService = responseService;
        }
        async login(req, res) {
            const loginForm = req.body;
            try {
                const accessToken = await this.authenticateService.login(loginForm, req);
                const commonResponse = this.responseService.buildSuccessResponse(accessToken, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                const commonResponse = this.responseService.buildErrorResponse(error, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async register(req, res) {
            const registrationForm = req.body;
            try {
                const userDbModel = await this.authenticateService.register(registrationForm, req);
                const commonResponse = this.responseService.buildSuccessResponse(userDbModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                const commonResponse = this.responseService.buildErrorResponse(error, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
    };
    AuthenticateController = __decorate([
        (0, inversify_1.injectable)(),
        __param(1, (0, inversify_1.inject)(common_response_1.ResponseService)),
        __metadata("design:paramtypes", [AuthenticateService_1.default, Object])
    ], AuthenticateController);
    exports.default = AuthenticateController;
});
