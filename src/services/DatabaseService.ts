import { ServerError, UnknownError } from '@lst97/common-errors';
import { injectable } from 'inversify';
import { MongoClient } from 'mongodb';
import appConfig from '../configs/config';
import { mongoose } from '@typegoose/typegoose';

const closeMongoConnection = async (client: MongoClient): Promise<void> => {
	try {
		await client.close();
		await mongoose.connection.close();
		console.log('Disconnected from MongoDB');
	} catch (err) {
		if (err instanceof Error) {
			throw new ServerError({
				message: err.message,
				cause: err
			});
		}
		throw new UnknownError({
			message: 'An error occurred while disconnecting from the database.',
			cause: err as Error
		});
	}
};

const addProcessExitListener = (client: MongoClient): void => {
	// Close the connection when the application exits
	process.on('exit', async () => {
		await closeMongoConnection(client);
	});

	process.on('SIGINT', async () => {
		await closeMongoConnection(client);
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		await closeMongoConnection(client);
		process.exit(0);
	});
};

export interface IDatabaseService {
	client: MongoClient;
	closeConnection(): Promise<void>;
}
@injectable()
export class DatabaseService {
	private _client: MongoClient;

	constructor() {
		try {
			this._client = new MongoClient(appConfig.database.connectionString);
			mongoose.connect(appConfig.database.connectionString);
			console.log(
				`Connected to MongoDB ${appConfig.database.connectionString}`
			);
			addProcessExitListener(this._client);
		} catch (error) {
			if (error instanceof Error) {
				throw new ServerError({ message: error.message, cause: error });
			} else {
				throw new UnknownError({
					message:
						'An error occurred while connecting to the database.',
					cause: error as Error
				});
			}
		}
	}

	public async closeConnection(): Promise<void> {
		await closeMongoConnection(this._client);
	}

	public get client(): MongoClient {
		return this._client;
	}
}
