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
        define(["require", "exports", "express", "inversify", "../controllers/collection/PostsController", "passport"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const express_1 = __importDefault(require("express"));
    const inversify_1 = require("inversify");
    const PostsController_1 = __importDefault(require("../controllers/collection/PostsController"));
    const passport_1 = __importDefault(require("passport"));
    let PostsRoutes = class PostsRoutes {
        postsController;
        router;
        get routers() {
            return this.router;
        }
        constructor(postsController) {
            this.postsController = postsController;
            this.router = express_1.default.Router();
            this.configureRoutes();
        }
        configureRoutes() {
            this.router.get('/collections/posts/*', (req, res) => {
                this.postsController.getPostsByPostsCollectionSlug(req, res);
            });
            this.router.post('/collections/posts', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.postsController.createPostsCollection(req, res);
            });
            this.router.post('/posts/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.postsController.createPost(req, res);
            });
            this.router.get('/posts/:slug', (req, res) => {
                this.postsController.getPost(req, res);
            });
            this.router.delete('/posts/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.postsController.deletePost(req, res);
            });
            this.router.put('/posts/:slug', passport_1.default.authenticate('jwt', {
                session: false
            }), (req, res) => {
                this.postsController.updatePost(req, res);
            });
        }
    };
    PostsRoutes = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(PostsController_1.default)),
        __metadata("design:paramtypes", [PostsController_1.default])
    ], PostsRoutes);
    exports.default = PostsRoutes;
});
