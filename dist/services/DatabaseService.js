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
        define(["require", "exports", "@lst97/common-errors", "inversify", "mongodb", "@typegoose/typegoose", "sqlite3", "@lst97/common_response", "../configs/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    var SQLite3QueryService_1;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MongoDBQueryService = exports.SQLite3QueryService = exports.DatabaseService = void 0;
    const common_errors_1 = require("@lst97/common-errors");
    const inversify_1 = require("inversify");
    const mongodb_1 = require("mongodb");
    const typegoose_1 = require("@typegoose/typegoose");
    const sqlite3_1 = __importDefault(require("sqlite3"));
    const common_response_1 = require("@lst97/common_response");
    const config_1 = __importDefault(require("../configs/config"));
    const closeMongoConnection = async (client) => {
        try {
            await client.close();
            await typegoose_1.mongoose.connection.close();
            console.log('Disconnected from MongoDB');
        }
        catch (err) {
            if (err instanceof Error) {
                throw new common_errors_1.ServerError({
                    message: err.message,
                    cause: err
                });
            }
            throw new common_errors_1.UnknownError({
                message: 'An error occurred while disconnecting from the database.',
                cause: err
            });
        }
    };
    const closeSqliteConnection = async (client) => {
        client.close((error) => {
            if (error) {
                throw new common_errors_1.ServerError({
                    message: error.message,
                    cause: error
                });
            }
            else {
                console.log('Database connection closed');
            }
        });
    };
    const addProcessExitListener = (mongoClient, sqlite3Client) => {
        // Close the connection when the application exits
        process.on('exit', async () => {
            await closeMongoConnection(mongoClient);
            await closeSqliteConnection(sqlite3Client);
        });
        process.on('SIGINT', async () => {
            await closeMongoConnection(mongoClient);
            await closeSqliteConnection(sqlite3Client);
            process.exit(0);
        });
        process.on('SIGTERM', async () => {
            await closeMongoConnection(mongoClient);
            await closeSqliteConnection(sqlite3Client);
            process.exit(0);
        });
    };
    let DatabaseService = class DatabaseService {
        _mongodb_client;
        _sqlite3_client;
        constructor() {
            try {
                this._mongodb_client = new mongodb_1.MongoClient(config_1.default.database.mongodbConnectionString);
                this._sqlite3_client = new sqlite3_1.default.Database(config_1.default.database.sqlite3ConnectionString, (error) => {
                    if (error) {
                        throw error;
                    }
                });
                typegoose_1.mongoose.connect(config_1.default.database.mongodbConnectionString);
                console.log(`SQLite3 database connection established at ${config_1.default.database.sqlite3ConnectionString}`);
                console.log(`Connected to MongoDB ${config_1.default.database.mongodbConnectionString}`);
                addProcessExitListener(this._mongodb_client, this._sqlite3_client);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new common_errors_1.ServerError({ message: error.message, cause: error });
                }
                else {
                    throw new common_errors_1.UnknownError({
                        message: 'An error occurred while connecting to the database.',
                        cause: error
                    });
                }
            }
        }
        async closeConnection() {
            await closeMongoConnection(this._mongodb_client);
            await closeSqliteConnection(this._sqlite3_client);
        }
        get mongoClient() {
            return this._mongodb_client;
        }
        get sqlite3Client() {
            return this._sqlite3_client;
        }
    };
    exports.DatabaseService = DatabaseService;
    exports.DatabaseService = DatabaseService = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], DatabaseService);
    /**
     * Represents a transaction for SQLite3 database operations.
     */
    class SQLite3Transaction {
        databaseService;
        constructor(databaseService) {
            this.databaseService = databaseService;
        }
        /**
         * Begins a transaction asynchronously with error handling.
         * @returns A Promise that resolves to a Database object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        async beginTransactionAsyncWithErrorHandling() {
            try {
                const db = this.databaseService.sqlite3Client;
                return await beginTransactionAsync(db);
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
        /**
         * Commits a transaction asynchronously with error handling.
         * @param db - The Database object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        static async commitTransactionAsyncWithErrorHandling(db) {
            try {
                await commitTransactionAsync(db);
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
        /**
         * Rolls back a transaction asynchronously with error handling.
         * @param db - The Database object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        static async rollbackTransactionAsyncWithErrorHandling(db) {
            try {
                await rollbackTransactionAsync(db);
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
    }
    function beginTransactionAsync(db) {
        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN', (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(db);
                });
            });
        });
    }
    function commitTransactionAsync(db) {
        return new Promise((resolve, reject) => {
            db.run('COMMIT', (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    function rollbackTransactionAsync(db) {
        return new Promise((resolve, reject) => {
            db.run('ROLLBACK', (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    }
    /**
     * Service for executing SQL queries with error handling using SQLite3.
     */
    let SQLite3QueryService = SQLite3QueryService_1 = class SQLite3QueryService {
        databaseService;
        errorHandlerService;
        constructor(databaseService, errorHandlerService) {
            this.databaseService = databaseService;
            this.errorHandlerService = errorHandlerService;
        }
        /**
         * Begins a transaction asynchronously.
         * @returns A Promise that resolves to a Database object representing the transaction.
         * @example
         * const db = await databaseService.beginTransactionAsync();
         * try {
         *   // Perform database operations within the transaction
         *   await performDatabaseOperations(db);
         *
         *   // Commit the transaction
         *   await databaseService.commitTransactionAsync(db);
         * } catch (error) {
         *   // Handle any errors and rollback the transaction
         *   await databaseService.rollbackTransactionAsync(db);
         *   throw error;
         * }
         */
        async beginTransactionAsync() {
            const transaction = new SQLite3Transaction(this.databaseService);
            return await transaction.beginTransactionAsyncWithErrorHandling();
        }
        /**
         * Commits the current transaction in the database.
         * @param db The database connection.
         * @returns A promise that resolves when the transaction is committed.
         */
        async commitTransactionAsync(db) {
            await SQLite3Transaction.commitTransactionAsyncWithErrorHandling(db);
        }
        /**
         * Rolls back a transaction in the database.
         * @param db The database connection.
         * @returns A promise that resolves when the transaction is rolled back.
         */
        async rollbackTransactionAsync(db) {
            await SQLite3Transaction.rollbackTransactionAsyncWithErrorHandling(db);
        }
        /**
         * Executes a SQL query with error handling, all SQLite3 error will be convert to
         * DatabaseError, therefore try catch may not be necessary in the repository level.
         *
         * @template T - The type of the result array.
         * @param {Database} db - The database connection.
         * @param {string} query - The SQL query to execute.
         * @param {any[]} params - The parameters for the query.
         * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of a database error.
         * @returns {Promise<T[]>} - A promise that resolves to the result array.
         * @throws {DatabaseError} - Throws a database error if an SQL error occurs.
         */
        async runWithSqlErrorHandlingAsync(db, query, params, errorType // Pass error constructor
        ) {
            try {
                return (await runAsync(db, query, params));
            }
            catch (error) {
                const dbError = new errorType({
                    query,
                    cause: error
                });
                this.errorHandlerService.handleError({
                    error: dbError,
                    service: SQLite3QueryService_1.name,
                    query: query
                });
                throw dbError;
            }
        }
        /**
         * Executes a SQL query with error handling, all SQLite3 error will be convert to
         * DatabaseError, therefore try catch may not be necessary in the repository level.
         *
         * @template T - The type of the result.
         * @param {Database} db - The database instance.
         * @param {string} query - The SQL query to execute.
         * @param {any[]} params - The parameters for the query.
         * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of an error.
         * @returns {Promise<T>} - A promise that resolves to the result of the query.
         * @throws {DatabaseError} - If an error occurs during the query execution.
         */
        async getWithSqlErrorHandlingAsync(db, query, params, errorType) {
            try {
                return (await getAsync(db, query, params));
            }
            catch (error) {
                const dbError = new errorType({
                    query,
                    cause: error
                });
                this.errorHandlerService.handleError({
                    error: dbError,
                    service: SQLite3QueryService_1.name,
                    query: query
                });
                throw dbError;
            }
        }
        /**
         * Executes a SQL query with error handling, all SQLite3 error will be convert to
         * DatabaseError, therefore try catch may not be necessary in the repository level.
         *
         * @template T - The type of the result array.
         * @param {Database} db - The database connection.
         * @param {string} query - The SQL query to execute.
         * @param {any[]} params - The parameters for the query.
         * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of a database error.
         * @returns {Promise<T[]>} - A promise that resolves to the result array.
         * @throws {DatabaseError} - Throws a database error if an SQL error occurs.
         */
        async allWithSqlErrorHandlingAsync(db, query, params, errorType) {
            try {
                return (await allAsync(db, query, params));
            }
            catch (error) {
                throw this.errorHandlerService.handleUnknownDatabaseError({
                    error: error,
                    service: SQLite3QueryService_1.name,
                    query: query,
                    errorType
                });
            }
        }
    };
    exports.SQLite3QueryService = SQLite3QueryService;
    exports.SQLite3QueryService = SQLite3QueryService = SQLite3QueryService_1 = __decorate([
        (0, inversify_1.injectable)(),
        __param(1, (0, inversify_1.inject)(common_response_1.ErrorHandlerService)),
        __metadata("design:paramtypes", [DatabaseService, Object])
    ], SQLite3QueryService);
    function runAsync(db, query, params) {
        return new Promise((resolve, reject) => {
            db.prepare(query, function (err) {
                if (err)
                    return reject(err);
                this.run(params, function (err) {
                    if (err)
                        return reject(err);
                    resolve(this);
                }).finalize();
            });
        });
    }
    function getAsync(db, query, params) {
        return new Promise((resolve, reject) => {
            db.prepare(query, function (err) {
                if (err)
                    return reject(err);
                this.get(params, function (err, row) {
                    if (err)
                        return reject(err);
                    resolve(row);
                }).finalize();
            });
        });
    }
    function allAsync(db, query, params) {
        return new Promise((resolve, reject) => {
            db.prepare(query, function (err) {
                if (err)
                    return reject(err);
                this.all(params, function (err, rows) {
                    if (err)
                        return reject(err);
                    resolve(rows);
                }).finalize();
            });
        });
    }
    let MongoDBQueryService = class MongoDBQueryService {
        databaseService;
        constructor(databaseService) {
            this.databaseService = databaseService;
        }
        async beginTransactionAsync() {
            const transaction = new MongoDBTransaction(this.databaseService);
            return await transaction.beginTransactionAsyncWithErrorHandling();
        }
        async commitTransactionAsync(session) {
            await MongoDBTransaction.commitTransactionAsyncWithErrorHandling(session);
        }
        async rollbackTransactionAsync(session) {
            await MongoDBTransaction.rollbackTransactionAsyncWithErrorHandling(session);
        }
    };
    exports.MongoDBQueryService = MongoDBQueryService;
    exports.MongoDBQueryService = MongoDBQueryService = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [DatabaseService])
    ], MongoDBQueryService);
    /**
     * Represents a transaction for MongoDB database operations.
     */
    class MongoDBTransaction {
        databaseService;
        constructor(databaseService) {
            this.databaseService = databaseService;
        }
        /**
         * Begins a transaction asynchronously with error handling.
         * @returns A Promise that resolves to a MongoClient object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        async beginTransactionAsyncWithErrorHandling() {
            try {
                const client = this.databaseService.mongoClient;
                const session = client.startSession();
                session.startTransaction();
                return session;
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
        /**
         * Commits a transaction asynchronously with error handling.
         * @param client - The MongoClient object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        static async commitTransactionAsyncWithErrorHandling(session) {
            try {
                await session.commitTransaction();
                session.endSession();
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
        /**
         * Rolls back a transaction asynchronously with error handling.
         * @param client - The MongoClient object representing the transaction.
         * @throws {DatabaseError} If an error occurs during the transaction.
         */
        static async rollbackTransactionAsyncWithErrorHandling(session) {
            try {
                await session.abortTransaction();
                session.endSession();
            }
            catch (error) {
                throw new common_errors_1.DatabaseError({
                    cause: error
                });
            }
        }
    }
});
