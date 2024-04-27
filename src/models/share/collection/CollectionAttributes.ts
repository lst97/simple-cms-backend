import { getModelForClass, prop } from '@typegoose/typegoose';
import { BaseContent } from './AttributeContents';
import { AttributeSettingTypes } from './AttributeTypeSettings';

export class CollectionAttribute {
	@prop({ required: true })
	public setting: AttributeSettingTypes;
	@prop({ required: true })
	public content: BaseContent;

	constructor(setting: AttributeSettingTypes, content: BaseContent) {
		this.setting = setting;
		this.content = content;
	}
}

export const CollectionAttributeModel = getModelForClass(CollectionAttribute);
