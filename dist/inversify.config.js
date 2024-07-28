var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@lst97/common_response", "@lst97/express-common-middlewares", "inversify", "./services/DatabaseService", "./controllers/collection/CollectionController", "./routes/CollectionRoutes", "./services/collection/CollectionService", "./repositories/collection/CollectionRepository", "./routes/AuthenticateRoutes", "./routes/UserRoutes", "./controllers/auth/AuthenticateController", "./controllers/user/UserController", "./services/auth/AuthenticateService", "./services/UserService", "./repositories/auth/AuthUserRepository", "./repositories/user/UserRepository", "./services/endpoint/EndpointService", "./repositories/endpoint/EndpointRepository", "./routes/EndpointRoutes", "./controllers/endpoint/EndpointController", "./repositories/storage/StorageRepository", "./services/StorageManagerService", "./routes/StorageRoutes", "./controllers/storage/StorageController", "./services/post/PostsService", "./repositories/post/PostsRepository", "./routes/PostsRoutes", "./controllers/collection/PostsController"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const common_response_1 = require("@lst97/common_response");
    const express_common_middlewares_1 = require("@lst97/express-common-middlewares");
    const inversify_1 = require("inversify");
    const DatabaseService_1 = require("./services/DatabaseService");
    const CollectionController_1 = __importDefault(require("./controllers/collection/CollectionController"));
    const CollectionRoutes_1 = __importDefault(require("./routes/CollectionRoutes"));
    const CollectionService_1 = __importDefault(require("./services/collection/CollectionService"));
    const CollectionRepository_1 = __importDefault(require("./repositories/collection/CollectionRepository"));
    const AuthenticateRoutes_1 = __importDefault(require("./routes/AuthenticateRoutes"));
    const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
    const AuthenticateController_1 = __importDefault(require("./controllers/auth/AuthenticateController"));
    const UserController_1 = __importDefault(require("./controllers/user/UserController"));
    const AuthenticateService_1 = __importDefault(require("./services/auth/AuthenticateService"));
    const UserService_1 = __importDefault(require("./services/UserService"));
    const AuthUserRepository_1 = require("./repositories/auth/AuthUserRepository");
    const UserRepository_1 = require("./repositories/user/UserRepository");
    const EndpointService_1 = __importDefault(require("./services/endpoint/EndpointService"));
    const EndpointRepository_1 = __importDefault(require("./repositories/endpoint/EndpointRepository"));
    const EndpointRoutes_1 = __importDefault(require("./routes/EndpointRoutes"));
    const EndpointController_1 = __importDefault(require("./controllers/endpoint/EndpointController"));
    const StorageRepository_1 = __importDefault(require("./repositories/storage/StorageRepository"));
    const StorageManagerService_1 = require("./services/StorageManagerService");
    const StorageRoutes_1 = __importDefault(require("./routes/StorageRoutes"));
    const StorageController_1 = __importDefault(require("./controllers/storage/StorageController"));
    const PostsService_1 = require("./services/post/PostsService");
    const PostsRepository_1 = __importDefault(require("./repositories/post/PostsRepository"));
    const PostsRoutes_1 = __importDefault(require("./routes/PostsRoutes"));
    const PostsController_1 = __importDefault(require("./controllers/collection/PostsController"));
    const container = new inversify_1.Container();
    function buildLibContainers() {
        (0, common_response_1.useInversify)(container);
        (0, express_common_middlewares_1.useInversify)(container);
    }
    function buildRepositoryContainers() {
        container.bind(CollectionRepository_1.default).toSelf().inTransientScope();
        container.bind(PostsRepository_1.default).toSelf().inTransientScope();
        container.bind(EndpointRepository_1.default).toSelf().inTransientScope();
        container.bind(AuthUserRepository_1.AuthUserRepository).toSelf().inTransientScope();
        container.bind(UserRepository_1.UserRepository).toSelf().inTransientScope();
        container.bind(StorageRepository_1.default).toSelf().inTransientScope();
    }
    function buildServiceContainers() {
        container.bind(DatabaseService_1.DatabaseService).toSelf().inSingletonScope();
        container.bind(DatabaseService_1.SQLite3QueryService).toSelf().inSingletonScope();
        container.bind(DatabaseService_1.MongoDBQueryService).toSelf().inSingletonScope();
        container.bind(StorageManagerService_1.StorageManagerService).toSelf().inSingletonScope();
        container.bind(StorageManagerService_1.FileNameMapperService).toSelf().inSingletonScope();
        container.bind(CollectionService_1.default).toSelf().inTransientScope();
        container.bind(PostsService_1.PostsService).toSelf().inTransientScope();
        container.bind(EndpointService_1.default).toSelf().inTransientScope();
        container.bind(AuthenticateService_1.default).toSelf().inTransientScope();
        container.bind(UserService_1.default).toSelf().inTransientScope();
    }
    function buildControllerContainers() {
        container.bind(CollectionController_1.default).toSelf().inTransientScope();
        container.bind(PostsController_1.default).toSelf().inTransientScope();
        container.bind(AuthenticateController_1.default).toSelf().inTransientScope();
        container.bind(UserController_1.default).toSelf().inTransientScope();
        container.bind(EndpointController_1.default).toSelf().inTransientScope();
        container.bind(StorageController_1.default).toSelf().inTransientScope();
    }
    function buildMiddlewareContainers() { }
    function buildRouterContainers() {
        container.bind(CollectionRoutes_1.default).toSelf().inSingletonScope();
        container.bind(PostsRoutes_1.default).toSelf().inSingletonScope();
        container.bind(AuthenticateRoutes_1.default).toSelf().inSingletonScope();
        container.bind(UserRoutes_1.default).toSelf().inSingletonScope();
        container.bind(EndpointRoutes_1.default).toSelf().inSingletonScope();
        container.bind(StorageRoutes_1.default).toSelf().inSingletonScope();
    }
    function buildAppContainers() {
        buildLibContainers();
        buildRepositoryContainers();
        buildServiceContainers();
        buildControllerContainers();
        buildMiddlewareContainers();
        buildRouterContainers();
    }
    buildAppContainers();
    exports.default = container;
});
