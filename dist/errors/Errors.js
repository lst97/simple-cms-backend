(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@lst97/common-errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DocumentDeletionError = exports.DocumentUpdateError = exports.DocumentCreationError = exports.DocumentReadError = void 0;
    const common_errors_1 = require("@lst97/common-errors");
    class DocumentReadError extends common_errors_1.DatabaseError {
        // query?: string;
        constructor({ message, query, cause }) {
            const defaultMessage = 'Failed to read document from database';
            super({ message: message || defaultMessage, cause });
        }
    }
    exports.DocumentReadError = DocumentReadError;
    class DocumentCreationError extends common_errors_1.DatabaseError {
        // query?: string;
        constructor({ message, query, cause }) {
            const defaultMessage = 'Failed to create document in database';
            super({ message: message || defaultMessage, cause });
        }
    }
    exports.DocumentCreationError = DocumentCreationError;
    class DocumentUpdateError extends common_errors_1.DatabaseError {
        // query?: string;
        constructor({ message, query, cause }) {
            const defaultMessage = 'Failed to update document in database';
            super({ message: message || defaultMessage, cause });
        }
    }
    exports.DocumentUpdateError = DocumentUpdateError;
    class DocumentDeletionError extends common_errors_1.DatabaseError {
        // query?: string;
        constructor({ message, query, cause }) {
            const defaultMessage = 'Failed to delete document from database';
            super({ message: message || defaultMessage, cause });
        }
    }
    exports.DocumentDeletionError = DocumentDeletionError;
});
