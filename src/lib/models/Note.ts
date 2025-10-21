import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface NoteDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title?: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateNoteData {
  title?: string;
  content: string;
  color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
}

export interface UpdateNoteData {
  title?: string;
  content?: string;
  color?: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange';
}

export class NoteModel {
  private static readonly COLLECTION_NAME = 'notes';

  // Create a new note
  static async create(userId: string, noteData: CreateNoteData): Promise<{ success: boolean; note?: NoteDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { success: false, error: 'Invalid user ID' };
      }

      if (!noteData.content || noteData.content.trim().length === 0) {
        return { success: false, error: 'Note content is required' };
      }

      const now = new Date();
      const newNote: Omit<NoteDocument, '_id'> = {
        userId: new ObjectId(userId),
        title: noteData.title?.trim() || '',
        content: noteData.content.trim(),
        color: noteData.color || 'yellow',
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(newNote);

      if (result.insertedId) {
        const createdNote = await collection.findOne({ _id: result.insertedId });
        return { success: true, note: createdNote! };
      }

      return { success: false, error: 'Failed to create note' };
    } catch (error) {
      console.error('Error creating note:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Get all notes for a user
  static async getByUserId(userId: string): Promise<NoteDocument[]> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return [];
      }

      const notes = await collection
        .find({ userId: new ObjectId(userId) })
        .sort({ updatedAt: -1 })
        .toArray();

      return notes;
    } catch (error) {
      console.error('Error fetching notes:', error);
      return [];
    }
  }

  // Update a note
  static async updateById(userId: string, noteId: string, updateData: UpdateNoteData): Promise<{ success: boolean; note?: NoteDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(noteId)) {
        return { success: false, error: 'Invalid user or note ID' };
      }

      const updateDoc: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(noteId), userId: new ObjectId(userId) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (result) {
        return { success: true, note: result };
      }

      return { success: false, error: 'Note not found or unauthorized' };
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: 'Failed to update note' };
    }
  }

  // Delete a note
  static async deleteById(userId: string, noteId: string): Promise<boolean> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(noteId)) {
        return false;
      }

      const result = await collection.deleteOne({
        _id: new ObjectId(noteId),
        userId: new ObjectId(userId)
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting note:', error);
      return false;
    }
  }

  // Get note statistics for a user
  static async getStats(userId: string): Promise<{
    total: number;
    byColor: Record<string, number>;
  }> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { total: 0, byColor: {} };
      }

      const [totalResult, colorResult] = await Promise.all([
        collection.countDocuments({ userId: new ObjectId(userId) }),
        collection.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $group: { _id: '$color', count: { $sum: 1 } } }
        ]).toArray()
      ]);

      const byColor: Record<string, number> = {};
      colorResult.forEach(item => {
        byColor[item._id] = item.count;
      });

      return {
        total: totalResult,
        byColor
      };
    } catch (error) {
      console.error('Error getting note stats:', error);
      return { total: 0, byColor: {} };
    }
  }

  // Create indexes for better performance
  static async createIndexes(): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<NoteDocument>(this.COLLECTION_NAME);

      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ userId: 1, updatedAt: -1 });
      await collection.createIndex({ userId: 1, color: 1 });

      console.log('Note indexes created successfully');
    } catch (error) {
      console.error('Error creating note indexes:', error);
    }
  }
}