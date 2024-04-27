import { inject, injectable } from 'inversify';
import AuthenticateService from '../../services/auth/AuthenticateService';
import { IResponseService, ResponseService } from '@lst97/common_response';
import { LoginForm } from '../../models/share/auth/forms/Login.form';
import { Request, Response, NextFunction } from 'express';
import { RegistrationForm } from '../../models/share/auth/forms/Registration.form';

export interface IUserController {
	getUser(req: Request, res: Response): Promise<void>;
}
@injectable()
export class UserController {
	constructor() {}

	public async getUserInformation(
		req: Request,
		res: Response
	): Promise<void> {
		try {
			res.status(200).json({ message: 'User information' });
		} catch (error) {
			res.status(500).json({ message: 'Internal server error' });
		}
	}
}

export default UserController;
