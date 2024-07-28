(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./CollectionBaseSchema"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DynamicSchema = exports.BooleanSchema = exports.DecimalSchema = exports.NumberSchema = exports.DateSchema = exports.DocumentSchema = exports.MediaSchema = exports.VideoExtensions = exports.AudioExtensions = exports.ImageExtensions = exports.CodeSchema = exports.TextSchema = exports.TextTypes = void 0;
    const CollectionBaseSchema_1 = require("./CollectionBaseSchema");
    class TextTypes {
        static short_text = "short_text";
        static long_text = "long_text";
        static reach_text = "reach_text";
    }
    exports.TextTypes = TextTypes;
    class TextSchema {
        static type = CollectionBaseSchema_1.SupportedAttributes.text;
        static textType = TextTypes.short_text;
        static maxLength = 255;
        static minLength = 0;
    }
    exports.TextSchema = TextSchema;
    class CodeSchema {
        static type = "code";
        static language = "plaintext";
        static maxLength = 65535;
        static minLength = 0;
    }
    exports.CodeSchema = CodeSchema;
    class ImageExtensions {
        static jpg = "jpg";
        static jpeg = "jpeg";
        static png = "png";
        static gif = "gif";
        static svg = "svg";
    }
    exports.ImageExtensions = ImageExtensions;
    class AudioExtensions {
        static mp3 = "mp3";
        static wav = "wav";
        static ogg = "ogg";
    }
    exports.AudioExtensions = AudioExtensions;
    class VideoExtensions {
        static mp4 = "mp4";
        static webm = "webm";
        static ogg = "ogg";
    }
    exports.VideoExtensions = VideoExtensions;
    class MediaSchema {
        static type = "media";
        static mediaType = "image";
        static extension = "jpg";
        static maxSize = 10485760; // 100MB
    }
    exports.MediaSchema = MediaSchema;
    class DocumentSchema {
        static type = "document";
        static extension = "pdf";
        static maxSize = 1048576; // 10MB
    }
    exports.DocumentSchema = DocumentSchema;
    class DateSchema {
        static type = "date";
        static format = "DD-MM-YYYYTHH:mm:ssZ";
    }
    exports.DateSchema = DateSchema;
    class NumberSchema {
        static type = "number";
        static min = -Infinity;
        static max = Infinity;
    }
    exports.NumberSchema = NumberSchema;
    class DecimalSchema {
        static type = "decimal";
        static min = -Infinity;
        static max = Infinity;
        static precision = [0, 0];
    }
    exports.DecimalSchema = DecimalSchema;
    class BooleanSchema {
        static type = "boolean";
    }
    exports.BooleanSchema = BooleanSchema;
    class DynamicSchema {
        static type = "dynamic";
        static content = {};
    }
    exports.DynamicSchema = DynamicSchema;
});
