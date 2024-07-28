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
        define(["require", "exports", "inversify", "../../services/collection/CollectionService", "@lst97/common_response", "@lst97/common-errors", "../../services/endpoint/EndpointService", "../../models/share/collection/AttributeContents", "./PostsController"], factory);
    }
})(function (require, exports) {
    "use strict";
    var CollectionController_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const CollectionService_1 = __importDefault(require("../../services/collection/CollectionService"));
    const common_response_1 = require("@lst97/common_response");
    const common_errors_1 = require("@lst97/common-errors");
    const EndpointService_1 = __importDefault(require("../../services/endpoint/EndpointService"));
    const AttributeContents_1 = require("../../models/share/collection/AttributeContents");
    const PostsController_1 = __importDefault(require("./PostsController"));
    let CollectionController = CollectionController_1 = class CollectionController {
        endpointService;
        collectionService;
        postsController;
        errorHandlerService;
        responseService;
        constructor(endpointService, collectionService, postsController, errorHandlerService, responseService) {
            this.endpointService = endpointService;
            this.collectionService = collectionService;
            this.postsController = postsController;
            this.errorHandlerService = errorHandlerService;
            this.responseService = responseService;
        }
        async createCollection(req, res) {
            const createCollectionForm = req.body;
            const username = req.user.username;
            try {
                const collectionModel = await this.collectionService.create(createCollectionForm, username);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async deleteCollection(req, res) {
            const slug = req.params.slug;
            const username = req.user.username;
            try {
                const collectionModel = await this.collectionService.deleteBySlug(username, slug);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async getCollectionBySlug(req, res) {
            const slug = req.params.slug;
            if (slug === 'posts') {
                this.postsController.getPostsCollections(req, res);
                return;
            }
            try {
                const collection = await this.collectionService.findBySlug(slug);
                const commonResponse = this.responseService.buildSuccessResponse(collection, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async deleteCollectionAttribute(req, res) {
            const slug = req.params.slug;
            const attributeId = req.params.id;
            const username = req.user.username;
            try {
                const collectionModel = await this.collectionService.deleteAttribute(username, slug, attributeId);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async addCollectionAttribute(req, res) {
            const slug = req.params.slug;
            const user = req.user;
            const newAttributeContent = req.body.content;
            const newAttributeSetting = req.body.setting;
            try {
                const collectionModel = await this.collectionService.addAttribute(user.username, slug, newAttributeSetting, newAttributeContent);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async updateCollectionAttribute(req, res) {
            const slug = req.params.slug;
            const attributeId = req.params.id;
            const user = req.user;
            // parallel upload
            const sessionId = req?.query?.sessionId;
            const total = req?.query?.total;
            const groupId = req?.query?.groupId; // currently not in use
            const type = req?.query?.type;
            let updateAttributeContent = undefined;
            let updateAttributeSetting = undefined;
            let parallelMetadata = undefined;
            if (req.query.content === 'true') {
                if (req.body.value?._id !== undefined) {
                    updateAttributeContent = req.body.value;
                }
                else {
                    updateAttributeContent = new AttributeContents_1.BaseContent(req.body.value);
                }
            }
            if (req.query.setting === 'true') {
                updateAttributeSetting = req.body.setting;
            }
            if (sessionId && total && sessionId && type) {
                parallelMetadata = {
                    sessionId: sessionId,
                    total: parseInt(total),
                    nameMap: new Map(Object.entries(req.body.fileNameMap)),
                    groupId: groupId,
                    type: type
                };
            }
            try {
                const collectionModel = await this.collectionService.updateAttribute(user.username, slug, attributeId, {
                    updateAttributeContent: updateAttributeContent,
                    updateAttributeSetting: updateAttributeSetting
                }, parallelMetadata);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async updateCollectionAttributes(req, res) {
            const slug = req.params.slug;
            const user = req.user;
            const updateAttributes = req.body.attributes;
            try {
                const collectionModel = await this.collectionService.updateAttributesContent(user.username, slug, updateAttributes);
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async updateCollection(req, res) {
            const slug = req.params.slug;
            let updateCollectionAttributesContent = [];
            let updateCollectionAttributesSettings = [];
            let updateCollectionInfo = {};
            if (req.body.content === 'true') {
                updateCollectionAttributesContent = req.body;
            }
            if (req.body.settings === 'true') {
                updateCollectionAttributesSettings = req.body;
            }
            if (req.body.info === 'true') {
                updateCollectionInfo = req.body;
            }
            try {
                const collectionModel = await this.collectionService.updateBySlug(req.user.username, slug, {
                    updateAttributesContent: updateCollectionAttributesContent,
                    updateAttributesSetting: updateCollectionAttributesSettings,
                    updateCollectionInfo: updateCollectionInfo
                });
                const commonResponse = this.responseService.buildSuccessResponse(collectionModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async getCollections(req, res) {
            try {
                const collections = await this.collectionService.findByUsername(req.user.username);
                const commonResponse = this.responseService.buildSuccessResponse(collections, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        // prefix = subdirectory
        async getCollectionsByPrefixAndUsername(req, res) {
            const prefix = req.params[0] + '/';
            const username = req.params.username;
            // need to check query schema
            const includeAttributes = req.query.attributes;
            // should replaced by schema
            if (includeAttributes !== undefined &&
                includeAttributes !== 'true' &&
                includeAttributes !== 'false') {
                const commonResponse = this.responseService.buildErrorResponse(new Error('Invalid query schema'), req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
                return;
            }
            try {
                let visibility = 'public';
                // This is not working now, because the passport middleware is not used in this route
                if (req.user && req.user.username === username) {
                    visibility = 'private';
                }
                const collections = await this.collectionService.findByPrefixAndUsername(username, prefix, visibility, includeAttributes === 'true');
                const commonResponse = this.responseService.buildSuccessResponse(collections, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
        async getCollectionAttributes(req, res) {
            const slug = req.params.slug;
            const endpoint = await this.endpointService.findEndpointBySlug(slug);
            if (endpoint === null ||
                endpoint.method !== 'GET' ||
                endpoint.status === 'draft' ||
                endpoint.visibility === 'private') {
                const commonResponse = this.responseService.buildErrorResponse(new common_errors_1.ServerResourceNotFoundError('Resource not found'), req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
                return;
            }
            try {
                const collections = await this.collectionService.findBySlug(slug);
                const commonResponse = this.responseService.buildSuccessResponse(collections?.attributes, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
    };
    CollectionController = CollectionController_1 = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(EndpointService_1.default)),
        __param(1, (0, inversify_1.inject)(CollectionService_1.default)),
        __param(2, (0, inversify_1.inject)(PostsController_1.default)),
        __param(3, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __param(4, (0, inversify_1.inject)(common_response_1.ResponseService)),
        __metadata("design:paramtypes", [Object, Object, PostsController_1.default, Object, Object])
    ], CollectionController);
    exports.default = CollectionController;
});
