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
        define(["require", "exports", "inversify", "../../errors/Errors", "../../models/share/storage/FileInfo"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Errors_1 = require("../../errors/Errors");
    const FileInfo_1 = require("../../models/share/storage/FileInfo");
    // info about the file, the data is storage on the disk not database
    let StorageRepository = class StorageRepository {
        constructor() { }
        findFiles(username, fileIds) {
            return FileInfo_1.FileInfoModel.find({
                username: username,
                _id: { $in: fileIds }
            });
        }
        async createFile(fileInfo) {
            try {
                return await FileInfo_1.FileInfoModel.create({
                    fileInfo
                });
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
        async createFilesIntoGroup(fileInfos) {
            try {
                await FileInfo_1.FileInfoModel.insertMany(fileInfos);
                return true;
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
        async deleteFilesFromGroup(username, groupId, fileIds) {
            const result = await FileInfo_1.FileInfoModel.deleteMany({
                username: username,
                groupId: groupId,
                _id: { $in: fileIds }
            });
            return result.deletedCount === fileIds.length;
        }
        async findFile(username, id) {
            return await FileInfo_1.FileInfoModel.findOne({
                username: username,
                _id: id
            });
        }
        async listFiles(username, groupId) {
            return FileInfo_1.FileInfoModel.find({
                username: username,
                groupId: groupId
            });
        }
        async deleteFile(username, id) {
            const result = await FileInfo_1.FileInfoModel.deleteOne({
                username: username,
                _id: id
            });
            return result.deletedCount === 1;
        }
        async deleteGroup(username, groupId) {
            const result = await FileInfo_1.FileInfoModel.deleteMany({
                username: username,
                groupId: groupId
            });
            return result.deletedCount >= 1;
        }
    };
    StorageRepository = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], StorageRepository);
    exports.default = StorageRepository;
});
