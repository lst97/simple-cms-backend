import { DatabaseError, ServerError, UnknownError } from '@lst97/common-errors';
import { inject, injectable } from 'inversify';
import { ClientSession, MongoClient } from 'mongodb';

import { mongoose } from '@typegoose/typegoose';
import sqlite3, { Database } from 'sqlite3';
import {
	ErrorHandlerService,
	IErrorHandlerService
} from '@lst97/common_response';
import appConfig from '../configs/Config';

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

const closeSqliteConnection = async (client: Database): Promise<void> => {
	client.close((error: Error | null) => {
		if (error) {
			throw new ServerError({
				message: error.message,
				cause: error
			});
		} else {
			console.log('Database connection closed');
		}
	});
};

const addProcessExitListener = (
	mongoClient: MongoClient,
	sqlite3Client: Database
): void => {
	// Close the connection when the application exits
	process.on('exit', async () => {
		await closeMongoConnection(mongoClient);
		await closeSqliteConnection(sqlite3Client);
	});

	process.on('SIGINT', async () => {
		await closeMongoConnection(mongoClient);
		await closeSqliteConnection(sqlite3Client);
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		await closeMongoConnection(mongoClient);
		await closeSqliteConnection(sqlite3Client);
		process.exit(0);
	});
};

export interface IDatabaseService {
	mongoClient: MongoClient;
	sqlite3Client: Database;
	closeConnection(): Promise<void>;
}
@injectable()
export class DatabaseService implements IDatabaseService {
	private _mongodb_client: MongoClient;
	private _sqlite3_client: any;

	constructor() {
		try {
			this._mongodb_client = new MongoClient(
				appConfig.database.mongodbConnectionString
			);
			this._sqlite3_client = new sqlite3.Database(
				appConfig.database.sqlite3ConnectionString,
				(error) => {
					if (error) {
						throw error;
					}
				}
			);
			mongoose.connect(appConfig.database.mongodbConnectionString);
			console.log(
				`SQLite3 database connection established at ${appConfig.database.sqlite3ConnectionString}`
			);
			console.log(
				`Connected to MongoDB ${appConfig.database.mongodbConnectionString}`
			);
			addProcessExitListener(this._mongodb_client, this._sqlite3_client);
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
		await closeMongoConnection(this._mongodb_client);
		await closeSqliteConnection(this._sqlite3_client);
	}

	public get mongoClient(): MongoClient {
		return this._mongodb_client;
	}

	public get sqlite3Client(): Database {
		return this._sqlite3_client;
	}
}

/**
 * Represents a transaction for SQLite3 database operations.
 */
class SQLite3Transaction {
	private databaseService: DatabaseService;

	constructor(databaseService: DatabaseService) {
		this.databaseService = databaseService;
	}

	/**
	 * Begins a transaction asynchronously with error handling.
	 * @returns A Promise that resolves to a Database object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */
	async beginTransactionAsyncWithErrorHandling(): Promise<Database> {
		try {
			const db = this.databaseService.sqlite3Client;
			return await beginTransactionAsync(db);
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}

	/**
	 * Commits a transaction asynchronously with error handling.
	 * @param db - The Database object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */
	static async commitTransactionAsyncWithErrorHandling(
		db: Database
	): Promise<void> {
		try {
			await commitTransactionAsync(db);
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}

	/**
	 * Rolls back a transaction asynchronously with error handling.
	 * @param db - The Database object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */
	static async rollbackTransactionAsyncWithErrorHandling(
		db: Database
	): Promise<void> {
		try {
			await rollbackTransactionAsync(db);
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}
}

function beginTransactionAsync(db: Database): Promise<Database> {
	return new Promise((resolve, reject) => {
		db.serialize(() => {
			db.run('BEGIN', (err) => {
				if (err) {
					reject(err);
				}
				resolve(db);
			});
		});
	});
}

function commitTransactionAsync(db: Database): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run('COMMIT', (err) => {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
}

function rollbackTransactionAsync(db: Database): Promise<void> {
	return new Promise((resolve, reject) => {
		db.run('ROLLBACK', (err) => {
			if (err) {
				reject(err);
			}
			resolve();
		});
	});
}

export interface ISQLite3QueryService {
	beginTransactionAsync(): Promise<Database>;
	commitTransactionAsync(db: Database): Promise<void>;
	rollbackTransactionAsync(db: Database): Promise<void>;
	runWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError
	): Promise<T>;
	getWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError
	): Promise<T>;
	allWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError
	): Promise<T[]>;
}
/**
 * Service for executing SQL queries with error handling using SQLite3.
 */
@injectable()
export class SQLite3QueryService {
	constructor(
		private databaseService: DatabaseService,
		@inject(ErrorHandlerService)
		private errorHandlerService: IErrorHandlerService
	) {}

