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
        define(["require", "exports", "fs", "path"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const fs = __importStar(require("fs"));
    const path = __importStar(require("path"));
    class EnvFileChecker {
        maxAttempts = 3;
        delayMs = 1000;
        waitForEnvFile() {
            console.log('Checking for .env file...');
            return new Promise((resolve, reject) => {
                let attempts = 0;
                const checkFile = () => {
                    if (this.envFileExists()) {
                        resolve();
                    }
                    else {
                        attempts++;
                        if (attempts < this.maxAttempts) {
                            setTimeout(checkFile, this.delayMs);
                        }
                        else {
                            reject(new Error('.env file not found'));
                        }
                    }
                };
                checkFile();
            });
        }
        envFileExists() {
            const envPath = path.resolve(__dirname, '..', '..', '.env');
            return fs.existsSync(envPath);
        }
        async checkEnvFile() {
            try {
                await this.waitForEnvFile();
                return true;
            }
            catch (error) {
                console.error('Error:', error.message);
                process.exit(1);
            }
        }
    }
    exports.default = EnvFileChecker;
});
