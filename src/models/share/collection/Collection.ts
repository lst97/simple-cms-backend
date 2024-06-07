import { getModelForClass, prop } from '@typegoose/typegoose';
import { CollectionAttribute } from './CollectionAttributes';
import { CollectionForm } from '../../forms/CollectionForm';
import { GeneratorsUtil } from '../../../utils/Generators';
import { ObjectId } from 'mongodb';
import {
	PostCollectionSetting,
	PostTypeSetting
} from './AttributeTypeSettings';

export class Collection {
	@prop({ required: false, default: new ObjectId() })
	_id?: ObjectId = new ObjectId();

	@prop({ required: true })
	kind!: 'collection' | 'post';

	@prop({ required: true })
	username!: string;

	@prop({
		required: true
	})
	collectionName!: string;

	@prop({ required: false })
	description?: string;

	@prop({ required: true })
	slug!: string;

	@prop({ required: false })
	setting?: PostCollectionSetting;

	@prop({ type: () => CollectionAttribute })
	attributes: CollectionAttribute[] | Collection[] = [];

	@prop({ default: Date.now })
	createdAt!: Date;

	@prop({ default: Date.now })
	updatedAt!: Date;

	constructor(username: string, form?: CollectionForm) {
		if (form) {
			this.username = username;
			this.collectionName = form.info.name;
			this.description = form.info.description;
			this.slug = GeneratorsUtil.generateUrlSlug(this.collectionName);
			this.kind = form.kind;
			this.attributes = form.attributes;

			if (this.kind === 'post') {
				this.setting = form.info.setting;
			}
		}
	}
}

export const CollectionModel = getModelForClass(Collection);
