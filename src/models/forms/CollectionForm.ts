import { SupportedCollectionKind } from '../share/collection/Collection';
import { CollectionAttribute } from '../share/collection/CollectionAttributes';

interface CollectionFormProps {
	kind: 'collection' | 'post' | 'posts';
	info: CollectionInfo;
	attributes: CollectionAttribute[];
	ref?: string;
}

export interface CollectionInfo {
	name: string;
	description: string;
	subdirectory: string;
}

export class CollectionForm implements CollectionFormProps {
	kind: 'collection' | 'post' | 'posts';
	info: CollectionInfo;
	attributes: CollectionAttribute[];
	ref?: string;

	constructor(kind: SupportedCollectionKind) {
		this.kind = kind;
		this.info = { name: '', description: '', subdirectory: '' };
		this.attributes = [];
	}

	public setCollectionInfo({
		name,
		description,
		subdirectory
	}: CollectionInfo) {
		this.info = { name, description, subdirectory };
	}

	public addAttribute(attribute: CollectionAttribute) {
		this.attributes.push(attribute);
	}
}
