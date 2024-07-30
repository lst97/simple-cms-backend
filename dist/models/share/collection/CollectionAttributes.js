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
        define(["require", "exports", "@typegoose/typegoose", "./AttributeContents", "mongodb"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CollectionAttributeModel = exports.CollectionAttribute = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const AttributeContents_1 = require("./AttributeContents");
    const mongodb_1 = require("mongodb");
    class CollectionAttribute {
        _id;
        setting;
        content;
        constructor(setting, content) {
            this.setting = setting;
            if (setting.type === 'media') {
                this.content = new AttributeContents_1.ParallelFilesUploadContent('', 0);
            }
            else {
                this.content = content;
            }
            this._id = new mongodb_1.ObjectId();
        }
    }
    exports.CollectionAttribute = CollectionAttribute;
    __decorate([
        (0, typegoose_1.prop)({ required: false, default: new mongodb_1.ObjectId() }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], CollectionAttribute.prototype, "_id", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Object)
    ], CollectionAttribute.prototype, "setting", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", AttributeContents_1.BaseContent)
    ], CollectionAttribute.prototype, "content", void 0);
    exports.CollectionAttributeModel = (0, typegoose_1.getModelForClass)(CollectionAttribute);
});