	/**
	 * Begins a transaction asynchronously.
	 * @returns A Promise that resolves to a Database object representing the transaction.
	 * @example
	 * const db = await databaseService.beginTransactionAsync();
	 * try {
	 *   // Perform database operations within the transaction
	 *   await performDatabaseOperations(db);
	 *
	 *   // Commit the transaction
	 *   await databaseService.commitTransactionAsync(db);
	 * } catch (error) {
	 *   // Handle any errors and rollback the transaction
	 *   await databaseService.rollbackTransactionAsync(db);
	 *   throw error;
	 * }
	 */
	async beginTransactionAsync(): Promise<Database> {
		const transaction = new SQLite3Transaction(this.databaseService);
		return await transaction.beginTransactionAsyncWithErrorHandling();
	}

	/**
	 * Commits the current transaction in the database.
	 * @param db The database connection.
	 * @returns A promise that resolves when the transaction is committed.
	 */
	async commitTransactionAsync(db: Database): Promise<void> {
		await SQLite3Transaction.commitTransactionAsyncWithErrorHandling(db);
	}

	/**
	 * Rolls back a transaction in the database.
	 * @param db The database connection.
	 * @returns A promise that resolves when the transaction is rolled back.
	 */
	async rollbackTransactionAsync(db: Database): Promise<void> {
		await SQLite3Transaction.rollbackTransactionAsyncWithErrorHandling(db);
	}

	/**
	 * Executes a SQL query with error handling, all SQLite3 error will be convert to
	 * DatabaseError, therefore try catch may not be necessary in the repository level.
	 *
	 * @template T - The type of the result array.
	 * @param {Database} db - The database connection.
	 * @param {string} query - The SQL query to execute.
	 * @param {any[]} params - The parameters for the query.
	 * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of a database error.
	 * @returns {Promise<T[]>} - A promise that resolves to the result array.
	 * @throws {DatabaseError} - Throws a database error if an SQL error occurs.
	 */
	async runWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError // Pass error constructor
	): Promise<T> {
		try {
			return (await runAsync(db, query, params)) as T;
		} catch (error) {
			const dbError = new errorType({
				query,
				cause: error as Error
			});
			this.errorHandlerService.handleError({
				error: dbError,
				service: SQLite3QueryService.name,
				query: query
			});
			throw dbError;
		}
	}

	/**
	 * Executes a SQL query with error handling, all SQLite3 error will be convert to
	 * DatabaseError, therefore try catch may not be necessary in the repository level.
	 *
	 * @template T - The type of the result.
	 * @param {Database} db - The database instance.
	 * @param {string} query - The SQL query to execute.
	 * @param {any[]} params - The parameters for the query.
	 * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of an error.
	 * @returns {Promise<T>} - A promise that resolves to the result of the query.
	 * @throws {DatabaseError} - If an error occurs during the query execution.
	 */
	async getWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError
	): Promise<T> {
		try {
			return (await getAsync(db, query, params)) as T;
		} catch (error) {
			const dbError = new errorType({
				query,
				cause: error as Error
			});
			this.errorHandlerService.handleError({
				error: dbError,
				service: SQLite3QueryService.name,
				query: query
			});
			throw dbError;
		}
	}

	/**
	 * Executes a SQL query with error handling, all SQLite3 error will be convert to
	 * DatabaseError, therefore try catch may not be necessary in the repository level.
	 *
	 * @template T - The type of the result array.
	 * @param {Database} db - The database connection.
	 * @param {string} query - The SQL query to execute.
	 * @param {any[]} params - The parameters for the query.
	 * @param {new (...args: any[]) => DatabaseError} errorType - The error type to throw in case of a database error.
	 * @returns {Promise<T[]>} - A promise that resolves to the result array.
	 * @throws {DatabaseError} - Throws a database error if an SQL error occurs.
	 */
	async allWithSqlErrorHandlingAsync<T>(
		db: Database,
		query: string,
		params: any[],
		errorType: new (...args: any[]) => DatabaseError
	): Promise<T[]> {
		try {
			return (await allAsync(db, query, params)) as T[];
		} catch (error) {
			throw this.errorHandlerService.handleUnknownDatabaseError({
				error: error as Error,
				service: SQLite3QueryService.name,
				query: query,
				errorType
			});
		}
	}
}

