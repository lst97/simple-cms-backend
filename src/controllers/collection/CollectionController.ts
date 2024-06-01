import { inject, injectable } from 'inversify';
import CollectionService, {
	ICollectionService,
	ParallelUploadMetadataProps
} from '../../services/collection/CollectionService';
import {
	ErrorHandlerService,
	IErrorHandlerService,
	IResponseService,
	ResponseService
} from '@lst97/common_response';
import { Request, Response } from 'express';
import {
	ControllerError,
	DefinedBaseError,
	ServerResourceNotFoundError
} from '@lst97/common-errors';
import { CollectionForm } from '../../models/forms/CollectionForm';
import { User } from '../../models/database/User';
import EndpointService, {
	IEndpointService
} from '../../services/endpoint/EndpointService';
import { BaseContent } from '../../models/share/collection/AttributeContents';
import { TypeSetting } from '../../models/share/collection/AttributeTypeSettings';
import { Collection } from '../../models/share/collection/Collection';
import { MediaTypes } from '../../schemas/collection/BaseSchema';

export interface ICollectionController {
	createCollection(req: Request, res: Response): Promise<void>;
	getCollections(req: Request, res: Response): Promise<void>;
	getCollectionAttributes(req: Request, res: Response): Promise<void>;
	updateCollection(req: Request, res: Response): Promise<void>;
	updateCollectionAttribute(req: Request, res: Response): Promise<void>;
	deleteCollectionAttribute(req: Request, res: Response): Promise<void>;
	addCollectionAttribute(req: Request, res: Response): Promise<void>;
	getCollectionsByPrefixAndUsername(
		req: Request,
		res: Response
	): Promise<void>;
	getCollectionBySlug(req: Request, res: Response): Promise<void>;
	deleteCollection(req: Request, res: Response): Promise<void>;
}
@injectable()
class CollectionController implements ICollectionController {
	constructor(
		@inject(EndpointService)
		private endpointService: IEndpointService,
		@inject(CollectionService)
		private collectionService: ICollectionService,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService,
		@inject(ResponseService) private responseService: IResponseService
	) {}

	public async createCollection(req: Request, res: Response): Promise<void> {
		const createCollectionForm = req.body as CollectionForm;

		try {
			const collectionModel = await this.collectionService.create(
				createCollectionForm,
				req.user as User
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async deleteCollection(req: Request, res: Response): Promise<void> {
		const slug = req.params.slug as string;
		const username = (req.user as User).username;

		try {
			const collectionModel = await this.collectionService.deleteBySlug(
				username,
				slug
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async getCollectionBySlug(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug as string;

		try {
			const collection = await this.collectionService.findBySlug(slug);
			const commonResponse = this.responseService.buildSuccessResponse(
				collection,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async deleteCollectionAttribute(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug as string;
		const attributeId = req.params.id as string;
		const username = (req.user as User).username;

		try {
			const collectionModel =
				await this.collectionService.deleteAttribute(
					username,
					slug,
					attributeId
				);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async addCollectionAttribute(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug;
		const user = req.user as User;

		const newAttributeContent = req.body.content as BaseContent;
		const newAttributeSetting = req.body.setting as TypeSetting;

		try {
			const collectionModel = await this.collectionService.addAttribute(
				user.username,
				slug,
				newAttributeSetting,
				newAttributeContent
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async updateCollectionAttribute(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug;
		const attributeId = req.params.id;
		const user = req.user as User;

		// parallel upload
		const sessionId = req.query.sessionId as string;
		const total = req.query.total as string;
		const groupId = req.query.groupId as string;
		const type = req.query.type as MediaTypes;

		let updateAttributeContent: BaseContent | undefined = undefined;
		let updateAttributeSetting: TypeSetting | undefined = undefined;
		let parallelMetadata: ParallelUploadMetadataProps | undefined =
			undefined;

		if (req.query.content === 'true') {
			if (req.body.value?._id !== undefined) {
				updateAttributeContent = req.body.value as BaseContent;
			} else {
				updateAttributeContent = new BaseContent(req.body.value);
			}
		}
		if (req.query.setting === 'true') {
			updateAttributeSetting = req.body.setting as TypeSetting;
		}

		if (sessionId && total) {
			parallelMetadata = {
				sessionId: sessionId,
				total: parseInt(total),
				nameMap: new Map(Object.entries(req.body.fileNameMap)),
				groupId: groupId,
				type: type
			};
		}

		try {
			const collectionModel =
				await this.collectionService.updateAttribute(
					user.username,
					slug,
					attributeId,
					{
						updateAttributeContent: updateAttributeContent,
						updateAttributeSetting: updateAttributeSetting
					},
					parallelMetadata
				);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async updateCollection(req: Request, res: Response): Promise<void> {
		const slug = req.params.slug as string;

		let updateCollectionAttributesContent: BaseContent[] = [];
		let updateCollectionAttributesSettings: TypeSetting[] = [];
		let updateCollectionInfo: Partial<Collection> = {};

		if (req.body.content === 'true') {
			updateCollectionAttributesContent = req.body as BaseContent[];
		}
		if (req.body.settings === 'true') {
			updateCollectionAttributesSettings = req.body as TypeSetting[];
		}
		if (req.body.info === 'true') {
			updateCollectionInfo = req.body as Partial<Collection>;
		}

		try {
			const collectionModel = await this.collectionService.updateBySlug(
				(req.user as User).username,
				slug,
				{
					updateAttributesContent: updateCollectionAttributesContent,
					updateAttributesSetting: updateCollectionAttributesSettings,
					updateCollectionInfo: updateCollectionInfo
				}
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				collectionModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async getCollections(req: Request, res: Response): Promise<void> {
		try {
			const collections = await this.collectionService.findByUsername(
				(req.user! as User).username
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				collections,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	// prefix = subdirectory
	public async getCollectionsByPrefixAndUsername(
		req: Request,
		res: Response
	): Promise<void> {
		const prefix = (req.params[0] as string) + '/';
		const username = req.params.username as string;

		// need to check query schema
		const includeAttributes = req.query.attributes as string | undefined;
		// should replaced by schema
		if (
			includeAttributes !== undefined &&
			includeAttributes !== 'true' &&
			includeAttributes !== 'false'
		) {
			const commonResponse = this.responseService.buildErrorResponse(
				new Error('Invalid query schema'),
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
			return;
		}

		try {
			let visibility: 'public' | 'private' = 'public';

			// This is not working now, because the passport middleware is not used in this route
			if (req.user && (req.user as User).username === username) {
				visibility = 'private';
			}

			const collections =
				await this.collectionService.findByPrefixAndUsername(
					username,
					prefix,
					visibility,
					includeAttributes === 'true'
				);

			const commonResponse = this.responseService.buildSuccessResponse(
				collections,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async getCollectionAttributes(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug as string;

		const endpoint = await this.endpointService.findEndpointBySlug(slug);
		if (
			endpoint === null ||
			endpoint.method !== 'GET' ||
			endpoint.status === 'draft' ||
			endpoint.visibility === 'private'
		) {
			const commonResponse = this.responseService.buildErrorResponse(
				new ServerResourceNotFoundError('Resource not found'),
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
			return;
		}

		try {
			const collections = await this.collectionService.findBySlug(slug);

			const commonResponse = this.responseService.buildSuccessResponse(
				collections?.attributes,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			if (!(error instanceof DefinedBaseError)) {
				this.errorHandlerService.handleUnknownControllerError({
					error: error as Error,
					service: CollectionController.name,
					errorType: ControllerError
				});
			}

			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.id
			);
			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}
}

export default CollectionController;
