import { inject, injectable } from 'inversify';
import { ICollectionRepository } from './interfaces/ICollectionRepository';
import { Collection, CollectionModel } from '../../models/Collection';
import {
	DocumentCreationError,
	DocumentDeletionError,
	DocumentReadError,
	DocumentUpdateError
} from '../../errors/Errors';
import { DatabaseService } from '../../services/DatabaseService';

@injectable()
class CollectionRepository implements ICollectionRepository {
	constructor(
		@inject(DatabaseService) private databaseService: DatabaseService
	) {}
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
	async findById(id: string): Promise<Collection | null> {
		return new Promise((resolve, reject) => {
			CollectionModel.findById(
				id,
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
	findByUserId(userId: string): Promise<Collection[]> {
		return new Promise((resolve, reject) => {
			CollectionModel.find(
				{ userId },
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
