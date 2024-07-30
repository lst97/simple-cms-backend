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
        define(["require", "exports", "../../utils/HashHelper", "jsonwebtoken", "@lst97/common_response", "@lst97/common-errors", "inversify", "../../repositories/auth/AuthUserRepository", "../../repositories/user/UserRepository", "../../models/database/User", "uuid"], factory);
    }
})(function (require, exports) {
    "use strict";
    var AuthenticateService_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const HashHelper_1 = require("../../utils/HashHelper");
    const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
    const common_response_1 = require("@lst97/common_response");
    const common_errors_1 = require("@lst97/common-errors");
    const inversify_1 = require("inversify");
    const AuthUserRepository_1 = require("../../repositories/auth/AuthUserRepository");
    const UserRepository_1 = require("../../repositories/user/UserRepository");
    const User_1 = require("../../models/database/User");
    const uuid_1 = require("uuid");
    let AuthenticateService = AuthenticateService_1 = class AuthenticateService {
        authUserRepository;
        userRepository;
        errorHandlerService;
        constructor(authUserRepository, userRepository, errorHandlerService) {
            this.authUserRepository = authUserRepository;
            this.userRepository = userRepository;
            this.errorHandlerService = errorHandlerService;
        }
        async login(form, req) {
            const authUserDbModel = await this.authUserRepository.findUserByEmail(form.email);
            if (!authUserDbModel) {
                const autError = new common_errors_1.AuthInvalidEmailError({ request: req });
                this.errorHandlerService.handleError({
                    error: autError,
                    service: AuthenticateService_1.name
                });
                throw autError;
            }
            if (!(await (0, HashHelper_1.verifyPassword)(form.password, authUserDbModel.passwordHash))) {
                const authError = new common_errors_1.AuthInvalidPasswordError({
                    request: req
                });
                this.errorHandlerService.handleError({
                    error: authError,
                    service: AuthenticateService_1.name
                });
                throw authError;
            }
            const userDbModel = await this.userRepository.findUserByEmail(form.email);
            if (!userDbModel) {
                const profileNotFoundError = new common_errors_1.ServerError({
                    message: 'User profile not found'
                });
                this.errorHandlerService.handleError({
                    error: profileNotFoundError,
                    service: AuthenticateService_1.name
                });
                throw profileNotFoundError;
            }
            const role = 'NOT_IMPLEMENTED';
            const permission = 'NOT_IMPLEMENTED';
            const secret = process.env.ACCESS_TOKEN_SECRET;
            const accessToken = jsonwebtoken_1.default.sign({
                id: authUserDbModel.id,
                username: userDbModel.username,
                email: userDbModel.email,
                role,
                permission
            }, secret, {
                expiresIn: '28d'
            });
            return accessToken;
        }
        async register(form, req) {
            if (await this.authUserRepository.findUserByEmail(form.email)) {
                const autError = new common_errors_1.AuthRegistrationFailWithDuplicatedEmailError({
                    request: req
                });
                this.errorHandlerService.handleError({
                    error: autError,
                    service: AuthenticateService_1.name
                });
                throw autError;
            }
            await this.authUserRepository.createUser((0, uuid_1.v4)(), form.email, await (0, HashHelper_1.hashPassword)(form.password));
            return await this.userRepository.create(new User_1.User({
                username: form.username,
                email: form.email,
                image: form.image ?? 'TEST_IMAGE'
            }));
        }
    };
    AuthenticateService = AuthenticateService_1 = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(AuthUserRepository_1.AuthUserRepository)),
        __param(1, (0, inversify_1.inject)(UserRepository_1.UserRepository)),
        __param(2, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], AuthenticateService);
    exports.default = AuthenticateService;
});
