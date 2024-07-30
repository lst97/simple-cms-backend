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
        define(["require", "exports", "inversify", "../../models/share/collection/Collection", "../../errors/Errors"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const inversify_1 = require("inversify");
    const Collection_1 = require("../../models/share/collection/Collection");
    const Errors_1 = require("../../errors/Errors");
    let CollectionRepository = class CollectionRepository {
        constructor() { }
        async create(collection) {
            try {
                return Collection_1.CollectionModel.create(collection);
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Errors_1.DocumentCreationError({
                        message: error.message,
                        cause: error
                    });
                else
                    throw error;
            }
        }
        async findInfoBySlugs(slugs) {
            return Collection_1.CollectionModel.find({ slug: { $in: slugs } }, { attributes: 0 });
        }
        async updateAttributeById(id, attribute) {
            try {
                const updatedCollection = await Collection_1.CollectionModel.findOneAndUpdate({ _id: id }, // Filter the document by ID
                [
                    {
                        $set: {
                            // Update the specific attribute within the array
                            attributes: {
                                $map: {
                                    input: '$attributes', // Iterate over the existing attributes array
                                    as: 'attribute',
                                    in: {
                                        // Conditionally update based on _id
                                        $cond: {
                                            if: {
                                                $eq: [
                                                    '$$attribute._id',
                                                    attribute._id
                                                ]
                                            }, // Replace attributeId with the actual ID
                                            then: { ...attribute }, // New attribute data
                                            else: '$$attribute' // Keep the original attribute
                                        }
                                    }
                                }
                            }
                        }
                    }
                ], { new: true } // Return the updated document
                );
                return updatedCollection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentUpdateError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error; // Rethrow the unknown error
                }
            }
        }
        async addAttribute(id, attribute) {
            try {
                const updatedCollection = await Collection_1.CollectionModel.findByIdAndUpdate(id, { $push: { attributes: attribute } }, { new: true });
                return updatedCollection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentUpdateError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error; // Rethrow the unknown error
                }
            }
        }
        async findBySlugs(slugs) {
            return Collection_1.CollectionModel.find({
                slug: { $in: slugs }
            });
        }
        async findBySlug(slug) {
            return Collection_1.CollectionModel.findOne({ slug });
        }
        async findById(id) {
            return Collection_1.CollectionModel.findById(id);
        }
        findByUsername(username) {
            return Collection_1.CollectionModel.find({ username });
        }
        async update(id, updateData) {
            return new Promise((resolve, reject) => {
                Collection_1.CollectionModel.findByIdAndUpdate(id, updateData, (error, collection) => {
                    if (error) {
                        if (error instanceof Error)
                            reject(new Errors_1.DocumentUpdateError({
                                message: error.message,
                                cause: error
                            }));
                        else
                            reject(error);
                    }
                    else
                        resolve(collection);
                });
            });
        }
        async deleteAttribute(id, attributeId) {
            try {
                const updatedCollection = await Collection_1.CollectionModel.findByIdAndUpdate(id, { $pull: { attributes: { _id: attributeId } } }, { new: true });
                return updatedCollection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentUpdateError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error; // Rethrow the unknown error
                }
            }
        }
        async updateAttributesContent(id, updateData) {
            try {
                const updatedCollection = await Collection_1.CollectionModel.findByIdAndUpdate(id, { $set: { attributes: updateData } }, { new: true });
                return updatedCollection;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Errors_1.DocumentUpdateError({
                        message: error.message,
                        cause: error
                    });
                }
                else {
                    throw error; // Rethrow the unknown error
                }
            }
        }
        async delete(id) {
            try {
                const result = await Collection_1.CollectionModel.deleteOne({ _id: id });
                return result.deletedCount === 1;
            }
            catch (error) {
                if (error instanceof Error)
                    throw new Errors_1.DocumentDeletionError({
                        message: error.message,
                        cause: error
                    });
                else
                    throw error;
            }
        }
        findAll() {
            return new Promise((resolve, reject) => {
                Collection_1.CollectionModel.find((error, collections) => {
                    if (error) {
                        if (error instanceof Error)
                            reject(new Errors_1.DocumentReadError({
                                message: error.message,
                                cause: error
                            }));
                        else
                            reject(error);
                    }
                    else
                        resolve(collections);
                });
            });
        }
        findByName(collectionName) {
            return new Promise((resolve, reject) => {
                Collection_1.CollectionModel.findOne({ collectionName }, (error, collection) => {
                    if (error) {
                        if (error instanceof Error)
                            reject(new Errors_1.DocumentReadError({
                                message: error.message,
                                cause: error
                            }));
                        else
                            reject(error);
                    }
                    else
                        resolve(collection);
                });
            });
        }
    };
    CollectionRepository = __decorate([
        (0, inversify_1.injectable)(),
        __metadata("design:paramtypes", [])
    ], CollectionRepository);
    exports.default = CollectionRepository;
});
