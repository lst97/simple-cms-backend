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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "fs", "path", "yaml"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs = __importStar(require("fs"));
    const path = __importStar(require("path"));
    const yaml = __importStar(require("yaml"));
    class AppConfig {
        static _instance = null;
        port;
        host;
        protocol;
        apiVersion;
        apiEndpoint;
        database;
        certificates;
        appIdentifier;
        environment;
        constructor(configData) {
            this.environment = process.env.ENVIRONMENT ?? configData.environment;
            this.port = configData.port;
            this.host = configData.host;
            this.apiVersion = configData.apiVersion;
            this.apiEndpoint = configData.apiEndpoint;
            this.database =
                this.environment === 'docker'
                    ? configData.database.docker
                    : configData.database.local;
            this.certificates = configData.certificates;
            this.appIdentifier = configData.appIdentifier;
            this.protocol = configData.protocol;
        }
        static get instance() {
            if (!AppConfig._instance) {
                const configPath = path.resolve(__dirname, 'app_config.yml');
                const configData = yaml.parse(fs.readFileSync(configPath, 'utf8'));
                AppConfig._instance = new AppConfig(configData);
            }
            return AppConfig._instance;
        }
    }
    exports.default = AppConfig;
});
