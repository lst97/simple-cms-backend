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
import { BaseContent } from '../../models/share/collection/AttributeContents';
import {
	CodeTypeSetting,
	TextTypeSetting,
	TypeSetting
} from '../../models/share/collection/AttributeTypeSettings';
import { ObjectId } from 'mongodb';

export interface UpdateCollectionDataProps {
	updateAttributesContent?: BaseContent[];
	updateAttributesSetting?: TypeSetting[];
	updateCollectionInfo?: Partial<Collection>;
}

interface UpdateAttributeDataProps {
	updateAttributeContent?: BaseContent;
	updateAttributeSetting?: TypeSetting;
}
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
	updateAttribute(
		username: string,
		slug: string,
		attributeId: string,
		{
			updateAttributeContent,
			updateAttributeSetting
		}: UpdateAttributeDataProps
	): Promise<Collection | null>;

	update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null>;
	updateBySlug(
		username: string,
		slug: string,
		updateData: UpdateCollectionDataProps
	): Promise<Collection | null>;
	delete(id: string): Promise<boolean>;
	deleteAttribute(
		username: string,
		slug: string,
		attributeId: string
	): Promise<Collection | null>;
	addAttribute(
		username: string,
		slug: string,
		setting: TypeSetting,
		content: BaseContent
	): Promise<Collection | null>;
	deleteBySlug(username: string, slug: string): Promise<boolean>;

	findAll(): Promise<Collection[]>;
	findByName(collectionName: string): Promise<Collection | null>;
	findByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility?: 'public' | 'private',
		isAttributeIncluded?: boolean
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

	/**
	 * Validates the access to a collection.
	 *
	 * @param collection - The collection to validate access for.
	 * @param username - The username of the user requesting access.
	 * @throws {ServerResourceNotFoundError} If the collection is not found.
	 * @throws {AuthInvalidCredentialsError} If the user is not allowed to update the collection.
	 */
	private validateCollectionAccess(
		collection: Collection | null,
		username: string
	) {
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
	}

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

	async deleteBySlug(username: string, slug: string): Promise<boolean> {
		const collection = await this.collectionRepository.findBySlug(slug);

		if (collection === null) {
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
				message: 'You are not allowed to delete this collection'
			});
			this.errorHandlerService.handleError({
				error: invalidCredentialError,
				service: CollectionService.name
			});
			throw invalidCredentialError;
		}

		// TODO: implement transaction

		const isDeleted = await this.collectionRepository.delete(
			collection._id!
		);

		if (isDeleted) {
			await this.endpointService.deleteEndpointBySlug(
				username,
				'resources',
				slug
			);
		}

		return isDeleted;
	}

	async addAttribute(
		username: string,
		slug: string,
		setting: TypeSetting,
		content: BaseContent
	): Promise<Collection | null> {
		// original collection
		const collection = await this.collectionRepository.findBySlug(slug);

		this.validateCollectionAccess(collection, username);

		const updatedCollection = await this.collectionRepository.addAttribute(
			collection!._id!,
			new CollectionAttribute(setting, content)
		);

		return updatedCollection;
	}

	async updateAttribute(
		username: string,
		slug: string,
		attributeId: string,
		{
			updateAttributeContent,
			updateAttributeSetting
		}: UpdateAttributeDataProps
	): Promise<Collection | null> {
		// original collection
		const collection = await this.collectionRepository.findBySlug(slug);

		this.validateCollectionAccess(collection, username);

		let updatedAttribute = collection!.attributes.find(
			(attribute) => attribute._id.toHexString() === attributeId
		);

		if (updatedAttribute === undefined) {
			const resourceNotFoundError = new ServerResourceNotFoundError(
				'Attribute not found'
			);
			this.errorHandlerService.handleError({
				error: resourceNotFoundError,
				service: CollectionService.name
			});
			throw resourceNotFoundError;
		}

		updatedAttribute.setting =
			updateAttributeSetting ?? updatedAttribute.setting;
		updatedAttribute.content =
			updateAttributeContent ?? updatedAttribute.content;

		const updatedCollection =
			await this.collectionRepository.updateAttributeById(
				collection!._id!,
				updatedAttribute
			);

		return updatedCollection;
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
		visibility: 'public' | 'private' = 'public',
		isAttributeIncluded = false
	): Promise<Collection[]> {
		if (isAttributeIncluded) {
			return await this.collectionRepository.findBySlugs(slugs);
		} else {
			return await this.collectionRepository.findInfoBySlugs(slugs);
		}
	}

	async findByPrefixAndUsername(
		username: string,
		prefix: string,
		visibility: 'public' | 'private' = 'public',
		isAttributeIncluded = false
	): Promise<Collection[]> {
		const slugs = await this.endpointService.findSlugsByPrefixAndUsername(
			username,
			prefix
		);

		if (slugs === null) {
			return [];
		}

		return await this.findCollectionsBySlugs(
			slugs,
			visibility,
			isAttributeIncluded
		);
	}

	async updateBySlug(
		username: string,
		slug: string,
		{
			updateAttributesContent,
			updateAttributesSetting,
			updateCollectionInfo
		}: UpdateCollectionDataProps
	): Promise<Collection | null> {
		// original collection
		const collection = await this.collectionRepository.findBySlug(slug);

		this.validateCollectionAccess(collection, username);

		// update collection info
		let updatedCollection = collection;
		if (updateCollectionInfo) {
			updatedCollection = {
				...updatedCollection!,
				...updateCollectionInfo,
				updatedAt: new Date()
			};
		}
		if (updateAttributesContent) {
			for (const content of updateAttributesContent) {
				const attribute = updatedCollection!.attributes.find(
					(attribute) => attribute.content._id === content._id
				);
				if (attribute) {
					attribute.content = content;
				}
			}
		}
		if (updateAttributesSetting) {
			for (const setting of updateAttributesSetting) {
				const attribute = updatedCollection!.attributes.find(
					(attribute) =>
						(attribute.setting as TypeSetting)._id === setting._id
				);
				if (attribute) {
					// TODO: support change to other type
					switch ((attribute.setting as TypeSetting).type) {
						case 'text':
							(attribute.setting as TextTypeSetting) =
								setting as TextTypeSetting;
							break;
						case 'code':
							(attribute.setting as CodeTypeSetting) =
								setting as CodeTypeSetting;
					}
				}
			}
		}

		return await this.collectionRepository.update(
			collection!._id!,
			updatedCollection!
		);
	}

	async deleteAttribute(
		username: string,
		slug: string,
		attributeId: string
	): Promise<Collection | null> {
		// original collection
		const collection = await this.collectionRepository.findBySlug(slug);

		this.validateCollectionAccess(collection, username);

		const updatedCollection =
			await this.collectionRepository.deleteAttribute(
				collection!._id!,
				new ObjectId(attributeId)
			);
		return updatedCollection;
	}

	async update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null> {
		const updatedCollection = await this.collectionRepository.update(
			new ObjectId(id),
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

		this.validateCollectionAccess(collection, username);

		const updatedCollection =
			await this.collectionRepository.updateAttributesContent(
				collection!._id!,
				updateData
			);
		return updatedCollection;
	}

	async delete(id: string): Promise<boolean> {
		const isDeleted = await this.collectionRepository.delete(
			new ObjectId(id)
		);
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
