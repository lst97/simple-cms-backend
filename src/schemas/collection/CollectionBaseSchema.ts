// For the "info" section
export interface CollectionInfo {
	displayName: string;
	description?: string;
}

export class SupportedAttributes {
	static readonly text = 'text';
	static readonly code = 'code';
	static readonly media = 'media';
	static readonly post = 'post';
	static readonly document = 'document';
	static readonly date = 'date';
	static readonly decimal = 'decimal';
	static readonly number = 'number';
	static readonly boolean = 'boolean';
	static readonly dynamic = 'dynamic';
}

export type SupportedAttributeTypes =
	| 'text'
	| 'code'
	| 'media'
	| 'post'
	| 'posts'
	| 'document'
	| 'date'
	| 'decimal'
	| 'number'
	| 'boolean'
	| 'reaction'
	| 'comment'
	| 'dynamic';
