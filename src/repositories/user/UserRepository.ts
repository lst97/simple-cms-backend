import { injectable } from 'inversify';
import { DocumentCreationError, DocumentReadError } from '../../errors/Errors';
import { User, UserModel } from '../../models/database/User';

export interface IUserRepository {
	create(user: User): Promise<User>;
	findUserByEmail(email: string): Promise<User | null>;
}

@injectable()
export class UserRepository {
	constructor() {}
	public async create(user: User): Promise<User> {
		try {
			return await new UserModel(user).save();
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentCreationError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}

	public async findUserByEmail(email: string): Promise<User | null> {
		try {
			return await UserModel.findOne({ email });
		} catch (error) {
			if (error instanceof Error)
				throw new DocumentReadError({
					message: error.message,
					cause: error
				});
			else throw error;
		}
	}
}
