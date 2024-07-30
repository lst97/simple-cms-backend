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
        define(["require", "exports", "inversify"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.UserController = void 0;
    const inversify_1 = require("inversify");
    let UserController = class UserController {
        constructor() { }
        async getUserInformation(req, res) {
            try {
                res.status(200).json({ message: 'User information' });
            }
            catch (error) {
                res.status(500).json({ message: 'Internal server error' });
            }
        }
    };
    exports.UserController = UserController;
    exports.UserController = UserController = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], UserController);
    exports.default = UserController;
});
