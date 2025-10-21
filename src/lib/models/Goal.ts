import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface GoalDocument {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  description?: string;
  target: number;
  current: number;
  unit: string; // e.g., 'tasks', 'hours', 'books', 'workouts'
  category?: string;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface CreateGoalData {
  title: string;
  description?: string;
  target: number;
  unit: string;
  category?: string;
  deadline?: Date;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  target?: number;
  current?: number;
  unit?: string;
  category?: string;
  deadline?: Date;
  completed?: boolean;
}

export class GoalModel {
  private static readonly COLLECTION_NAME = 'goals';

  // Create a new goal
  static async create(userId: string, goalData: CreateGoalData): Promise<{ success: boolean; goal?: GoalDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { success: false, error: 'Invalid user ID' };
      }

      if (!goalData.title || goalData.title.trim().length === 0) {
        return { success: false, error: 'Goal title is required' };
      }

      if (!goalData.target || goalData.target <= 0) {
        return { success: false, error: 'Goal target must be greater than 0' };
      }

      const now = new Date();
      const newGoal: Omit<GoalDocument, '_id'> = {
        userId: new ObjectId(userId),
        title: goalData.title.trim(),
        description: goalData.description?.trim() || '',
        target: goalData.target,
        current: 0,
        unit: goalData.unit.trim(),
        category: goalData.category?.trim() || '',
        deadline: goalData.deadline,
        completed: false,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(newGoal);

      if (result.insertedId) {
        const createdGoal = await collection.findOne({ _id: result.insertedId });
        return { success: true, goal: createdGoal! };
      }

      return { success: false, error: 'Failed to create goal' };
    } catch (error) {
      console.error('Error creating goal:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Get all goals for a user
  static async getByUserId(userId: string, filter?: { completed?: boolean; category?: string }): Promise<GoalDocument[]> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

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

      const goals = await collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      return goals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  // Update a goal
  static async updateById(userId: string, goalId: string, updateData: UpdateGoalData): Promise<{ success: boolean; goal?: GoalDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(goalId)) {
        return { success: false, error: 'Invalid user or goal ID' };
      }

      const updateDoc: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      // Auto-complete goal if current reaches or exceeds target
      if (updateData.current !== undefined) {
        const goal = await collection.findOne({ _id: new ObjectId(goalId), userId: new ObjectId(userId) });
        if (goal) {
          const target = updateData.target !== undefined ? updateData.target : goal.target;
          if (updateData.current >= target && !goal.completed) {
            updateDoc.completed = true;
            updateDoc.completedAt = new Date();
          }
        }
      }

      // If marking as completed manually, set completedAt timestamp
      if (updateData.completed === true) {
        updateDoc.completedAt = new Date();
      } else if (updateData.completed === false) {
        updateDoc.completedAt = null;
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(goalId), userId: new ObjectId(userId) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (result) {
        return { success: true, goal: result };
      }

      return { success: false, error: 'Goal not found or unauthorized' };
    } catch (error) {
      console.error('Error updating goal:', error);
      return { success: false, error: 'Failed to update goal' };
    }
  }

  // Increment goal progress
  static async incrementProgress(userId: string, goalId: string, amount: number = 1): Promise<{ success: boolean; goal?: GoalDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(goalId)) {
        return { success: false, error: 'Invalid user or goal ID' };
      }

      const goal = await collection.findOne({ _id: new ObjectId(goalId), userId: new ObjectId(userId) });
      if (!goal) {
        return { success: false, error: 'Goal not found or unauthorized' };
      }

      const newCurrent = goal.current + amount;
      const updateDoc: any = {
        current: newCurrent,
        updatedAt: new Date(),
      };

      // Auto-complete goal if target is reached
      if (newCurrent >= goal.target && !goal.completed) {
        updateDoc.completed = true;
        updateDoc.completedAt = new Date();
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(goalId), userId: new ObjectId(userId) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (result) {
        return { success: true, goal: result };
      }

      return { success: false, error: 'Failed to update goal progress' };
    } catch (error) {
      console.error('Error incrementing goal progress:', error);
      return { success: false, error: 'Failed to update goal progress' };
    }
  }

  // Delete a goal
  static async deleteById(userId: string, goalId: string): Promise<boolean> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(goalId)) {
        return false;
      }

      const result = await collection.deleteOne({
        _id: new ObjectId(goalId),
        userId: new ObjectId(userId)
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting goal:', error);
      return false;
    }
  }

  // Get goal statistics for a user
  static async getStats(userId: string): Promise<{
    total: number;
    completed: number;
    inProgress: number;
    overdue: number;
    averageProgress: number;
  }> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { total: 0, completed: 0, inProgress: 0, overdue: 0, averageProgress: 0 };
      }

      const today = new Date();

      const [totalResult, completedResult, inProgressResult, overdueResult, progressResult] = await Promise.all([
        collection.countDocuments({ userId: new ObjectId(userId) }),
        collection.countDocuments({ userId: new ObjectId(userId), completed: true }),
        collection.countDocuments({ userId: new ObjectId(userId), completed: false }),
        collection.countDocuments({
          userId: new ObjectId(userId),
          completed: false,
          deadline: { $lt: today }
        }),
        collection.aggregate([
          { $match: { userId: new ObjectId(userId) } },
          { $project: { progressPercent: { $multiply: [{ $divide: ['$current', '$target'] }, 100] } } },
          { $group: { _id: null, averageProgress: { $avg: '$progressPercent' } } }
        ]).toArray()
      ]);

      const averageProgress = progressResult.length > 0 ? Math.round(progressResult[0].averageProgress || 0) : 0;

      return {
        total: totalResult,
        completed: completedResult,
        inProgress: inProgressResult,
        overdue: overdueResult,
        averageProgress
      };
    } catch (error) {
      console.error('Error getting goal stats:', error);
      return { total: 0, completed: 0, inProgress: 0, overdue: 0, averageProgress: 0 };
    }
  }

  // Create indexes for better performance
  static async createIndexes(): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<GoalDocument>(this.COLLECTION_NAME);

      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ userId: 1, completed: 1 });
      await collection.createIndex({ userId: 1, createdAt: -1 });
      await collection.createIndex({ userId: 1, deadline: 1 });

      console.log('Goal indexes created successfully');
    } catch (error) {
      console.error('Error creating goal indexes:', error);
    }
  }
}