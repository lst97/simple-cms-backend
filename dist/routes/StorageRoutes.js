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
        define(["require", "exports", "express", "inversify", "../controllers/storage/StorageController"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const inversify_1 = require("inversify");
    const StorageController_1 = __importDefault(require("../controllers/storage/StorageController"));
    let StorageRoutes = class StorageRoutes {
        storageController;
        router;
        get routers() {
            return this.router;
        }
        constructor(storageController) {
            this.storageController = storageController;
            this.router = express_1.default.Router();
            this.configureRoutes();
        }
        configureRoutes() {
            this.router.get('/storage/:username/:fileId', (req, res) => {
                this.storageController.getFile(req, res);
            });
        }
    };
    StorageRoutes = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(StorageController_1.default)),
        __metadata("design:paramtypes", [Object])
    ], StorageRoutes);
    exports.default = StorageRoutes;
});
