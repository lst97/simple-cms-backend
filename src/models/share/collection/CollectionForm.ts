import CollectionBaseSchema, {
	CollectionInfo
} from '../../../schemas/collection/CollectionBaseSchema';
import { CollectionAttribute } from './CollectionAttributes';

export class CollectionForm implements CollectionBaseSchema {
	kind: 'collection' = 'collection';
	collectionName!: string;
	info?: CollectionInfo;
	attributes: CollectionAttribute[] = [];
}
