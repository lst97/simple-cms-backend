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
        define(["require", "exports", "@typegoose/typegoose"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollectionEndpointModel = exports.CollectionEndpoint = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    /**
     * A endpoint is a representation of a RESTful endpoint.
     */
    class CollectionEndpoint {
        username;
        prefix;
        slug;
        method;
        status;
        visibility;
        createdAt;
        updatedAt;
        constructor(createdBy, { prefix, slug, method, status, visibility }) {
            this.username = createdBy;
            this.prefix = prefix === '' ? '/' : prefix;
            this.slug = slug;
            this.method = method;
            this.status = status;
            this.visibility = visibility;
        }
    }
    exports.CollectionEndpoint = CollectionEndpoint;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: '/' }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "prefix", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, unique: true }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "slug", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "method", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "status", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CollectionEndpoint.prototype, "visibility", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: Date.now }),
        __metadata("design:type", Date)
    ], CollectionEndpoint.prototype, "createdAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: Date.now }),
        __metadata("design:type", Date)
    ], CollectionEndpoint.prototype, "updatedAt", void 0);
    exports.CollectionEndpointModel = (0, typegoose_1.getModelForClass)(CollectionEndpoint);
});
