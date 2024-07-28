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
        define(["require", "exports", "inversify", "../../models/share/endpoint/Endpoint", "../../errors/Errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Endpoint_1 = require("../../models/share/endpoint/Endpoint");
    const Errors_1 = require("../../errors/Errors");
    let EndpointRepository = class EndpointRepository {
        constructor() { }
        async createCollectionEndpoint(endpoint) {
            try {
                return Endpoint_1.CollectionEndpointModel.create(endpoint);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                else
                    throw error;
            }
        }
        async findCollectionEndpointBySlug(slug) {
            return Endpoint_1.CollectionEndpointModel.findOne({ slug });
        }
        async findCollectionEndpointsByUsername(username) {
            return Endpoint_1.CollectionEndpointModel.find({ username });
        }
        async findCollectionEndpointsByPrefixAndUsername(username, prefix, visibility = 'public') {
            return Endpoint_1.CollectionEndpointModel.find({
                username: username,
                prefix: prefix,
                visibility: visibility
            }).exec();
        }
        async deleteCollectionEndpointBySlug(slug) {
            const result = await Endpoint_1.CollectionEndpointModel.deleteOne({
                slug: slug
            });
            return result.deletedCount === 1;
        }
    };
    EndpointRepository = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], EndpointRepository);
    exports.default = EndpointRepository;
});
