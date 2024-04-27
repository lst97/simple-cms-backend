import {
	IRequestValidationMiddlewareService,
	RequestBodyValidationStrategy,
	RequestValidationMiddlewareService
} from '@lst97/express-common-middlewares';
import express from 'express';
import { inject, injectable } from 'inversify';
import { AuthSchema } from '../schemas/AuthSchema';
import AuthenticateController, {
	IAuthenticateController
} from '../controllers/auth/AuthenticateController';
import IBaseRoutes from './IBaseRoutes';

@injectable()
class AuthenticateRoutes implements IBaseRoutes {
	private router: express.Router;

	public get routers(): express.Router {
		return this.router;
	}

	constructor(
		@inject(AuthenticateController)
		private authController: IAuthenticateController,
		@inject(RequestValidationMiddlewareService)
		private requestValidationMiddleware: IRequestValidationMiddlewareService
	) {
		this.router = express.Router();
		this.configureRoutes();
	}

	private configureRoutes(): void {
		this.router.post(
			'/auth/login',
			this.requestValidationMiddleware.requestValidator(
				new RequestBodyValidationStrategy(AuthSchema.loginFormSchema)
			),
			(req, res) => this.authController.login(req, res)
		);
		this.router.post(
			'/auth/register',
			this.requestValidationMiddleware.requestValidator(
				new RequestBodyValidationStrategy(
					AuthSchema.registrationFormSchema
				)
			),
			(req, res) => this.authController.register(req, res)
		);
	}
}

export default AuthenticateRoutes;
