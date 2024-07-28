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
        define(["require", "exports", "inversify", "@lst97/common-errors", "@lst97/common_response", "../collection/CollectionController", "../../services/StorageManagerService"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const common_errors_1 = require("@lst97/common-errors");
    const common_response_1 = require("@lst97/common_response");
    const CollectionController_1 = __importDefault(require("../collection/CollectionController"));
    const StorageManagerService_1 = require("../../services/StorageManagerService");
    let StorageController = class StorageController {
        storageManagerService;
        errorHandlerService;
        responseService;
        constructor(storageManagerService, errorHandlerService, responseService) {
            this.storageManagerService = storageManagerService;
            this.errorHandlerService = errorHandlerService;
            this.responseService = responseService;
        }
        async getFile(req, res) {
            try {
                const { username, fileId } = req.params; // Extract parameters from the request
                const filePath = this.storageManagerService.getFile(username, fileId);
                res.sendFile(filePath);
            }
            catch (error) {
                if (!(error instanceof common_errors_1.DefinedBaseError)) {
                    this.errorHandlerService.handleUnknownControllerError({
                        error: error,
                        service: CollectionController_1.default.name,
                        errorType: common_errors_1.ControllerError
                    });
                }
                const commonResponse = this.responseService.buildErrorResponse(error, req.id);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
            }
        }
    };
    StorageController = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(StorageManagerService_1.StorageManagerService)),
        __param(1, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __param(2, (0, inversify_1.inject)(common_response_1.ResponseService)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], StorageController);
    exports.default = StorageController;
});
