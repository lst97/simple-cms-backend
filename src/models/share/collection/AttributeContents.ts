import { getModelForClass, prop } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';

export class BaseContent {
	@prop({ required: true, default: new ObjectId() })
	public _id!: ObjectId;

	@prop({ required: false })
	public value?: string;

	constructor(content?: string) {
		this.value = content;
	}
}

export const BaseContentModel = getModelForClass(BaseContent);
