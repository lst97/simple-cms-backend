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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "inversify", "../../services/DatabaseService", "@lst97/common-errors", "../../models/database/User"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AuthUserRepository = void 0;
    const inversify_1 = require("inversify");
    const DatabaseService_1 = require("../../services/DatabaseService");
    const common_errors_1 = require("@lst97/common-errors");
    const User_1 = require("../../models/database/User");
    let AuthUserRepository = class AuthUserRepository {
        databaseService;
        queryService;
        constructor(databaseService, queryService) {
            this.databaseService = databaseService;
            this.queryService = queryService;
        }
        async findUserByEmail(email) {
            const result = (await this.queryService.getWithSqlErrorHandlingAsync(this.databaseService.sqlite3Client, 'SELECT * FROM Users WHERE email = ?', [email], common_errors_1.SqlReadError));
            if (!result) {
                return null;
            }
            return new User_1.AuthUserDbModel({
                id: result.id,
                email: result.email,
                passwordHash: result.password_hash
            });
        }
        async createUser(id, email, hash) {
            return (await this.queryService.runWithSqlErrorHandlingAsync(this.databaseService.sqlite3Client, 'INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)', [id, email, hash], common_errors_1.SqlReadError));
        }
        async updateUser(email, hash) {
            return (await this.queryService.runWithSqlErrorHandlingAsync(this.databaseService.sqlite3Client, 'UPDATE Users SET password_hash = ? WHERE email = ?', [hash, email], common_errors_1.SqlReadError));
        }
        async deleteUser(email) {
            // need to communicate with mongodb
            return null;
        }
    };
    exports.AuthUserRepository = AuthUserRepository;
    exports.AuthUserRepository = AuthUserRepository = __decorate([
        (0, inversify_1.injectable)(),
        __param(0, (0, inversify_1.inject)(DatabaseService_1.DatabaseService)),
        __param(1, (0, inversify_1.inject)(DatabaseService_1.SQLite3QueryService)),
        __metadata("design:paramtypes", [Object, Object])
    ], AuthUserRepository);
});
