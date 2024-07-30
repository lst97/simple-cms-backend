var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
        define(["require", "exports", "reflect-metadata", "express", "helmet", "cors", "./configs/credentials", "https", "@lst97/common_response", "@lst97/express-common-middlewares", "inversify", "./inversify.config", "./routes/CollectionRoutes", "@lst97/common-errors", "./routes/AuthenticateRoutes", "./routes/UserRoutes", "./configs/Passport.config", "./routes/EndpointRoutes", "./routes/StorageRoutes", "./routes/PostsRoutes", "./configs/config"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    require("reflect-metadata");
    const express_1 = __importDefault(require("express"));
    const helmet_1 = __importDefault(require("helmet"));
    const cors_1 = __importDefault(require("cors"));
    const credentials_1 = __importDefault(require("./configs/credentials"));
    const https_1 = __importDefault(require("https"));
    const common_response_1 = require("@lst97/common_response");
    const express_common_middlewares_1 = require("@lst97/express-common-middlewares");
    const inversify_1 = require("inversify");
    const inversify_config_1 = __importDefault(require("./inversify.config"));
    const CollectionRoutes_1 = __importDefault(require("./routes/CollectionRoutes"));
    const common_errors_1 = require("@lst97/common-errors");
    const AuthenticateRoutes_1 = __importDefault(require("./routes/AuthenticateRoutes"));
    const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
    const Passport_config_1 = __importDefault(require("./configs/Passport.config"));
    const EndpointRoutes_1 = __importDefault(require("./routes/EndpointRoutes"));
    const StorageRoutes_1 = __importDefault(require("./routes/StorageRoutes"));
    const PostsRoutes_1 = __importDefault(require("./routes/PostsRoutes"));
    const config_1 = __importDefault(require("./configs/config"));
    let App = class App {
        app;
        appConfig; // init in config()
        get Config() {
            return this.appConfig;
        }
        constructor() {
            this.app = (0, express_1.default)();
            this.config();
            this.routes();
        }
        getApp() {
            return this.app;
        }
        config() {
            this.appConfig = config_1.default.instance;
            if (!process.env.ACCESS_TOKEN_SECRET) {
                throw new common_errors_1.ServerInvalidEnvConfigError({
                    message: 'ACCESS_TOKEN_SECRET is not set in .env file.'
                });
            }
            common_response_1.Config.instance.idIdentifier =
                this.appConfig.appIdentifier.name;
            common_response_1.Config.instance.requestIdName = 'requestId';
            common_response_1.Config.instance.traceIdName = 'traceId';
            express_common_middlewares_1.RequestHeaderMiddlewareConfig.instance.requestIdName = 'requestId';
            express_common_middlewares_1.RequestHeaderMiddlewareConfig.instance.appIdentifier =
                this.appConfig.appIdentifier.name;
            this.app.use((0, helmet_1.default)());
            this.app.use((0, cors_1.default)({
                origin: '*',
                credentials: true,
                optionsSuccessStatus: 200
            }));
            this.app.use(express_1.default.json());
            this.app.use(Passport_config_1.default.instance.init());
            this.app.use(inversify_config_1.default.get(express_common_middlewares_1.RequestHeaderMiddlewareService).requestId);
            this.app.use(inversify_config_1.default.get(express_common_middlewares_1.RequestLoggerMiddlewareService).requestLogger);
            this.app.use(inversify_config_1.default.get(express_common_middlewares_1.ResponseLoggerMiddlewareService).responseLogger);
        }
        routes() {
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(CollectionRoutes_1.default).routers);
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(PostsRoutes_1.default).routers);
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(AuthenticateRoutes_1.default).routers);
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(UserRoutes_1.default).routers);
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(EndpointRoutes_1.default).routers);
            this.app.use(`${this.appConfig.apiEndpoint}/${this.appConfig.apiVersion}`, inversify_config_1.default.get(StorageRoutes_1.default).routers);
        }
        listen(port, callback) {
            switch (this.appConfig.environment) {
                case 'production': {
                    const httpsServer = https_1.default.createServer(new credentials_1.default().tls, this.app);
                    httpsServer.listen(port, callback);
                    break;
                }
                case 'local': // development
                    this.app.listen(port, callback);
                    break;
                case 'docker': // testing
                    this.app.listen(port, callback);
                    break;
                default:
                    throw new Error('Environment not set');
            }
        }
    };
    App = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], App);
    const app = new App();
    const port = app.Config.port;
    const environment = app.Config.environment;
    app.listen(port, () => {
        console.log(`(${environment}) Server is running on ${app.Config.protocol}://${app.Config.host}:${port} 🚀`);
    });
});
