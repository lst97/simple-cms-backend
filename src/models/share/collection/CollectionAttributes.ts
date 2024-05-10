import { getModelForClass, prop } from '@typegoose/typegoose';
import { BaseContent } from './AttributeContents';
import { AttributeSettingTypes } from './AttributeTypeSettings';
import { ObjectId } from 'mongodb';

export class CollectionAttribute {
	@prop({ required: false, default: new ObjectId() })
	public _id!: ObjectId;

	@prop({ required: true })
	public setting: AttributeSettingTypes;
	@prop({ required: true })
	public content: BaseContent;

	constructor(setting: AttributeSettingTypes, content: BaseContent) {
		this.setting = setting;
		this.content = content;
		this._id = new ObjectId();
	}
}

export const CollectionAttributeModel = getModelForClass(CollectionAttribute);
