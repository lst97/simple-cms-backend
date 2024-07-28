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
    exports.RegistrationForm = void 0;
    class RegistrationForm {
        email;
        password;
        username;
        image;
        constructor({ email, password, username, image }) {
            this.email = email;
            this.password = password;
            this.username = username;
            this.image = image;
        }
    }
    exports.RegistrationForm = RegistrationForm;
});
