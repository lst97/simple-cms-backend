import { PostCollectionSetting } from '../share/collection/AttributeTypeSettings';
import { Collection } from '../share/collection/Collection';
import { CollectionAttribute } from '../share/collection/CollectionAttributes';

interface CollectionFormProps {
	kind: 'collection' | 'post';
	info: CollectionInfo;
	attributes: CollectionAttribute[] | Collection[];
}

export interface CollectionInfo {
	name: string;
	description: string;
	subdirectory: string;
	setting?: PostCollectionSetting;
}

export class CollectionForm implements CollectionFormProps {
	kind: 'collection' | 'post';
	info: CollectionInfo;
	ref?: string;
	attributes: CollectionAttribute[] | Collection[];

	constructor(kind?: 'collection' | 'post', ref?: string) {
		this.kind = kind ?? 'collection';
		this.info = { name: '', description: '', subdirectory: '' };
		this.ref = ref;
		this.attributes = [];
	}
}
