import { injectable, inject } from 'inversify';
import { Collection } from '../../models/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { GeneratorsUtil } from '../../utils/Generators';
import { CollectionForm } from '../../models/share/collection/CollectionForm';
import { ICollectionRepository } from '../../repositories/collection/interfaces/ICollectionRepository';

export interface ICollectionService {
	create(collectionData: CollectionForm): Promise<Collection>;
	findById(id: string): Promise<Collection | null>;
	findByUserId(userId: string): Promise<Collection[]>;
	update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null>;
	delete(id: string): Promise<boolean>;
	findAll(): Promise<Collection[]>;
	findByName(collectionName: string): Promise<Collection | null>;
}
@injectable()
class CollectionService implements ICollectionService {
	constructor(
		@inject(CollectionRepository)
		private collectionRepository: ICollectionRepository
	) {}

	async create(form: CollectionForm): Promise<Collection> {
		return await this.collectionRepository.create(
			new Collection(form) as Collection
		);
	}

	async findById(id: string): Promise<Collection | null> {
		const collection = await this.collectionRepository.findById(id);
		return collection;
	}

	async findByUserId(userId: string): Promise<Collection[]> {
		const collections = await this.collectionRepository.findByUserId(
			userId
		);
		return collections;
	}

	async update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null> {
		const updatedCollection = await this.collectionRepository.update(
			id,
			updateData
		);
		return updatedCollection;
	}

	async delete(id: string): Promise<boolean> {
		const isDeleted = await this.collectionRepository.delete(id);
		return isDeleted;
	}

	async findAll(): Promise<Collection[]> {
		const collections = await this.collectionRepository.findAll();
		return collections;
	}

	async findByName(collectionName: string): Promise<Collection | null> {
		const collection = await this.collectionRepository.findByName(
			collectionName
		);
		return collection;
	}
}

export default CollectionService;
