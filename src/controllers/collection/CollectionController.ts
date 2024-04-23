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
import { ControllerError, DefinedBaseError } from '@lst97/common-errors';
import { CollectionForm } from '../../models/share/collection/CollectionForm';

export interface ICollectionController {
	createCollection(req: Request, res: Response): Promise<void>;
}
@injectable()
class CollectionController implements ICollectionController {
	constructor(
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
				createCollectionForm
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
}

export default CollectionController;
