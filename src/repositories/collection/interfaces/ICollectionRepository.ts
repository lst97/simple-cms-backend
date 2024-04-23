import { Collection } from '../../../models/Collection';

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
	findById(id: string): Promise<Collection | null>;
	findByUserId(userId: string): Promise<Collection[]>;
	update(
		id: string,
		updateData: Partial<Collection>
	): Promise<Collection | null>;
	delete(id: string): Promise<boolean>;
	findAll(): Promise<Collection[]>;
	findByName(collectionName: string): Promise<Collection | null>;
}
