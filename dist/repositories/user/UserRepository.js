var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "inversify", "../../errors/Errors", "../../models/database/User"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserRepository = void 0;
    const inversify_1 = require("inversify");
    const Errors_1 = require("../../errors/Errors");
    const User_1 = require("../../models/database/User");
    let UserRepository = class UserRepository {
        constructor() { }
        async create(user) {
            try {
                return await new User_1.UserModel(user).save();
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                else
                    throw error;
            }
        }
        async findUserByEmail(email) {
            try {
                return await User_1.UserModel.findOne({ email });
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Errors_1.DocumentReadError({
                        message: error.message,
                        cause: error
                    });
                else
                    throw error;
            }
        }
    };
    exports.UserRepository = UserRepository;
    exports.UserRepository = UserRepository = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], UserRepository);
});
