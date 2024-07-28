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
        define(["require", "exports", "inversify", "../../errors/Errors", "../../models/share/collection/Collection"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Errors_1 = require("../../errors/Errors");
    const Collection_1 = require("../../models/share/collection/Collection");
    // posts is a collection
    let PostsRepository = class PostsRepository {
        constructor() { }
        async insertPost(postsCollectionSlug, postAttribute) {
            try {
                const collection = Collection_1.PostsCollectionModel.findOneAndUpdate({ slug: postsCollectionSlug }, { $push: { attributes: postAttribute } }, { new: true });
                return collection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error;
                }
            }
        }
        async findPostsCollection(slug) {
            try {
                const collection = Collection_1.PostsCollectionModel.findOne({
                    slug: slug
                });
                return collection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentReadError({
                        message: error.message,
                        query: { slug }
                    });
                }
                else {
                    throw error;
                }
            }
        }
        async createPostsCollection(postsCollection) {
            try {
                const collection = Collection_1.PostsCollectionModel.create(postsCollection);
                return collection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error;
                }
            }
        }
        async findPostsCollectionsByUsername(username) {
            try {
                const collections = Collection_1.PostsCollectionModel.find({
                    username
                });
                return collections;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentReadError({
                        message: error.message,
                        query: { username }
                    });
                }
                else {
                    throw error;
                }
            }
        }
        async deletePostsCollectionAttributeBySlug(postsCollectionSlug, postSlug) {
            try {
                const collection = Collection_1.PostsCollectionModel.findOneAndUpdate({ slug: postsCollectionSlug }, {
                    $pull: {
                        attributes: { 'content.value': postSlug }
                    }
                }, { new: true });
                return collection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error;
                }
            }
        }
    };
    PostsRepository = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], PostsRepository);
    exports.default = PostsRepository;
});
