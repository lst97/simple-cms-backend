import { injectable } from 'inversify';
import { ICollectionRepository } from './interfaces/ICollectionRepository';
import {
	Collection,
	CollectionModel
} from '../../models/share/collection/Collection';
import {
	DocumentCreationError,
	DocumentDeletionError,
	DocumentReadError,
	DocumentUpdateError
} from '../../errors/Errors';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';
import { ObjectId } from 'mongodb';

@injectable()
class CollectionRepository implements ICollectionRepository {
	constructor() {}
	async create(collection: Collection): Promise<Collection> {
		try {
			return CollectionModel.create(collection);
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}

	async findInfoBySlugs(slugs: string[]): Promise<Collection[]> {
		return CollectionModel.find(
			{ slug: { $in: slugs } },
			{ attributes: 0 }
		);
	}

	async updateAttributeById(
		id: ObjectId,
		attribute: CollectionAttribute
	): Promise<Collection | null> {
		try {
			const updatedCollection = await CollectionModel.findOneAndUpdate(
				{ _id: id }, // Filter the document by ID
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
				],
				{ new: true } // Return the updated document
			);

			return updatedCollection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentUpdateError({
					message: error.message,
					cause: error
				});
			} else {
				throw error; // Rethrow the unknown error
			}
		}
	}

	async addAttribute(
		id: ObjectId,
		attribute: CollectionAttribute
	): Promise<Collection | null> {
		try {
			const updatedCollection = await CollectionModel.findByIdAndUpdate(
				id,
				{ $push: { attributes: attribute } },
				{ new: true }
			);
			return updatedCollection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentUpdateError({
					message: error.message,
					cause: error
				});
			} else {
				throw error; // Rethrow the unknown error
			}
		}
	}
	async findBySlugs(slugs: string[]): Promise<Collection[]> {
		return CollectionModel.find({
			slug: { $in: slugs }
		});
	}

	async findBySlug(slug: string): Promise<Collection | null> {
		return CollectionModel.findOne({ slug });
	}
	async findById(id: string): Promise<Collection | null> {
		return CollectionModel.findById(id);
	}
	findByUsername(username: string): Promise<Collection[]> {
		return CollectionModel.find({ username });
	}
	async update(
		id: ObjectId,
		updateData: Partial<Collection>
	): Promise<Collection | null> {
		return new Promise((resolve, reject) => {
			CollectionModel.findByIdAndUpdate(
				id,
				updateData,
				(error: unknown, collection: Collection) => {
					if (error) {
						if (error instanceof Error)
							reject(
								new DocumentUpdateError({
									message: error.message,
									cause: error
								})
							);
						else reject(error);
					} else resolve(collection);
				}
			);
		});
	}

	async deleteAttribute(
		id: ObjectId,
		attributeId: ObjectId
	): Promise<Collection | null> {
		try {
			const updatedCollection = await CollectionModel.findByIdAndUpdate(
				id,
				{ $pull: { attributes: { _id: attributeId } } },
				{ new: true }
			);
			return updatedCollection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentUpdateError({
					message: error.message,
					cause: error
				});
			} else {
				throw error; // Rethrow the unknown error
			}
		}
	}

	async updateAttributesContent(
		id: ObjectId,
		updateData: Partial<CollectionAttribute[]>
	): Promise<Collection | null> {
		try {
			const updatedCollection = await CollectionModel.findByIdAndUpdate(
				id,
				{ $set: { attributes: updateData } },
				{ new: true }
			);
			return updatedCollection;
		} catch (error) {
			if (error instanceof Error) {
				throw new DocumentUpdateError({
					message: error.message,
					cause: error
				});
			} else {
				throw error; // Rethrow the unknown error
			}
		}
	}

	async delete(id: ObjectId): Promise<boolean> {
		try {
			const result = await CollectionModel.deleteOne({ _id: id });
			return result.deletedCount === 1;
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentDeletionError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}
	findAll(): Promise<Collection[]> {
		return new Promise((resolve, reject) => {
			CollectionModel.find(
				(error: unknown, collections: Collection[]) => {
					if (error) {
						if (error instanceof Error)
							reject(
								new DocumentReadError({
									message: error.message,
									cause: error
								})
							);
						else reject(error);
					} else resolve(collections);
				}
			);
		});
	}
	findByName(collectionName: string): Promise<Collection | null> {
		return new Promise((resolve, reject) => {
			CollectionModel.findOne(
				{ collectionName },
				(error: unknown, collection: Collection) => {
					if (error) {
						if (error instanceof Error)
							reject(
								new DocumentReadError({
									message: error.message,
									cause: error
								})
							);
						else reject(error);
					} else resolve(collection);
				}
			);
		});
	}
}

export default CollectionRepository;
