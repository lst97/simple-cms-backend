import { inject, injectable } from 'inversify';
import EndpointService, {
	IEndpointService
} from '../../services/endpoint/EndpointService';
import { Request, Response } from 'express';
import { DefinedBaseError, ControllerError } from '@lst97/common-errors';
import {
	ErrorHandlerService,
	IErrorHandlerService,
	ResponseService,
	IResponseService
} from '@lst97/common_response';
import CollectionController from '../collection/CollectionController';

interface IEndpointController {
	getEndpointByCollectionSlug(req: Request, res: Response): void;
}
@injectable()
class EndpointController implements IEndpointController {
	constructor(
		@inject(EndpointService) private endpointService: IEndpointService,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService,
		@inject(ResponseService) private responseService: IResponseService
	) {}

	public async getEndpointByCollectionSlug(req: Request, res: Response) {
		const slug = req.params.slug;

		try {
			const endpointModel = await this.endpointService.findEndpointBySlug(
				slug
			);

			const commonResponse = this.responseService.buildSuccessResponse(
				endpointModel,
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

export default EndpointController;
