import { getModelForClass, prop } from '@typegoose/typegoose';
import { CollectionAttribute } from './CollectionAttributes';
import { CollectionForm } from '../../forms/CollectionForm';
import { GeneratorsUtil } from '../../../utils/Generators';
import { ObjectId } from 'mongodb';

export class Collection {
	@prop({ required: false, default: new ObjectId() })
	_id?: ObjectId;

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

	@prop({ type: () => CollectionAttribute })
	attributes: CollectionAttribute[] = [];

	@prop({ default: Date.now })
	createdAt!: Date;

	@prop({ default: Date.now })
	updatedAt!: Date;

	constructor(username: string, form?: CollectionForm) {
		if (form) {
			this.username = username;
			this.collectionName = form.collectionName;
			this.description = form.info?.description;
			this.slug = GeneratorsUtil.generateUrlSlug(this.collectionName);
			this.attributes.push(...form.attributes);
		}
	}
}

export const CollectionModel = getModelForClass(Collection);
