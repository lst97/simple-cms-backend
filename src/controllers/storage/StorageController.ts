import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { DefinedBaseError, ControllerError } from '@lst97/common-errors';
import {
	ErrorHandlerService,
	IErrorHandlerService,
	ResponseService,
	IResponseService
} from '@lst97/common_response';
import CollectionController from '../collection/CollectionController';
import {
	IStorageManagerService,
	StorageManagerService
} from '../../services/StorageManagerService';

export interface IStorageController {
	getFile(req: Request, res: Response): void;
}
@injectable()
class StorageController implements IStorageController {
	constructor(
		@inject(StorageManagerService)
		private storageManagerService: IStorageManagerService,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService,
		@inject(ResponseService) private responseService: IResponseService
	) {}

	public async getFile(req: Request, res: Response) {
		try {
			const { username, fileId } = req.params; // Extract parameters from the request
			const filePath = this.storageManagerService.getFile(
				username,
				fileId
			);

			res.sendFile(filePath);
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

export default StorageController;
