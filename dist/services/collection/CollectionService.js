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
        define(["require", "exports", "inversify", "../../models/share/collection/Collection", "../../repositories/collection/CollectionRepository", "../endpoint/EndpointService", "../../models/share/collection/CollectionAttributes", "@lst97/common-errors", "@lst97/common_response", "../../models/share/collection/AttributeContents", "mongodb", "../StorageManagerService", "../post/PostsService", "../../errors/Errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    var CollectionService_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Collection_1 = require("../../models/share/collection/Collection");
    const CollectionRepository_1 = __importDefault(require("../../repositories/collection/CollectionRepository"));
    const EndpointService_1 = __importDefault(require("../endpoint/EndpointService"));
    const CollectionAttributes_1 = require("../../models/share/collection/CollectionAttributes");
    const common_errors_1 = require("@lst97/common-errors");
    const common_response_1 = require("@lst97/common_response");
    const AttributeContents_1 = require("../../models/share/collection/AttributeContents");
    const mongodb_1 = require("mongodb");
    const StorageManagerService_1 = require("../StorageManagerService");
    const PostsService_1 = require("../post/PostsService");
    const Errors_1 = require("../../errors/Errors");
    let CollectionService = CollectionService_1 = class CollectionService {
        collectionRepository;
        endpointService;
        errorHandlerService;
        storageManagerService;
        postsService;
        constructor(collectionRepository, endpointService, errorHandlerService, storageManagerService, postsService) {
            this.collectionRepository = collectionRepository;
            this.endpointService = endpointService;
            this.errorHandlerService = errorHandlerService;
            this.storageManagerService = storageManagerService;
            this.postsService = postsService;
        }
        /**
         * Validates the access to a collection.
         *
         * @param collection - The collection to validate access for.
         * @param username - The username of the user requesting access.
         * @throws {ServerResourceNotFoundError} If the collection is not found.
         * @throws {AuthInvalidCredentialsError} If the user is not allowed to update the collection.
         */
        validateCollectionAccess(collection, username) {
            if (collection === null || collection._id === undefined) {
                const resourceNotFoundError = new common_errors_1.ServerResourceNotFoundError('Collection not found');
                this.errorHandlerService.handleError({
                    error: resourceNotFoundError,
                    service: CollectionService_1.name
                });
                throw resourceNotFoundError;
            }
            if (collection.username !== username) {
                const invalidCredentialError = new common_errors_1.AuthInvalidCredentialsError({
                    message: 'You are not allowed to update this collection'
                });
                this.errorHandlerService.handleError({
                    error: invalidCredentialError,
                    service: CollectionService_1.name
                });
                throw invalidCredentialError;
            }
        }
        async create(form, username) {
            // TODO: implement transaction
            if (form.kind === 'collection') {
                const newCollection = await this.collectionRepository.create(new Collection_1.Collection(username, form));
                let prefix = '';
                // if it create posts collection
                if (newCollection.attributes[0].setting
                    .type === 'posts') {
                    prefix = 'posts/';
                }
                // create a empty posts collection with the same slug as new collection
                await this.postsService.createPostsCollection(username, form, newCollection.slug);
                const newEndpoint = await this.endpointService.createEndpoint(username, prefix + form.info.subdirectory, newCollection.slug);
                if (!newEndpoint) {
                    const endpointCreationError = new Errors_1.DocumentCreationError({
                        message: 'Endpoint creation failed'
                    });
                    this.errorHandlerService.handleError({
                        error: endpointCreationError,
                        service: CollectionService_1.name
                    });
                    throw endpointCreationError;
                }
                return newCollection;
            }
            else {
                // post, posts collection must be created.
                if (!form.ref) {
                    const collectionCreationError = new Errors_1.DocumentCreationError({
                        message: 'Posts collection not found'
                    });
                    this.errorHandlerService.handleError({
                        error: collectionCreationError,
                        service: CollectionService_1.name
                    });
                    throw collectionCreationError;
                }
                const postsCollection = await this.collectionRepository.findBySlug(form.ref);
                if (!postsCollection) {
                    const collectionCreationError = new Errors_1.DocumentCreationError({
                        message: 'Posts collection not found'
                    });
                    this.errorHandlerService.handleError({
                        error: collectionCreationError,
                        service: CollectionService_1.name
                    });
                    throw collectionCreationError;
                }
                const newPost = await this.postsService.createPost(username, form);
                if (!newPost) {
                    const collectionCreationError = new Errors_1.DocumentCreationError({
                        message: 'Collection creation failed'
                    });
                    this.errorHandlerService.handleError({
                        error: collectionCreationError,
                        service: CollectionService_1.name
                    });
                    throw collectionCreationError;
                }
                return newPost;
            }
        }
        async deleteBySlug(username, slug) {
            const collection = await this.collectionRepository.findBySlug(slug);
            if (collection === null) {
                const resourceNotFoundError = new common_errors_1.ServerResourceNotFoundError('Collection not found');
                this.errorHandlerService.handleError({
                    error: resourceNotFoundError,
                    service: CollectionService_1.name
                });
                throw resourceNotFoundError;
            }
            if (collection.username !== username) {
                const invalidCredentialError = new common_errors_1.AuthInvalidCredentialsError({
                    message: 'You are not allowed to delete this collection'
                });
                this.errorHandlerService.handleError({
                    error: invalidCredentialError,
                    service: CollectionService_1.name
                });
                throw invalidCredentialError;
            }
            // TODO: implement transaction
            const isDeleted = await this.collectionRepository.delete(collection._id);
            if (isDeleted) {
                await this.endpointService.deleteEndpointBySlug(slug);
            }
            return isDeleted;
        }
        async addAttribute(username, slug, setting, content) {
            // original collection
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            const updatedCollection = await this.collectionRepository.addAttribute(collection._id, new CollectionAttributes_1.CollectionAttribute(setting, content));
            return updatedCollection;
        }
        async updateAttribute(username, slug, attributeId, { updateAttributeContent, updateAttributeSetting }, parallelUploadMetaData) {
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            let updatedAttribute;
            if (collection?.kind === 'collection') {
                updatedAttribute = collection.attributes.find((attribute) => attribute._id.toHexString() === attributeId);
                if (updatedAttribute === undefined) {
                    const resourceNotFoundError = new common_errors_1.ServerResourceNotFoundError('Attribute not found');
                    this.errorHandlerService.handleError({
                        error: resourceNotFoundError,
                        service: CollectionService_1.name
                    });
                    throw resourceNotFoundError;
                }
                updatedAttribute.setting =
                    updateAttributeSetting ?? updatedAttribute.setting;
                if (parallelUploadMetaData) {
                    const { sessionId, total, nameMap, groupId, type } = parallelUploadMetaData;
                    let [key, value] = nameMap.entries().next().value;
                    await this.storageManagerService.received(sessionId, key, value);
                    const namesMap = this.storageManagerService.getMappedFileNames(sessionId);
                    if (namesMap.size === total) {
                        if (!updatedAttribute.content.sessionId) {
                            updatedAttribute.content =
                                new AttributeContents_1.ParallelFilesUploadContent(sessionId, total);
                        }
                        // all files uploaded to storage/temp/sessionId
                        // move files to storage/username/type/groupId
                        this.storageManagerService.movePendingFilesToStorage(username, sessionId, type, groupId);
                        for (const [key, value] of namesMap) {
                            const mediaContent = new AttributeContents_1.MediaContent({
                                url: `storage/${username}/${value.split('.')[0]}`,
                                file: '', // base64, not used for efficiency
                                fileName: key
                            });
                            updatedAttribute.content.value.push(mediaContent);
                        }
                    }
                }
                else {
                    updatedAttribute.content =
                        updateAttributeContent ?? updatedAttribute.content;
                }
                const updatedCollection = await this.collectionRepository.updateAttributeById(collection._id, updatedAttribute);
                return updatedCollection;
            }
            // todo: support post
            return null;
        }
        async findBySlug(slug) {
            const collection = await this.collectionRepository.findBySlug(slug);
            return collection;
        }
        async findById(id) {
            const collection = await this.collectionRepository.findById(id);
            return collection;
        }
        async findByUsername(username) {
            return await this.collectionRepository.findByUsername(username);
        }
        async findCollectionsBySlugs(slugs, visibility = 'public', isAttributeIncluded = false) {
            if (isAttributeIncluded) {
                return await this.collectionRepository.findBySlugs(slugs);
            }
            else {
                return await this.collectionRepository.findInfoBySlugs(slugs);
            }
        }
        async findByPrefixAndUsername(username, prefix, visibility = 'public', isAttributeIncluded = false) {
            const slugs = await this.endpointService.findSlugsByPrefixAndUsername(username, prefix);
            // todo: update the lib to add this error
            if (slugs === null || slugs.length === 0) {
                throw new common_errors_1.ServerResourceNotFoundError('No collection found');
            }
            return await this.findCollectionsBySlugs(slugs, visibility, isAttributeIncluded);
        }
        async updateCollectionAttributes(username, slug, attributes) {
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            for (const attribute of attributes) {
                // todo: add partial error
                attributes = collection?.attributes.filter((attr) => attr._id !== attribute._id);
            }
            const updatedCollection = await this.collectionRepository.updateAttributesContent(collection._id, attributes);
            return updatedCollection;
        }
        async updateBySlug(username, slug, { updateAttributesContent, updateAttributesSetting, updateCollectionInfo }) {
            // original collection
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            // update collection info
            let updatedCollection = collection;
            if (updateCollectionInfo) {
                updatedCollection = {
                    ...updatedCollection,
                    ...updateCollectionInfo,
                    updatedAt: new Date()
                };
            }
            if (collection?.kind === 'collection') {
                if (updateAttributesContent) {
                    for (const content of updateAttributesContent) {
                        const attribute = updatedCollection.attributes.find((attribute) => attribute.content._id === content._id);
                        if (attribute) {
                            attribute.content = content;
                        }
                    }
                }
                if (updateAttributesSetting) {
                    for (const setting of updateAttributesSetting) {
                        const attribute = updatedCollection.attributes.find((attribute) => attribute.setting._id ===
                            setting._id);
                        if (attribute) {
                            // TODO: support change to other type
                            switch (attribute.setting.type) {
                                case 'text':
                                    attribute.setting =
                                        setting;
                                    break;
                                case 'code':
                                    attribute.setting =
                                        setting;
                            }
                        }
                    }
                }
            }
            return await this.collectionRepository.update(collection._id, updatedCollection);
        }
        async deleteAttribute(username, slug, attributeId) {
            // original collection
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            const updatedCollection = await this.collectionRepository.deleteAttribute(collection._id, new mongodb_1.ObjectId(attributeId));
            return updatedCollection;
        }
        async update(id, updateData) {
            const updatedCollection = await this.collectionRepository.update(new mongodb_1.ObjectId(id), updateData);
            return updatedCollection;
        }
        async updateAttributesContent(username, slug, updateData) {
            // check if the user have the permission to update the collection
            const collection = await this.collectionRepository.findBySlug(slug);
            this.validateCollectionAccess(collection, username);
            const updatedCollection = await this.collectionRepository.updateAttributesContent(collection._id, updateData);
            return updatedCollection;
        }
        async delete(id) {
            const isDeleted = await this.collectionRepository.delete(new mongodb_1.ObjectId(id));
            return isDeleted;
        }
        async findAll() {
            const collections = await this.collectionRepository.findAll();
            return collections;
        }
        async findByName(collectionName) {
            const collection = await this.collectionRepository.findByName(collectionName);
            return collection;
        }
    };
    CollectionService = CollectionService_1 = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(CollectionRepository_1.default)),
        __param(1, (0, inversify_1.inject)(EndpointService_1.default)),
        __param(2, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __param(3, (0, inversify_1.inject)(StorageManagerService_1.StorageManagerService)),
        __param(4, (0, inversify_1.inject)(PostsService_1.PostsService)),
        __metadata("design:paramtypes", [Object, Object, common_response_1.ErrorHandlerService, Object, PostsService_1.PostsService])
    ], CollectionService);
    exports.default = CollectionService;
});
