import { IErrorHandlerService } from '@lst97/common_response';
import { inject, injectable } from 'inversify';
import { ErrorHandlerService } from '@lst97/common_response';
import {
	IUserRepository,
	UserRepository
} from '../repositories/user/UserRepository';
import { User } from '../models/database/User';

export interface IUserService {
	getUserByEmail(email: string): Promise<User | null>;
}
@injectable()
class UserService {
	constructor(
		@inject(UserRepository)
		private userRepository: IUserRepository,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService
	) {}

	public async getUserByEmail(email: string): Promise<User | null> {
		return await this.userRepository.findUserByEmail(email);
	}
}

export default UserService;
