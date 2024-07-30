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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "inversify", "@lst97/common_response", "../repositories/user/UserRepository"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const common_response_1 = require("@lst97/common_response");
    const UserRepository_1 = require("../repositories/user/UserRepository");
    let UserService = class UserService {
        userRepository;
        errorHandlerService;
        constructor(userRepository, errorHandlerService) {
            this.userRepository = userRepository;
            this.errorHandlerService = errorHandlerService;
        }
        async getUserByEmail(email) {
            return await this.userRepository.findUserByEmail(email);
        }
    };
    UserService = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(UserRepository_1.UserRepository)),
        __param(1, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __metadata("design:paramtypes", [Object, Object])
    ], UserService);
    exports.default = UserService;
});
