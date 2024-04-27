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
			return await new CollectionModel(collection).save();
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
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
	update(
		id: string,
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

	delete(id: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			CollectionModel.findByIdAndDelete(id, (error: unknown) => {
				if (error) {
					if (error instanceof Error)
						reject(
							new DocumentDeletionError({
								message: error.message,
								cause: error
							})
						);
					else reject(error);
				} else resolve(true);
			});
		});
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
