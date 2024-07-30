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
        define(["require", "exports", "@typegoose/typegoose", "mongodb"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ReactionContentModel = exports.CommentContentModel = exports.ParallelFilesUploadContentModel = exports.MediaContentModel = exports.BaseContentModel = exports.Vote = exports.ReactionContent = exports.CommentContent = exports.PostsContent = exports.MediaContent = exports.ParallelFilesUploadContent = exports.BaseContent = void 0;
    const typegoose_1 = require("@typegoose/typegoose");
    const mongodb_1 = require("mongodb");
    class BaseContent {
        _id;
        value;
        sessionId;
        total;
        groupId;
        constructor(content) {
            this.value = content;
            this._id = new mongodb_1.ObjectId();
        }
    }
    exports.BaseContent = BaseContent;
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: new mongodb_1.ObjectId() }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], BaseContent.prototype, "_id", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", Object)
    ], BaseContent.prototype, "value", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], BaseContent.prototype, "sessionId", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", Number)
    ], BaseContent.prototype, "total", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], BaseContent.prototype, "groupId", void 0);
    class ParallelFilesUploadContent extends BaseContent {
        constructor(sessionId, total, groupId, value) {
            super();
            this.sessionId = sessionId;
            this.total = total;
            this.groupId = groupId;
            this.value = value ?? [];
        }
    }
    exports.ParallelFilesUploadContent = ParallelFilesUploadContent;
    class MediaContent {
        url;
        file; // base64
        fileName;
        constructor({ url, file, fileName }) {
            this.url = url;
            this.file = file;
            this.fileName = fileName;
        }
    }
    exports.MediaContent = MediaContent;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], MediaContent.prototype, "url", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], MediaContent.prototype, "file", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], MediaContent.prototype, "fileName", void 0);
    class PostsContent extends BaseContent {
        constructor(content) {
            super(content);
        }
    }
    exports.PostsContent = PostsContent;
    class CommentContent extends BaseContent {
        postId;
        username;
        createdAt;
        updatedAt;
        votes;
        replies;
        status;
        constructor(postId, username, content) {
            super(content);
            this.postId = postId;
            this.username = username;
            this.createdAt = new Date();
            this.votes = [];
            this.status = CommentStatus.Published;
        }
    }
    exports.CommentContent = CommentContent;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], CommentContent.prototype, "postId", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], CommentContent.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: Date.now }),
        __metadata("design:type", Date)
    ], CommentContent.prototype, "createdAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", Date)
    ], CommentContent.prototype, "updatedAt", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: [] }),
        __metadata("design:type", Array)
    ], CommentContent.prototype, "votes", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", Array)
    ], CommentContent.prototype, "replies", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: false }),
        __metadata("design:type", String)
    ], CommentContent.prototype, "status", void 0);
    class ReactionContent extends BaseContent {
        postId;
        // 5 reaction types: Like, Love, Haha, Wow, Sad, Angry
        reactionVotes;
        constructor(postId) {
            super();
            this.postId = postId;
            this.reactionVotes = [[], [], [], [], []];
        }
    }
    exports.ReactionContent = ReactionContent;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", mongodb_1.ObjectId)
    ], ReactionContent.prototype, "postId", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true, default: [[], [], [], [], []] }),
        __metadata("design:type", Array)
    ], ReactionContent.prototype, "reactionVotes", void 0);
    var CommentStatus;
    (function (CommentStatus) {
        CommentStatus["Published"] = "published";
        CommentStatus["Pending"] = "pending";
    })(CommentStatus || (CommentStatus = {}));
    class Vote {
        username;
        value;
        constructor(username, value) {
            this.username = username;
            this.value = value;
        }
    }
    exports.Vote = Vote;
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", String)
    ], Vote.prototype, "username", void 0);
    __decorate([
        (0, typegoose_1.prop)({ required: true }),
        __metadata("design:type", Number)
    ], Vote.prototype, "value", void 0);
    var VoteValue;
    (function (VoteValue) {
        VoteValue[VoteValue["Upvote"] = 1] = "Upvote";
        VoteValue[VoteValue["Downvote"] = -1] = "Downvote";
    })(VoteValue || (VoteValue = {}));
    exports.BaseContentModel = (0, typegoose_1.getModelForClass)(BaseContent);
    exports.MediaContentModel = (0, typegoose_1.getModelForClass)(MediaContent);
    exports.ParallelFilesUploadContentModel = (0, typegoose_1.getModelForClass)(ParallelFilesUploadContent);
    exports.CommentContentModel = (0, typegoose_1.getModelForClass)(CommentContent);
    exports.ReactionContentModel = (0, typegoose_1.getModelForClass)(ReactionContent);
});
