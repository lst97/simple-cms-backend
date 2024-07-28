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
        define(["require", "exports", "@typegoose/typegoose", "./CollectionAttributes", "../../../utils/Generators", "mongodb", "./AttributeTypeSettings"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PostsCollectionModel = exports.CollectionModel = exports.PostCollection = exports.PostsCollection = exports.Collection = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const CollectionAttributes_1 = require("./CollectionAttributes");
    const Generators_1 = require("../../../utils/Generators");
    const mongodb_1 = require("mongodb");
    const AttributeTypeSettings_1 = require("./AttributeTypeSettings");
    class Collection {
        _id = new mongodb_1.ObjectId();
        kind;
        username;
        collectionName;
        ref; // slug // TODO: change to ref with ObjectId
        description;
        slug;
        setting;
        attributes = [];
        createdAt;
        updatedAt;
        constructor(username, form) {
            if (form) {
                this.username = username;
                this.collectionName = form.info.name;
                this.description = form.info.description;
                this.slug = Generators_1.GeneratorsUtil.generateUrlSlug(this.collectionName);
                this.kind = form.kind;
                this.attributes = form.attributes;
            }
        }
    }
    exports.Collection = Collection;
    __decorate([
        (0, typegoose_1.prop)({ required: false, default: new mongodb_1.ObjectId() }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], Collection.prototype, "_id", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Collection.prototype, "kind", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Collection.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({
            required: true
        }),
        __metadata("design:type", String)
    ], Collection.prototype, "collectionName", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], Collection.prototype, "ref", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], Collection.prototype, "description", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Collection.prototype, "slug", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", AttributeTypeSettings_1.PostTypeSetting)
    ], Collection.prototype, "setting", void 0);
    __decorate([
        (0, typegoose_1.prop)({ type: () => CollectionAttributes_1.CollectionAttribute }),
        __metadata("design:type", Array)
    ], Collection.prototype, "attributes", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: Date.now }),
        __metadata("design:type", Date)
    ], Collection.prototype, "createdAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ default: Date.now }),
        __metadata("design:type", Date)
    ], Collection.prototype, "updatedAt", void 0);
    class PostsCollection extends Collection {
        constructor(username, form) {
            super(username, form);
            this.kind = 'posts';
            this.attributes = [];
        }
    }
    exports.PostsCollection = PostsCollection;
    class PostCollection extends Collection {
        constructor(username, form) {
            super(username, form);
            this.kind = 'post';
            this.setting = new AttributeTypeSettings_1.PostTypeSetting(form.info.name);
            this.ref = form.ref;
        }
    }
    exports.PostCollection = PostCollection;
    exports.CollectionModel = (0, typegoose_1.getModelForClass)(Collection);
    exports.PostsCollectionModel = (0, typegoose_1.getModelForClass)(PostsCollection);
});
