import { Collection } from '../../../models/share/collection/Collection';
import { User } from '../../../models/database/User';
import { ClientSession, ObjectId } from 'mongodb';
import { CollectionAttribute } from '../../../models/share/collection/CollectionAttributes';

// Recommended Methods for ICollectionRepository Interface
// Based on the Collection class you provided, here are some recommended methods to include in your ICollectionRepository interface:
// Basic CRUD Operations:
// create(collection: Collection): Promise<Collection>
// Creates a new collection and saves it to the database.
// Returns the created collection object.
// findById(id: string): Promise<Collection | null>
// Finds a collection by its ID.
// Returns the collection object if found, otherwise null.
// findByUserId(userId: string): Promise<Collection[]>
// Finds all collections belonging to a specific user.
// Returns an array of collection objects.
// update(id: string, updateData: Partial<Collection>): Promise<Collection | null>
// Updates a collection with the provided data.
// Returns the updated collection object if successful, otherwise null.
// delete(id: string): Promise<boolean>
// Deletes a collection by its ID.
// Returns true if the deletion was successful, otherwise false.
// Additional Methods (Optional):
// findAll(): Promise<Collection[]>
// Retrieves all collections from the database.
// findByName(collectionName: string): Promise<Collection | null>
// Finds a collection by its name.
// findByContent(query: any): Promise<Collection[]>
// Finds collections based on a query related to the content.
// countByUserId(userId: string): Promise<number>
// Counts the number of collections belonging to a specific user.

export interface ICollectionRepository {
	create(collection: Collection): Promise<Collection>;
	updateAttributeById(
		id: ObjectId,
		attribute: CollectionAttribute
	): Promise<Collection | null>;
	findBySlug(slug: string): Promise<Collection | null>;
	findById(id: string): Promise<Collection | null>;
	findByUsername(username: string): Promise<Collection[]>;
	update(
		id: ObjectId,
		updateData: Partial<Collection>
	): Promise<Collection | null>;
	updateAttributesContent(
		id: ObjectId,
		updateData: Partial<CollectionAttribute[]>
	): Promise<Collection | null>;
	delete(id: ObjectId): Promise<boolean>;
	findAll(): Promise<Collection[]>;
	findByName(collectionName: string): Promise<Collection | null>;
	findBySlugs(slugs: string[]): Promise<Collection[]>;
	findInfoBySlugs(slug: string[]): Promise<Collection[]>;
	addAttribute(
		id: ObjectId,
		attribute: CollectionAttribute
	): Promise<Collection | null>;
	deleteAttribute(
		id: ObjectId,
		attributeId: ObjectId
	): Promise<Collection | null>;
}
