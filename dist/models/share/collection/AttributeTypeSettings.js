var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "@typegoose/typegoose", "../../../schemas/collection/BaseSchema", "mongodb"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MediaTypesSettingModel = exports.TextTypeSettingModel = exports.TypeSettingModel = exports.DynamicTypeSetting = exports.BooleanTypeSetting = exports.DecimalTypeSetting = exports.NumberTypeSetting = exports.DateTypeSetting = exports.DocumentTypeSetting = exports.MediaTypeSetting = exports.ImageMetadata = exports.CodeTypeSetting = exports.PostTypeSetting = exports.TextTypeSetting = exports.ReactionTypeSetting = exports.CommentTypeSetting = exports.TypeSetting = exports.SupportedAdvancedSettings = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const BaseSchema_1 = require("../../../schemas/collection/BaseSchema");
    const mongodb_1 = require("mongodb");
    class SupportedAdvancedSettings {
        static require = 'require';
        static unique = 'unique';
        static max_length = 'max_length';
        static min_length = 'min_length';
    }
    exports.SupportedAdvancedSettings = SupportedAdvancedSettings;
    class TypeSetting {
        _id;
        name;
        type;
        required;
        unique;
        private;
        constructor(name, type, { required = false, unique = false, isPrivate = false }) {
            this.name = name;
            this.type = type;
            this.required = required;
            this.unique = unique;
            this.private = isPrivate;
        }
    }
    exports.TypeSetting = TypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: false, default: new mongodb_1.ObjectId() }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], TypeSetting.prototype, "_id", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], TypeSetting.prototype, "name", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], TypeSetting.prototype, "type", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], TypeSetting.prototype, "required", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], TypeSetting.prototype, "unique", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: false }),
        __metadata("design:type", Boolean)
    ], TypeSetting.prototype, "private", void 0);
    class CommentTypeSetting extends TypeSetting {
        constructor(name, { required = false, unique = false, isPrivate = false }) {
            super(name, 'comment', { required, unique, isPrivate });
        }
    }
    exports.CommentTypeSetting = CommentTypeSetting;
    class ReactionTypeSetting extends TypeSetting {
        constructor(name, { required = false, unique = false, isPrivate = false }) {
            super(name, 'reaction', { required, unique, isPrivate });
        }
    }
    exports.ReactionTypeSetting = ReactionTypeSetting;
    class TextTypeSetting extends TypeSetting {
        maxLength;
        minLength;
        textType;
        constructor(name, { required = false, unique = false, isPrivate = false }, { maxLength = BaseSchema_1.TextSchema.maxLength, minLength = BaseSchema_1.TextSchema.minLength, textType = 'short_text' }) {
            super(name, 'text', { required, unique, isPrivate });
            this.maxLength = maxLength;
            this.minLength = minLength;
            this.textType = textType;
        }
    }
    exports.TextTypeSetting = TextTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], TextTypeSetting.prototype, "maxLength", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], TextTypeSetting.prototype, "minLength", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], TextTypeSetting.prototype, "textType", void 0);
    class PostTypeSetting extends TypeSetting {
        category;
        tags;
        comment;
        reaction;
        constructor(title, advancedOption, baseOptions) {
            super(title, 'post', {
                required: advancedOption?.required ?? false,
                unique: advancedOption?.unique ?? false,
                isPrivate: advancedOption?.isPrivate ?? false
            });
            if (baseOptions) {
                this.comment = baseOptions.comment;
                this.reaction = baseOptions.reaction;
            }
        }
    }
    exports.PostTypeSetting = PostTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], PostTypeSetting.prototype, "category", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", Array)
    ], PostTypeSetting.prototype, "tags", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], PostTypeSetting.prototype, "comment", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], PostTypeSetting.prototype, "reaction", void 0);
    class CodeTypeSetting extends TypeSetting {
        maxLength;
        minLength;
        language;
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { maxLength = BaseSchema_1.TextSchema.maxLength, minLength = BaseSchema_1.TextSchema.minLength, language = 'plaintext' }) {
            super(name, 'code', { required, unique, isPrivate });
            this.maxLength = maxLength;
            this.minLength = minLength;
            this.language = language;
        }
    }
    exports.CodeTypeSetting = CodeTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], CodeTypeSetting.prototype, "maxLength", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], CodeTypeSetting.prototype, "minLength", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CodeTypeSetting.prototype, "language", void 0);
    class ImageMetadata {
        id; // Unique identifier
        altText; // Alternative text for accessibility
        title; // Optional title for the image
        caption; // Optional caption for the image
        description; // Optional longer description
        fileName; // Original file name
        fileSize; // File size in bytes
        dimensions;
        usageRights; // Information about usage rights
        creator; // Creator/author of the image
        constructor({ id, altText, title, caption, description, fileName, fileSize, dimensions, usageRights, creator }) {
            this.id = id;
            this.altText = altText;
            this.title = title;
            this.caption = caption;
            this.description = description;
            this.fileName = fileName;
            this.fileSize = fileSize;
            this.dimensions = dimensions;
            this.usageRights = usageRights;
            this.creator = creator;
        }
    }
    exports.ImageMetadata = ImageMetadata;
    class MediaTypeSetting extends TypeSetting {
        mediaType;
        mediaExtension;
        maxSize; // bytes
        // content related
        metadata;
        constructor(name, { required = false, unique = false, isPrivate = false }, { mediaType = BaseSchema_1.MediaSchema.mediaType, mediaExtension = BaseSchema_1.MediaSchema.extension, maxSize = BaseSchema_1.MediaSchema.maxSize }) {
            super(name, 'media', { required, unique, isPrivate });
            this.mediaType = mediaType;
            this.mediaExtension = mediaExtension;
            this.maxSize = maxSize;
        }
    }
    exports.MediaTypeSetting = MediaTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], MediaTypeSetting.prototype, "mediaType", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], MediaTypeSetting.prototype, "mediaExtension", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], MediaTypeSetting.prototype, "maxSize", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false, default: [] }),
        __metadata("design:type", Array)
    ], MediaTypeSetting.prototype, "metadata", void 0);
    class DocumentTypeSetting extends TypeSetting {
        documentExtension;
        maxSize;
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { documentExtension = BaseSchema_1.DocumentSchema.extension, maxSize = BaseSchema_1.DocumentSchema.maxSize }) {
            super(name, type, { required, unique, isPrivate });
            this.documentExtension = documentExtension;
            this.maxSize = maxSize;
        }
    }
    exports.DocumentTypeSetting = DocumentTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], DocumentTypeSetting.prototype, "documentExtension", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], DocumentTypeSetting.prototype, "maxSize", void 0);
    class DateTypeSetting extends TypeSetting {
        format;
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { format = BaseSchema_1.DateSchema.format }) {
            super(name, type, { required, unique, isPrivate });
            this.format = format;
        }
    }
    exports.DateTypeSetting = DateTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], DateTypeSetting.prototype, "format", void 0);
    class NumberTypeSetting extends TypeSetting {
        min;
        max;
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { min = BaseSchema_1.NumberSchema.min, max = BaseSchema_1.NumberSchema.max }) {
            super(name, type, { required, unique, isPrivate });
            this.min = min;
            this.max = max;
        }
    }
    exports.NumberTypeSetting = NumberTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], NumberTypeSetting.prototype, "min", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], NumberTypeSetting.prototype, "max", void 0);
    class DecimalTypeSetting extends TypeSetting {
        min;
        max;
        precision;
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { min = BaseSchema_1.DecimalSchema.min, max = BaseSchema_1.DecimalSchema.max, precision = BaseSchema_1.DecimalSchema.precision }) {
            super(name, type, { required, unique, isPrivate });
            this.min = min;
            this.max = max;
            this.precision = precision;
        }
    }
    exports.DecimalTypeSetting = DecimalTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], DecimalTypeSetting.prototype, "min", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], DecimalTypeSetting.prototype, "max", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Array)
    ], DecimalTypeSetting.prototype, "precision", void 0);
    class BooleanTypeSetting extends TypeSetting {
        constructor(name, type, { required = false, unique = false, isPrivate = false }) {
            super(name, type, { required, unique, isPrivate });
        }
    }
    exports.BooleanTypeSetting = BooleanTypeSetting;
    class DynamicTypeSetting extends TypeSetting {
        content = {};
        constructor(name, type, { required = false, unique = false, isPrivate = false }, { content }) {
            super(name, type, { required, unique, isPrivate });
            this.content = content;
        }
    }
    exports.DynamicTypeSetting = DynamicTypeSetting;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Object)
    ], DynamicTypeSetting.prototype, "content", void 0);
    exports.TypeSettingModel = (0, typegoose_1.getModelForClass)(TypeSetting);
    exports.TextTypeSettingModel = (0, typegoose_1.getModelForClass)(TextTypeSetting);
    exports.MediaTypesSettingModel = (0, typegoose_1.getModelForClass)(MediaTypeSetting);
});
