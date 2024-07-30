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
        define(["require", "exports", "@typegoose/typegoose", "mongodb"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FileInfoModel = exports.FileInfo = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const mongodb_1 = require("mongodb");
    class FileInfo {
        _id;
        username;
        groupId;
        fileName;
        type;
        createdAt;
        updatedAt;
        constructor({ username, groupId, fileName, type }) {
            this._id = new mongodb_1.ObjectId();
            this.username = username;
            this.groupId = groupId;
            this.fileName = fileName;
            this.type = type;
        }
    }
    exports.FileInfo = FileInfo;
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: new mongodb_1.ObjectId() }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], FileInfo.prototype, "_id", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], FileInfo.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], FileInfo.prototype, "groupId", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], FileInfo.prototype, "fileName", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], FileInfo.prototype, "type", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: Date.now }),
        __metadata("design:type", Date)
    ], FileInfo.prototype, "createdAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: Date.now }),
        __metadata("design:type", Date)
    ], FileInfo.prototype, "updatedAt", void 0);
    exports.FileInfoModel = (0, typegoose_1.getModelForClass)(FileInfo);
});
