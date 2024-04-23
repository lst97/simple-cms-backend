export const validateCollectionName = (value: string): boolean => {
	return /^[a-zA-Z0-9\s]+$/.test(value);
};
