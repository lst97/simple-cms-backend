import { inject, injectable } from 'inversify';
import {
	DatabaseService,
	IDatabaseService,
	ISQLite3QueryService,
	SQLite3QueryService
} from '../../services/DatabaseService';
import { SqlReadError } from '@lst97/common-errors';
import { AuthUserDbModel, IAuthUser } from '../../models/database/User';

export interface IAuthUserRepository {
	findUserByEmail(email: string): Promise<AuthUserDbModel | null>;
	createUser(id: string, email: string, password: string): Promise<IAuthUser>;
	updateUser(email: string, password: string): Promise<IAuthUser>;
	deleteUser(email: string): Promise<void>;
}
@injectable()
export class AuthUserRepository {
	constructor(
		@inject(DatabaseService) private databaseService: IDatabaseService,
		@inject(SQLite3QueryService) private queryService: ISQLite3QueryService
	) {}
	async findUserByEmail(email: string) {
		const result = (await this.queryService.getWithSqlErrorHandlingAsync(
			this.databaseService.sqlite3Client,
			'SELECT * FROM Users WHERE email = ?',
			[email],
			SqlReadError
		)) as any;

		return new AuthUserDbModel({
			id: result.id,
			email: result.email,
			passwordHash: result.password_hash
		});
	}

	async createUser(id: string, email: string, hash: string) {
		return (await this.queryService.runWithSqlErrorHandlingAsync(
			this.databaseService.sqlite3Client,
			'INSERT INTO Users (id, email, password_hash) VALUES (?, ?, ?)',
			[id, email, hash],
			SqlReadError
		)) as IAuthUser;
	}

	async updateUser(email: string, hash: string) {
		return (await this.queryService.runWithSqlErrorHandlingAsync(
			this.databaseService.sqlite3Client,
			'UPDATE Users SET password_hash = ? WHERE email = ?',
			[hash, email],
			SqlReadError
		)) as IAuthUser;
	}

	async deleteUser(email: string) {
		// need to communicate with mongodb
		return null;
	}
}
