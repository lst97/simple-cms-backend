import { getModelForClass, prop } from '@typegoose/typegoose';
import {
	TextTypes,
	TextSchema,
	CodeSchema,
	MediaTypes,
	MediaExtensions,
	DocumentExtensions,
	DocumentSchema,
	DateFormats,
	NumberSchema,
	DecimalSchema,
	MediaSchema,
	DateSchema,
	TextContentTypes,
	CodeLanguageTypes
} from '../../../schemas/collection/BaseSchema';

export type SupportedAdvancedSettingTypes =
	| 'require' // 1
	| 'unique' // 2
	| 'max_length' // 4
	| 'min_length'; // 8

export class SupportedAdvancedSettings {
	static require: SupportedAdvancedSettingTypes = 'require';
	static unique: SupportedAdvancedSettingTypes = 'unique';
	static max_length: SupportedAdvancedSettingTypes = 'max_length';
	static min_length: SupportedAdvancedSettingTypes = 'min_length';
}

export type AttributeSettingTypes =
	| TextTypeSetting
	| CodeTypeSetting
	| MediaTypeSetting
	| DocumentTypeSetting
	| DateTypeSetting
	| DecimalTypeSetting
	| NumberTypeSetting
	| BooleanTypeSetting
	| DynamicTypeSetting;
export class TypeSetting {
	@prop({ required: true })
	private _name: string = '';
	@prop({ required: true })
	private _type: string = '';
	@prop({ required: true })
	private _isRequire: boolean = false;
	@prop({ required: true })
	private _isUnique: boolean = false;
	@prop({ required: true })
	private _private: boolean = false;

	public get name(): string {
		return this._name;
	}

	public get type(): string {
		return this._type;
	}

	public get isRequire(): boolean {
		return this._isRequire;
	}

	public get isUnique(): boolean {
		return this._isUnique;
	}

	public get private(): boolean {
		return this._private;
	}

	public set name(value: string) {
		this._name = value;
	}

	public set type(value: string) {
		this._type = value;
	}

	public set isRequire(value: boolean) {
		this._isRequire = value;
	}

	public set isUnique(value: boolean) {
		this._isUnique = value;
	}

	public set private(value: boolean) {
		this._private = value;
	}
}

export class TextTypeSetting extends TypeSetting {
	@prop({ required: true })
	private _maxLength: number = 0;
	@prop({ required: true })
	private _minLength: number = 0;
	@prop({ required: true })
	private _textType: string = '';

	constructor() {
		super();
		this.type = TextSchema.type;
		this._textType = TextSchema.textType;
		this.maxLength = TextSchema.maxLength;
		this.minLength = TextSchema.minLength;
	}

	public get textType(): TextContentTypes {
		return this._textType as TextContentTypes;
	}

	public set textType(value: TextContentTypes) {
		this._textType = value;

		if (value === TextTypes.short_text) {
			this.maxLength = 255;
		} else {
			this.maxLength = 65535;
		}
	}

	public set maxLength(value: number) {
		this._maxLength = value;
	}

	public set minLength(value: number) {
		this._minLength = value;
	}

	public set isRequire(value: boolean) {
		super.isRequire = value;
	}

	public set isUnique(value: boolean) {
		super.isUnique = value;
	}

	public set private(value: boolean) {
		super.private = value;
	}
}

export class CodeTypeSetting extends TextTypeSetting {
	private _language: CodeLanguageTypes;

	constructor() {
		super();
		this.type = CodeSchema.type;
		this._language = CodeSchema.language;
		this.maxLength = CodeSchema.maxLength;
		this.minLength = CodeSchema.minLength;
	}

	public set language(value: CodeLanguageTypes) {
		this._language = value;
	}
}

export class MediaTypeSetting extends TypeSetting {
	private _mediaType: MediaTypes;
	private _mediaExtension: MediaExtensions;
	private _maxSize: number;

	constructor() {
		super();
		this.type = MediaSchema.type;
		this._mediaExtension = MediaSchema.extension;
		this._mediaType = MediaSchema.mediaType;
		this._maxSize = MediaSchema.maxSize;
	}

	public set mediaType(value: MediaTypes) {
		this._mediaType = value;
	}

	public set mediaExtension(value: MediaExtensions) {
		this._mediaExtension = value;
	}

	public set maxSize(value: number) {
		this._maxSize = value;
	}
}

export class DocumentTypeSetting extends TypeSetting {
	private _documentExtension: DocumentExtensions;
	private _maxSize: number;
	constructor() {
		super();
		this.type = DocumentSchema.type;
		this._documentExtension = DocumentSchema.extension;
		this._maxSize = DocumentSchema.maxSize;
	}

	public set documentExtension(value: DocumentExtensions) {
		this._documentExtension = value;
	}

	public set maxSize(value: number) {
		this._maxSize = value;
	}
}

export class DateTypeSetting extends TypeSetting {
	private _format: DateFormats;
	constructor() {
		super();
		this.type = DateSchema.type;
		this._format = DateSchema.format;
	}

	public set format(value: DateFormats) {
		this._format = value;
	}
}

export class NumberTypeSetting extends TypeSetting {
	private _min: number;
	private _max: number;
	constructor() {
		super();
		this.type = NumberSchema.type;
		this._min = NumberSchema.min;
		this._max = NumberSchema.max;
	}

	public set min(value: number) {
		this._min = value;
	}

	public set max(value: number) {
		this._max = value;
	}
}

export class DecimalTypeSetting extends TypeSetting {
	private _min: number;
	private _max: number;
	private _precision: [number, number];
	constructor() {
		super();
		this.type = DecimalSchema.type;
		this._min = DecimalSchema.min;
		this._max = DecimalSchema.max;
		this._precision = DecimalSchema.precision;
	}

	public set min(value: number) {
		this._min = value;
	}

	public set max(value: number) {
		this._max = value;
	}

	public set precision(value: [number, number]) {
		this._precision = value;
	}
}

export class BooleanTypeSetting {
	private _isRequire: boolean = false;
	private _private: boolean = false;

	public set isRequire(value: boolean) {
		this._isRequire = value;
	}

	public set private(value: boolean) {
		this._private = value;
	}
}

export class DynamicTypeSetting extends TypeSetting {
	private _content: unknown = {};

	constructor() {
		super();
	}

	public set content(value: unknown) {
		this._content = value;
	}
}

export const TypeSettingModel = getModelForClass(TypeSetting);
