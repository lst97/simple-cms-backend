import { CollectionAttribute } from '../share/collection/CollectionAttributes';

interface CollectionFormProps {
	kind: 'collection';
	info: CollectionInfo;
	attributes: CollectionAttribute[];
}

export interface CollectionInfo {
	name: string;
	description: string;
	subdirectory: string;
}

export class CollectionForm implements CollectionFormProps {
	kind: 'collection';
	info: CollectionInfo;
	attributes: CollectionAttribute[];

	constructor() {
		this.kind = 'collection';
		this.info = { name: '', description: '', subdirectory: '' };
		this.attributes = [];
	}
}
