import { hashPassword, verifyPassword } from '../../utils/HashHelper';
import jwt from 'jsonwebtoken';
import { IErrorHandlerService } from '@lst97/common_response';
import {
	AuthInvalidEmailError,
	AuthInvalidPasswordError,
	AuthRegistrationFailWithDuplicatedEmailError,
	ServerError
} from '@lst97/common-errors';
import { Request } from 'express';
import { inject, injectable } from 'inversify';
import { ErrorHandlerService } from '@lst97/common_response';
import { LoginForm } from '../../models/share/auth/forms/Login.form';
import {
	AuthUserRepository,
	IAuthUserRepository
} from '../../repositories/auth/AuthUserRepository';
import {
	IUserRepository,
	UserRepository
} from '../../repositories/user/UserRepository';
import { RegistrationForm } from '../../models/share/auth/forms/Registration.form';
import { User } from '../../models/database/User';
import { v4 as uuidv4 } from 'uuid';

export interface IAuthenticateService {
	login(form: LoginForm, req: Request): Promise<string>;
	register(form: RegistrationForm, req: Request): Promise<User>;
}

@injectable()
class AuthenticateService {
	constructor(
		@inject(AuthUserRepository)
		private authUserRepository: IAuthUserRepository,
		@inject(UserRepository)
		private userRepository: IUserRepository,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService
	) {}

	public async login(form: LoginForm, req: Request): Promise<string> {
		const authUserDbModel = await this.authUserRepository.findUserByEmail(
			form.email
		);

		if (!authUserDbModel) {
			const autError = new AuthInvalidEmailError({ request: req });

			this.errorHandlerService.handleError({
				error: autError,
				service: AuthenticateService.name
			});

			throw autError;
		}

		if (
			(await verifyPassword(
				form.password,
				authUserDbModel.passwordHash
			)) == false
		) {
			const authError = new AuthInvalidPasswordError({
				request: req
			});

			this.errorHandlerService.handleError({
				error: authError,
				service: AuthenticateService.name
			});

			throw authError;
		}

		const userDbModel = await this.userRepository.findUserByEmail(
			form.email
		);

		if (!userDbModel) {
			const profileNotFoundError = new ServerError({
				message: 'User profile not found'
			});

			this.errorHandlerService.handleError({
				error: profileNotFoundError,
				service: AuthenticateService.name
			});

			throw profileNotFoundError;
		}

		const role = 'NOT_IMPLEMENTED';
		const permission = 'NOT_IMPLEMENTED';
		const secret = process.env.ACCESS_TOKEN_SECRET!;

		const accessToken = jwt.sign(
			{
				id: authUserDbModel.id!,
				username: userDbModel.username,
				email: userDbModel.email,
				role,
				permission
			},
			secret,
			{
				expiresIn: '28d'
			}
		);

		return accessToken;
	}

	public async register(form: RegistrationForm, req: Request): Promise<User> {
		if (await this.authUserRepository.findUserByEmail(form.email)) {
			const autError = new AuthRegistrationFailWithDuplicatedEmailError({
				request: req
			});

			this.errorHandlerService.handleError({
				error: autError,
				service: AuthenticateService.name
			});

			throw autError;
		}

		await this.authUserRepository.createUser(
			uuidv4(),
			form.email,
			await hashPassword(form.password)
		);

		return await this.userRepository.create(
			new User({
				username: form.username,
				email: form.email,
				image: form.image ?? 'TEST_IMAGE'
			})
		);
	}
}

export default AuthenticateService;
