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
        define(["require", "exports", "inversify", "../../services/endpoint/EndpointService", "@lst97/common-errors", "@lst97/common_response", "../collection/CollectionController"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const EndpointService_1 = __importDefault(require("../../services/endpoint/EndpointService"));
    const common_errors_1 = require("@lst97/common-errors");
    const common_response_1 = require("@lst97/common_response");
    const CollectionController_1 = __importDefault(require("../collection/CollectionController"));
    let EndpointController = class EndpointController {
        endpointService;
        errorHandlerService;
        responseService;
        constructor(endpointService, errorHandlerService, responseService) {
            this.endpointService = endpointService;
            this.errorHandlerService = errorHandlerService;
            this.responseService = responseService;
        }
        async getEndpointByCollectionSlug(req, res) {
            const slug = req.params.slug;
            try {
                const endpointModel = await this.endpointService.findEndpointBySlug(slug);
                const commonResponse = this.responseService.buildSuccessResponse(endpointModel, req.headers.requestId);
                res.status(commonResponse.httpStatus).json(commonResponse.response);
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
    EndpointController = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(EndpointService_1.default)),
        __param(1, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __param(2, (0, inversify_1.inject)(common_response_1.ResponseService)),
        __metadata("design:paramtypes", [Object, Object, Object])
    ], EndpointController);
    exports.default = EndpointController;
});
