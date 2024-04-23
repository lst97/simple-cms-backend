import ShortUniqueId from 'short-unique-id';

export class GeneratorsUtil {
	public static generateUrlSlug(prefix: string) {
		// Trim whitespace and replace spaces with hyphens
		const sanitizedPrefix = prefix.trim().replace(/\s+/g, '-');

		// Allow only alphanumeric characters
		const filteredPrefix = sanitizedPrefix.replace(/[^a-zA-Z0-9-]/g, '');

		const uid = new ShortUniqueId({
			dictionary: 'alpha_lower',
			length: 8
		});

		return `${filteredPrefix.toLowerCase()}_${uid.rnd()}`;
	}
}
