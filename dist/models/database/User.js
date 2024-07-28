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
        define(["require", "exports", "@typegoose/typegoose", "uuid"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserModel = exports.User = exports.AuthUserDbModel = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const uuid_1 = require("uuid");
    // SQLite Model (AuthUser)
    class AuthUserDbModel {
        id;
        email;
        passwordHash;
        constructor({ id, email, passwordHash }) {
            this.id = id ?? (0, uuid_1.v4)();
            this.email = email;
            this.passwordHash = passwordHash;
        }
    }
    exports.AuthUserDbModel = AuthUserDbModel;
    // MongoDB Model (User)
    class User {
        username;
        email;
        image;
        createdAt;
        updatedAt;
        constructor({ username, email, image }) {
            this.username = username;
            this.email = email;
            this.image = image;
        }
    }
    exports.User = User;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "email", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], User.prototype, "image", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: Date.now }),
        __metadata("design:type", Date)
    ], User.prototype, "createdAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: Date.now }),
        __metadata("design:type", Date)
    ], User.prototype, "updatedAt", void 0);
    exports.UserModel = (0, typegoose_1.getModelForClass)(User);
});
