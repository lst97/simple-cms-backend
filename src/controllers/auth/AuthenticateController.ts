import { inject, injectable } from 'inversify';
import AuthenticateService from '../../services/auth/AuthenticateService';
import { IResponseService, ResponseService } from '@lst97/common_response';
import { LoginForm } from '../../models/share/auth/forms/Login.form';
import { Request, Response, NextFunction } from 'express';
import { RegistrationForm } from '../../models/share/auth/forms/Registration.form';

export interface IAuthenticateController {
	login(req: Request, res: Response): Promise<void>;
	register(req: Request, res: Response): Promise<void>;
}
@injectable()
class AuthenticateController {
	constructor(
		private authenticateService: AuthenticateService,
		@inject(ResponseService) private responseService: IResponseService
	) {}
	public async login(req: Request, res: Response): Promise<void> {
		const loginForm = req.body as unknown as LoginForm;
		try {
			const accessToken = await this.authenticateService.login(
				loginForm,
				req
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				accessToken,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		}
	}

	public async register(req: Request, res: Response): Promise<void> {
		const registrationForm = req.body as RegistrationForm;

		try {
			const userDbModel = await this.authenticateService.register(
				registrationForm,
				req
			);
			const commonResponse = this.responseService.buildSuccessResponse(
				userDbModel,
				req.headers.requestId as string
			);

			res.status(commonResponse.httpStatus).json(commonResponse.response);
		} catch (error) {
			const commonResponse = this.responseService.buildErrorResponse(
				error as Error,
				req.headers.requestId as string
			);
		}
	}
}

export default AuthenticateController;
