import { DatabaseError } from '@lst97/common-errors';

export interface NoSqlQuery {
	[key: string]: any;
}

export interface NoSqlErrorParams {
	message?: string;
	query?: NoSqlQuery;
	cause?: Error;
}

export class DocumentReadError extends DatabaseError {
	// query?: string;

	constructor({ message, query, cause }: NoSqlErrorParams) {
		const defaultMessage = 'Failed to read document from database';

		super({ message: message || defaultMessage, cause });
	}
}

export class DocumentCreationError extends DatabaseError {
	// query?: string;

	constructor({ message, query, cause }: NoSqlErrorParams) {
		const defaultMessage = 'Failed to create document in database';

		super({ message: message || defaultMessage, cause });
	}
}

export class DocumentUpdateError extends DatabaseError {
	// query?: string;

	constructor({ message, query, cause }: NoSqlErrorParams) {
		const defaultMessage = 'Failed to update document in database';

		super({ message: message || defaultMessage, cause });
	}
}

export class DocumentDeletionError extends DatabaseError {
	// query?: string;

	constructor({ message, query, cause }: NoSqlErrorParams) {
		const defaultMessage = 'Failed to delete document from database';

		super({ message: message || defaultMessage, cause });
	}
}
