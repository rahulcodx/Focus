import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface TaskDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

export class TaskModel {
  private static readonly COLLECTION_NAME = 'tasks';

  // Create a new task
  static async create(userId: string, taskData: CreateTaskData): Promise<{ success: boolean; task?: TaskDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { success: false, error: 'Invalid user ID' };
      }

      if (!taskData.title || taskData.title.trim().length === 0) {
        return { success: false, error: 'Task title is required' };
      }

      const now = new Date();
      const newTask: Omit<TaskDocument, '_id'> = {
        userId: new ObjectId(userId),
        title: taskData.title.trim(),
        description: taskData.description?.trim() || '',
        completed: false,
        priority: taskData.priority || 'medium',
        category: taskData.category?.trim() || '',
        dueDate: taskData.dueDate,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(newTask);

      if (result.insertedId) {
        const createdTask = await collection.findOne({ _id: result.insertedId });
        return { success: true, task: createdTask! };
      }

      return { success: false, error: 'Failed to create task' };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Get all tasks for a user
  static async getByUserId(userId: string, filter?: { completed?: boolean; category?: string }): Promise<TaskDocument[]> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return [];
      }

      const query: any = { userId: new ObjectId(userId) };

      if (filter?.completed !== undefined) {
        query.completed = filter.completed;
      }

      if (filter?.category) {
        query.category = filter.category;
      }

      const tasks = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return tasks;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  // Update a task
  static async updateById(userId: string, taskId: string, updateData: UpdateTaskData): Promise<{ success: boolean; task?: TaskDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(taskId)) {
        return { success: false, error: 'Invalid user or task ID' };
      }

      const updateDoc: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      // If marking as completed, set completedAt timestamp
      if (updateData.completed === true) {
        updateDoc.completedAt = new Date();
      } else if (updateData.completed === false) {
        updateDoc.completedAt = null;
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(taskId), userId: new ObjectId(userId) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (result) {
        return { success: true, task: result };
      }

      return { success: false, error: 'Task not found or unauthorized' };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: 'Failed to update task' };
    }
  }

  // Delete a task
  static async deleteById(userId: string, taskId: string): Promise<boolean> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(taskId)) {
        return false;
      }

      const result = await collection.deleteOne({
        _id: new ObjectId(taskId),
        userId: new ObjectId(userId)
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }

  // Get task statistics for a user
  static async getStats(userId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
    todayCompleted: number;
    overdue: number;
  }> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { total: 0, completed: 0, pending: 0, todayCompleted: 0, overdue: 0 };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const [totalResult, completedResult, pendingResult, todayCompletedResult, overdueResult] = await Promise.all([
        collection.countDocuments({ userId: new ObjectId(userId) }),
        collection.countDocuments({ userId: new ObjectId(userId), completed: true }),
        collection.countDocuments({ userId: new ObjectId(userId), completed: false }),
        collection.countDocuments({
          userId: new ObjectId(userId),
          completed: true,
          completedAt: { $gte: today, $lt: tomorrow }
        }),
        collection.countDocuments({
          userId: new ObjectId(userId),
          completed: false,
          dueDate: { $lt: today }
        })
      ]);

      return {
        total: totalResult,
        completed: completedResult,
        pending: pendingResult,
        todayCompleted: todayCompletedResult,
        overdue: overdueResult
      };
    } catch (error) {
      console.error('Error getting task stats:', error);
      return { total: 0, completed: 0, pending: 0, todayCompleted: 0, overdue: 0 };
    }
  }

  // Create indexes for better performance
  static async createIndexes(): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<TaskDocument>(this.COLLECTION_NAME);

      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ userId: 1, completed: 1 });
      await collection.createIndex({ userId: 1, createdAt: -1 });
      await collection.createIndex({ userId: 1, dueDate: 1 });

      console.log('Task indexes created successfully');
    } catch (error) {
      console.error('Error creating task indexes:', error);
    }
  }
}