import { inject, injectable } from 'inversify';
import CollectionService, {
	ICollectionService
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
import { CollectionAttribute } from '../../models/share/collection/CollectionAttributes';

export interface ICollectionController {
	createCollection(req: Request, res: Response): Promise<void>;
	getCollections(req: Request, res: Response): Promise<void>;
	getAttributes(req: Request, res: Response): Promise<void>;
	updateCollectionAttributesContent(
		req: Request,
		res: Response
	): Promise<void>;
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

	public async updateCollectionAttributesContent(
		req: Request,
		res: Response
	): Promise<void> {
		const slug = req.params.slug as string;
		const updateCollectionAttributes = req.body as CollectionAttribute[];

		try {
			const collectionModel =
				await this.collectionService.updateAttributesContent(
					(req.user as User).username,
					slug,
					updateCollectionAttributes
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

	public async getAttributes(req: Request, res: Response): Promise<void> {
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
