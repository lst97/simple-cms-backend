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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "yaml", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const yaml_1 = __importDefault(require("yaml"));
    const fs = __importStar(require("fs"));
    const path = __importStar(require("path"));
    class AppConfig {
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
            this.port = configData.port;
            this.host = configData.host;
            this.apiVersion = configData.apiVersion;
            this.apiEndpoint = configData.apiEndpoint;
            this.database = process.env.MONGODB_URI ?? configData.database;
            this.certificates = configData.certificates;
            this.appIdentifier = configData.appIdentifier;
            this.environment = configData.environment;
            this.protocol = configData.protocol;
        }
    }
    const configPath = path.resolve(__dirname, 'app_config.yml');
    const configData = yaml_1.default.parse(fs.readFileSync(configPath, 'utf8'));
    const appConfig = new AppConfig(configData);
    exports.default = appConfig;
});
