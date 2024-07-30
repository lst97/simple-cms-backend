(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoginForm = void 0;
    class LoginForm {
        email;
        password;
        constructor({ email, password }) {
            this.email = email;
            this.password = password;
        }
    }
    exports.LoginForm = LoginForm;
});
