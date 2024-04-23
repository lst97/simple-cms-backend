import { getModelForClass, prop } from '@typegoose/typegoose';
import { CollectionAttribute } from './share/collection/CollectionAttributes';
import { CollectionForm } from './share/collection/CollectionForm';
import { GeneratorsUtil } from '../utils/Generators';

export class Collection {
	// TODO: make to true when user is implemented
	@prop({ required: false })
	userId!: string;

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

	constructor(form?: CollectionForm) {
		if (form) {
			// should get from jwt
			// this.userId = form.userId;
			this.collectionName = form.collectionName;
			this.description = form.info?.description;
			this.slug = GeneratorsUtil.generateUrlSlug(this.collectionName);
			this.attributes.push(...form.attributes);
		}
	}
}

export const CollectionModel = getModelForClass(Collection);
