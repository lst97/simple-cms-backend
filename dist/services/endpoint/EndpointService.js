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
        define(["require", "exports", "inversify", "../../models/share/endpoint/Endpoint", "../../repositories/endpoint/EndpointRepository", "@lst97/common-errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Endpoint_1 = require("../../models/share/endpoint/Endpoint");
    const EndpointRepository_1 = __importDefault(require("../../repositories/endpoint/EndpointRepository"));
    const common_errors_1 = require("@lst97/common-errors");
    let EndpointService = class EndpointService {
        endpointRepository;
        constructor(endpointRepository) {
            this.endpointRepository = endpointRepository;
        }
        async createEndpoint(username, prefix, slug) {
            return await this.endpointRepository.createCollectionEndpoint(new Endpoint_1.CollectionEndpoint(username, {
                prefix: prefix,
                slug: slug,
                method: 'GET',
                status: 'published',
                visibility: 'public'
            }));
        }
        async findEndpointBySlug(slug) {
            const endpoint = await this.endpointRepository.findCollectionEndpointBySlug(slug);
            if (!endpoint) {
                throw new common_errors_1.ServerResourceNotFoundError('Endpoint not found');
            }
            return endpoint;
        }
        async findEndpointsByUsername(username) {
            return await this.endpointRepository.findCollectionEndpointsByUsername(username);
        }
        async findSlugsByPrefixAndUsername(username, prefix, visibility = 'public') {
            return ((await this.endpointRepository.findCollectionEndpointsByPrefixAndUsername(username, prefix, visibility))?.map((endpoint) => endpoint.slug) ?? null);
        }
        async deleteEndpointBySlug(slug) {
            return await this.endpointRepository.deleteCollectionEndpointBySlug(slug);
        }
    };
    EndpointService = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(EndpointRepository_1.default)),
        __metadata("design:paramtypes", [Object])
    ], EndpointService);
    exports.default = EndpointService;
});
