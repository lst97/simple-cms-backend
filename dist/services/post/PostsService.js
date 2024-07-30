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
        define(["require", "exports", "inversify", "../../errors/Errors", "../../models/share/collection/Collection", "../../repositories/collection/CollectionRepository", "../../models/share/collection/CollectionAttributes", "../../repositories/post/PostsRepository", "../endpoint/EndpointService", "@lst97/common-errors", "../../models/share/collection/AttributeContents"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostsService = void 0;
    const inversify_1 = require("inversify");
    const Errors_1 = require("../../errors/Errors");
    const Collection_1 = require("../../models/share/collection/Collection");
    const CollectionRepository_1 = __importDefault(require("../../repositories/collection/CollectionRepository"));
    const CollectionAttributes_1 = require("../../models/share/collection/CollectionAttributes");
    const PostsRepository_1 = __importDefault(require("../../repositories/post/PostsRepository"));
    const EndpointService_1 = __importDefault(require("../endpoint/EndpointService"));
    const common_errors_1 = require("@lst97/common-errors");
    const AttributeContents_1 = require("../../models/share/collection/AttributeContents");
    let PostsService = class PostsService {
        collectionRepository;
        postsRepository;
        endpointService;
        constructor(collectionRepository, postsRepository, endpointService) {
            this.collectionRepository = collectionRepository;
            this.postsRepository = postsRepository;
            this.endpointService = endpointService;
        }
        async createPost(username, form, slug // posts collection slug
        ) {
            if (slug) {
                const postsCollection = await this.postsRepository.findPostsCollection(slug);
                if (!postsCollection) {
                    throw new Errors_1.DocumentReadError({
                        message: 'Posts collection not found',
                        query: { slug }
                    });
                }
                form.ref = slug;
            }
            // validate if frontend provide valid attributes for post
            // should have Title, Content, optional: Comment, Reaction
            const postAttributes = form.attributes;
            const title = postAttributes.find((attribute) => attribute.setting.type === 'text' &&
                attribute.setting.name === 'Title');
            const content = postAttributes.find((attribute) => attribute.setting.type === 'text' &&
                attribute.setting.name === 'Content');
            if (!title || !content) {
                throw new common_errors_1.ValidationError({
                    message: 'Post should have title and content'
                });
            }
            // TODO: check comment and reaction
            // Step 1: Create collection
            // Step 2: Update Posts collection with new post slug
            const newPost = await this.collectionRepository.create(new Collection_1.PostCollection(username, form));
            if (newPost) {
                if (slug) {
                    const newPostsCollectionAttribute = new CollectionAttributes_1.CollectionAttribute(newPost.setting, new AttributeContents_1.BaseContent(newPost.slug));
                    await this.postsRepository.insertPost(slug, newPostsCollectionAttribute);
                    await this.endpointService.createEndpoint(username, 'posts/' + form.info.subdirectory, newPost.slug);
                }
                return newPost;
            }
            else {
                throw new Errors_1.DocumentCreationError({
                    message: 'Can not create post',
                    query: { slug: form.ref }
                });
            }
        }
        async createPostsCollection(username, form, slug) {
            const postsCollection = new Collection_1.Collection(username, form);
            postsCollection.slug = slug ?? postsCollection.slug;
            postsCollection.attributes = [];
            const newPostsCollection = await this.postsRepository.createPostsCollection(postsCollection);
            if (!newPostsCollection) {
                throw new Errors_1.DocumentReadError({
                    message: 'Posts collection not found',
                    query: { slug: form.ref }
                });
            }
            await this.endpointService.createEndpoint(username, 'collections/posts/' + form.info.subdirectory, newPostsCollection.slug);
            return newPostsCollection;
        }
        async findPostsCollections(username) {
            const collections = await this.postsRepository.findPostsCollectionsByUsername(username);
            if (!collections) {
                throw new Errors_1.DocumentReadError({
                    message: 'Collections not found',
                    query: { username }
                });
            }
            return collections;
        }
        async findPost(slug) {
            const post = await this.collectionRepository.findBySlug(slug);
            if (!post) {
                throw new Errors_1.DocumentReadError({
                    message: 'Post not found',
                    query: { slug }
                });
            }
            return post;
        }
        async findPosts(slug) {
            const collection = await this.postsRepository.findPostsCollection(slug);
            const postSlugs = [];
            const posts = [];
            if (!collection) {
                throw new Errors_1.DocumentReadError({
                    message: 'Collection not found',
                    query: { slug }
                });
            }
            if (collection.attributes.length > 0) {
                for (const attribute of collection.attributes) {
                    if (attribute.setting.type === 'post') {
                        postSlugs.push(attribute.content.value);
                    }
                }
                posts.push(...(await this.collectionRepository.findBySlugs(postSlugs)));
            }
            return posts;
        }
        async deletePost(slug) {
            const post = await this.collectionRepository.findBySlug(slug);
            if (!post) {
                throw new Errors_1.DocumentReadError({
                    message: 'Post not found',
                    query: { slug }
                });
            }
            // TODO: transaction
            // 1. delete endpoint
            if (!(await this.endpointService.deleteEndpointBySlug(post.slug))) {
                throw new Errors_1.DocumentDeletionError({
                    message: 'Can not delete post',
                    query: { slug }
                });
            }
            // 2. delete attribute from PostsCollection if exist (check ref)
            if (post.ref) {
                await this.postsRepository.deletePostsCollectionAttributeBySlug(post.ref, post.slug);
            }
            // 3. delete the actual post
            const deletedPost = await this.collectionRepository.delete(post._id);
            if (!deletedPost) {
                throw new Errors_1.DocumentDeletionError({
                    message: 'Can not delete post',
                    query: { slug }
                });
            }
            return deletedPost;
        }
        async updatePost(slug, form) {
            const originPost = await this.collectionRepository.findBySlug(slug);
            if (!originPost) {
                throw new Errors_1.DocumentReadError({
                    message: 'Post not found',
                    query: { slug }
                });
            }
            // assign form value to origin post
            originPost.collectionName = form.info.name;
            return originPost;
        }
    };
    exports.PostsService = PostsService;
    exports.PostsService = PostsService = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(CollectionRepository_1.default)),
        __param(1, (0, inversify_1.inject)(PostsRepository_1.default)),
        __param(2, (0, inversify_1.inject)(EndpointService_1.default)),
        __metadata("design:paramtypes", [CollectionRepository_1.default,
            PostsRepository_1.default, Object])
    ], PostsService);
});
