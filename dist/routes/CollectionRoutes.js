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
        define(["require", "exports", "express", "inversify", "../controllers/collection/CollectionController", "passport", "../services/StorageManagerService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const inversify_1 = require("inversify");
    const CollectionController_1 = __importDefault(require("../controllers/collection/CollectionController"));
    const passport_1 = __importDefault(require("passport"));
    const StorageManagerService_1 = require("../services/StorageManagerService");
    let CollectionRoutes = class CollectionRoutes {
        collectionController;
        storageManagerService;
        router;
        get routers() {
            return this.router;
        }
        constructor(collectionController, storageManagerService) {
            this.collectionController = collectionController;
            this.storageManagerService = storageManagerService;
            this.router = express_1.default.Router();
            this.configureRoutes();
        }
        configureRoutes() {
            // For CMS frontend
            this.router.post('/collections', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.createCollection(req, res);
            });
            this.router.get('/collections', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.getCollections(req, res);
            });
            // can update settings or attributes or collection
            this.router.put('/collections/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.updateCollection(req, res);
            });
            this.router.post('/collections/:slug/attribute', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.addCollectionAttribute(req, res);
            });
            /**
             * Update one attribute of a collection.
             *
             * @param {string} id - The id of the attribute.
             * @param {string} slug - The slug of the collection.
             * @query {setting} boolean - Indicates to update the setting of the attribute.
             * @query {content} boolean - Indicates to update the attribute content.
             */
            this.router.put('/collections/:slug/attributes/:id', passport_1.default.authenticate('jwt', {
                session: false
            }), this.storageManagerService.upload.array('value', 32), (req, res) => {
                this.collectionController.updateCollectionAttribute(req, res);
            });
            // update collection attributes
            this.router.put('/collections/:slug/attributes', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.updateCollectionAttributes(req, res);
            });
            this.router.delete('/collections/:slug/attributes/:id', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.deleteCollectionAttribute(req, res);
            });
            this.router.delete('/collections/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.deleteCollection(req, res);
            });
            // Public accessible routes.
            this.router.get('/:username/collections/*', (req, res) => {
                this.collectionController.getCollectionsByPrefixAndUsername(req, res);
            });
            this.router.get('/collections/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.collectionController.getCollectionBySlug(req, res);
            });
        }
    };
    CollectionRoutes = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(CollectionController_1.default)),
        __param(1, (0, inversify_1.inject)(StorageManagerService_1.StorageManagerService)),
        __metadata("design:paramtypes", [Object, Object])
    ], CollectionRoutes);
    exports.default = CollectionRoutes;
});