function runAsync(
	db: sqlite3.Database,
	query: string,
	params: any[]
): Promise<sqlite3.RunResult> {
	return new Promise((resolve, reject) => {
		db.prepare(
			query,
			function (this: sqlite3.Statement, err: Error | null) {
				if (err) return reject(err);
				this.run(
					params,
					function (this: sqlite3.RunResult, err: Error | null) {
						if (err) return reject(err);
						resolve(this);
					}
				).finalize();
			}
		);
	});
}

function getAsync(
	db: sqlite3.Database,
	query: string,
	params: any[]
): Promise<any> {
	return new Promise((resolve, reject) => {
		db.prepare(
			query,
			function (this: sqlite3.Statement, err: Error | null) {
				if (err) return reject(err);
				this.get(
					params,
					function (
						this: sqlite3.Statement,
						err: Error | null,
						row: any
					) {
						if (err) return reject(err);
						resolve(row);
					}
				).finalize();
			}
		);
	});
}

function allAsync(
	db: sqlite3.Database,
	query: string,
	params: any[]
): Promise<any[]> {
	return new Promise((resolve, reject) => {
		db.prepare(
			query,
			function (this: sqlite3.Statement, err: Error | null) {
				if (err) return reject(err);
				this.all(
					params,
					function (
						this: sqlite3.Statement,
						err: Error | null,
						rows: any[]
					) {
						if (err) return reject(err);
						resolve(rows);
					}
				).finalize();
			}
		);
	});
}

/**
 * Represents a transaction for MongoDB database operations.
 */
export interface IMongoDBQueryService {
	/**
	 * Begins a transaction asynchronously.
	 * @returns A Promise that resolves to a ClientSession object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */
	beginTransactionAsync(): Promise<ClientSession>;
	/**
	 * Commits the current transaction in the database.
	 * @param session The session object representing the transaction.
	 * @returns A promise that resolves when the transaction is committed.
	 */
	commitTransactionAsync(session: ClientSession): Promise<void>;
	/**
	 * Rolls back a transaction in the database.
	 * @param session The session object representing the transaction.
	 * @returns A promise that resolves when the transaction is rolled back.
	 */
	rollbackTransactionAsync(session: ClientSession): Promise<void>;
}
@injectable()
export class MongoDBQueryService {
	constructor(private databaseService: DatabaseService) {}

	async beginTransactionAsync(): Promise<ClientSession> {
		const transaction = new MongoDBTransaction(this.databaseService);
		return await transaction.beginTransactionAsyncWithErrorHandling();
	}

	async commitTransactionAsync(session: ClientSession): Promise<void> {
		await MongoDBTransaction.commitTransactionAsyncWithErrorHandling(
			session
		);
	}

	async rollbackTransactionAsync(session: ClientSession): Promise<void> {
		await MongoDBTransaction.rollbackTransactionAsyncWithErrorHandling(
			session
		);
	}
}

/**
 * Represents a transaction for MongoDB database operations.
 */
class MongoDBTransaction {
	private databaseService: DatabaseService;

	constructor(databaseService: DatabaseService) {
		this.databaseService = databaseService;
	}

	/**
	 * Begins a transaction asynchronously with error handling.
	 * @returns A Promise that resolves to a MongoClient object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */
	async beginTransactionAsyncWithErrorHandling(): Promise<ClientSession> {
		try {
			const client = this.databaseService.mongoClient;
			const session = client.startSession();
			session.startTransaction();
			return session;
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}
	/**
	 * Commits a transaction asynchronously with error handling.
	 * @param client - The MongoClient object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */

	static async commitTransactionAsyncWithErrorHandling(
		session: ClientSession
	): Promise<void> {
		try {
			await session.commitTransaction();
			session.endSession();
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}

	/**
	 * Rolls back a transaction asynchronously with error handling.
	 * @param client - The MongoClient object representing the transaction.
	 * @throws {DatabaseError} If an error occurs during the transaction.
	 */

	static async rollbackTransactionAsyncWithErrorHandling(
		session: ClientSession
	): Promise<void> {
		try {
			await session.abortTransaction();
			session.endSession();
		} catch (error) {
			throw new DatabaseError({
				cause: error as Error
			});
		}
	}
}
