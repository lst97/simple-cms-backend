import { injectable, inject } from 'inversify';
import { Collection } from '../../models/share/collection/Collection';
import CollectionRepository from '../../repositories/collection/CollectionRepository';
import { CollectionForm } from '../../models/forms/CollectionForm';
import { ICollectionRepository } from '../../repositories/collection/interfaces/ICollectionRepository';
import { User } from '../../models/database/User';
import EndpointService, { IEndpointService } from '../endpoint/EndpointService';
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';
import {
	AuthInvalidCredentialsError,
	ServerResourceNotFoundError
} from '@lst97/common-errors';
import { ErrorHandlerService } from '@lst97/common_response';

export interface ICollectionService {
	create(
		collectionData: CollectionForm,
		createdBy: User
	): Promise<Collection | null>;
	findBySlug(slug: string): Promise<Collection | null>;
	findById(id: string): Promise<Collection | null>;
	findByUsername(userId: string): Promise<Collection[]>;
	updateAttributesContent(
		username: string,
		slug: string,
		updateData: Partial<CollectionAttribute[]>
	): Promise<Collection | null>;
	update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null>;
	delete(id: string): Promise<boolean>;
	findAll(): Promise<Collection[]>;
	findByName(collectionName: string): Promise<Collection | null>;
	findByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility?: 'public' | 'private'
	): Promise<Collection[]>;
}
@injectable()
class CollectionService implements ICollectionService {
	constructor(
		@inject(CollectionRepository)
		private collectionRepository: ICollectionRepository,
		@inject(EndpointService)
		private endpointService: IEndpointService,
		@inject(ErrorHandlerService)
		private errorHandlerService: ErrorHandlerService
	) {}

	async create(form: CollectionForm, user: User): Promise<Collection | null> {
		// TODO: implement transaction
		const newCollection = await this.collectionRepository.create(
			new Collection(user.username, form)
		);

		if (
			(await this.endpointService.createEndpoint(
				user.username,
				'resources',
				newCollection.slug
			)) === null
		) {
			return null;
		}

		return newCollection;
	}
	async findBySlug(slug: string): Promise<Collection | null> {
		const collection = await this.collectionRepository.findBySlug(slug);
		return collection;
	}
	async findById(id: string): Promise<Collection | null> {
		const collection = await this.collectionRepository.findById(id);
		return collection;
	}

	async findByUsername(username: string): Promise<Collection[]> {
		return await this.collectionRepository.findByUsername(username);
	}

	private async findCollectionsBySlugs(
		slugs: string[],
		visibility: 'public' | 'private' = 'public'
	): Promise<Collection[]> {
		return await this.collectionRepository.findBySlugs(slugs);
	}

	async findByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility: 'public' | 'private' = 'public'
	): Promise<Collection[]> {
		const slugs = await this.endpointService.findSlugsByPrefixAndUsername(
			username,
			prefix
		);

		if (slugs === null) {
			return [];
		}

		return await this.findCollectionsBySlugs(slugs, visibility);
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

	async updateAttributesContent(
		username: string,
		slug: string,
		updateData: Partial<CollectionAttribute[]>
	): Promise<Collection | null> {
		// check if the user have the permission to update the collection
		const collection = await this.collectionRepository.findBySlug(slug);

		if (collection === null || collection._id === undefined) {
			const resourceNotFoundError = new ServerResourceNotFoundError(
				'Collection not found'
			);
			this.errorHandlerService.handleError({
				error: resourceNotFoundError,
				service: CollectionService.name
			});
			throw resourceNotFoundError;
		}

		if (collection.username !== username) {
			const invalidCredentialError = new AuthInvalidCredentialsError({
				message: 'You are not allowed to update this collection'
			});
			this.errorHandlerService.handleError({
				error: invalidCredentialError,
				service: CollectionService.name
			});
			throw invalidCredentialError;
		}

		const updatedCollection =
			await this.collectionRepository.updateAttributesContent(
				collection._id,
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
