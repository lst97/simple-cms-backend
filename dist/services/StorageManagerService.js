var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
        define(["require", "exports", "inversify", "../repositories/storage/StorageRepository", "multer", "mongodb", "path", "fs-extra", "async-mutex", "@lst97/common-errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StorageManagerService = exports.FileNameMapperService = void 0;
    const inversify_1 = require("inversify");
    const StorageRepository_1 = __importDefault(require("../repositories/storage/StorageRepository"));
    const multer_1 = __importDefault(require("multer"));
    const mongodb_1 = require("mongodb");
    const path_1 = __importDefault(require("path"));
    const fs = __importStar(require("fs-extra"));
    const async_mutex_1 = require("async-mutex");
    const common_errors_1 = require("@lst97/common-errors");
    const createFolderIfNotExist = (destination) => {
        if (!destination)
            return;
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
    };
    const storage = multer_1.default.diskStorage({
        destination: function (req, file, cb) {
            const mediaType = req.query.type;
            const sessionId = req.query.sessionId;
            if (!sessionId) {
                cb(new Error('sessionId is required'), '');
                return;
            }
            if (!mediaType) {
                cb(new Error('type is required'), '');
                return;
            }
            if (mediaType !== 'image' &&
                mediaType !== 'video' &&
                mediaType !== 'audio') {
                cb(new Error('mediaType is invalid'), '');
                return;
            }
            const destination = path_1.default.join(path_1.default.resolve(__dirname, '..', '..'), 'database', 'storage', 'temp', req.user.username, sessionId);
            createFolderIfNotExist(destination);
            cb(null, destination);
        },
        filename: function (req, file, cb) {
            if (req.body.fileNameMap === undefined) {
                req.body.fileNameMap = {};
            }
            const fileName = new mongodb_1.ObjectId().toHexString() + path_1.default.extname(file.originalname);
            req.body.fileNameMap[file.originalname] = fileName;
            cb(null, fileName);
        }
    });
    let FileNameMapperService = class FileNameMapperService {
        fileNameMap;
        mutexMap;
        constructor() {
            this.fileNameMap = new Map();
            this.mutexMap = new Map();
        }
        // Method to get or create a mutex for a sessionId
        getSessionMutex(sessionId) {
            let mutex = this.mutexMap.get(sessionId);
            if (!mutex) {
                mutex = this.createFileSession(sessionId);
            }
            return mutex;
        }
        createFileSession(sessionId) {
            let mutex = new async_mutex_1.Mutex();
            this.mutexMap.set(sessionId, mutex);
            this.fileNameMap.set(sessionId, new Map());
            return mutex;
        }
        // Append method using sessionId-specific mutex
        async appendToPendingFileNameMap(sessionId, key, value) {
            const mutex = this.getSessionMutex(sessionId);
            await mutex.runExclusive(async () => {
                const nameMap = this.fileNameMap.get(sessionId);
                nameMap.set(key, value);
            });
        }
        getPendingFileNameMap(sessionId) {
            return this.fileNameMap.get(sessionId) ?? new Map();
        }
        removeSessionMutex(sessionId) {
            this.mutexMap.delete(sessionId);
        }
        removePendingFileNameMap(sessionId) {
            const mutex = this.getSessionMutex(sessionId);
            mutex.runExclusive(() => {
                this.fileNameMap.delete(sessionId);
            });
            this.removeSessionMutex(sessionId);
        }
    };
    exports.FileNameMapperService = FileNameMapperService;
    exports.FileNameMapperService = FileNameMapperService = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], FileNameMapperService);
    let StorageManagerService = class StorageManagerService {
        storageRepository;
        fileNameMapperService;
        upload = (0, multer_1.default)({ storage: storage });
        constructor(storageRepository, fileNameMapperService) {
            this.storageRepository = storageRepository;
            this.fileNameMapperService = fileNameMapperService;
        }
        getFile(username, fileId) {
            const destination = path_1.default.join(path_1.default.resolve(__dirname, '..', '..'), 'database', 'storage', username);
            if (!fs.existsSync(destination)) {
                throw new common_errors_1.ServerResourceNotFoundError('File not found');
            }
            const folders = ['image', 'audio', 'video', 'document'];
            for (const folder of folders) {
                const folderPath = path_1.default.join(destination, folder);
                if (fs.existsSync(folderPath)) {
                    const files = fs.readdirSync(folderPath);
                    for (const file of files) {
                        const id = file.split('.')[0];
                        if (fileId === id) {
                            return path_1.default.join(folderPath, file);
                        }
                    }
                }
            }
            throw new common_errors_1.ServerResourceNotFoundError('File not found');
        }
        getMappedFileNames(sessionId) {
            return this.fileNameMapperService.getPendingFileNameMap(sessionId);
        }
        async getPendingFiles(username, sessionId) {
            const destination = path_1.default.join(path_1.default.resolve(__dirname, '..', '..'), 'database', 'storage', 'temp', username, sessionId);
            if (!fs.existsSync(destination)) {
                return 0;
            }
            return fs.readdirSync(destination).length;
        }
        async received(sessionId, originFileName, mappedFileName) {
            await this.fileNameMapperService.appendToPendingFileNameMap(sessionId, originFileName, mappedFileName);
        }
        async movePendingFilesToStorage(username, sessionId, type, groupId) {
            const destination = path_1.default.join(path_1.default.resolve(__dirname, '..', '..'), 'database', 'storage', username, type, groupId ?? '');
            createFolderIfNotExist(destination);
            const source = path_1.default.join(path_1.default.resolve(__dirname, '..', '..'), 'database', 'storage', 'temp', username, sessionId);
            const files = fs.readdirSync(source);
            for (const file of files) {
                fs.renameSync(path_1.default.join(source, file), path_1.default.join(destination, file));
            }
            // delete the temp folder
            fs.remove(source).catch((error) => {
                console.error(error);
            });
        }
    };
    exports.StorageManagerService = StorageManagerService;
    exports.StorageManagerService = StorageManagerService = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(StorageRepository_1.default)),
        __param(1, (0, inversify_1.inject)(FileNameMapperService)),
        __metadata("design:paramtypes", [Object, FileNameMapperService])
    ], StorageManagerService);
});
