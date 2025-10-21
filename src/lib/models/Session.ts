import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';

export interface SessionDocument {
  _id?: ObjectId;
  userId: ObjectId;
  type: 'pomodoro' | 'short' | 'long';
  duration: number; // in seconds
  completed: boolean;
  startedAt: Date;
  endedAt?: Date;
  createdAt: Date;
}

export interface CreateSessionData {
  type: 'pomodoro' | 'short' | 'long';
  duration: number;
}

export interface ActivityDay {
  date: string; // YYYY-MM-DD format
  sessions: number;
  totalTime: number;
  level: number; // 0-4 for heatmap visualization
}

export class SessionModel {
  private static readonly COLLECTION_NAME = 'sessions';

  // Create a new session
  static async create(userId: string, sessionData: CreateSessionData): Promise<{ success: boolean; session?: SessionDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { success: false, error: 'Invalid user ID' };
      }

      const now = new Date();
      const newSession: Omit<SessionDocument, '_id'> = {
        userId: new ObjectId(userId),
        type: sessionData.type,
        duration: sessionData.duration,
        completed: false,
        startedAt: now,
        createdAt: now,
      };

      const result = await collection.insertOne(newSession);

      if (result.insertedId) {
        const createdSession = await collection.findOne({ _id: result.insertedId });
        return { success: true, session: createdSession! };
      }

      return { success: false, error: 'Failed to create session' };
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Complete a session
  static async complete(userId: string, sessionId: string): Promise<{ success: boolean; session?: SessionDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId) || !ObjectId.isValid(sessionId)) {
        return { success: false, error: 'Invalid user or session ID' };
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(sessionId), userId: new ObjectId(userId) },
        { 
          $set: { 
            completed: true,
            endedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      );

      if (result) {
        // Update user's focus time stats
        await this.updateUserFocusStats(userId, result.duration);
        return { success: true, session: result };
      }

      return { success: false, error: 'Session not found or unauthorized' };
    } catch (error) {
      console.error('Error completing session:', error);
      return { success: false, error: 'Failed to complete session' };
    }
  }

  // Get sessions for a user
  static async getByUserId(userId: string, filter?: { 
    startDate?: Date; 
    endDate?: Date; 
    type?: 'pomodoro' | 'short' | 'long';
    completed?: boolean;
  }): Promise<SessionDocument[]> {
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return [];
      }

      const query: any = { userId: new ObjectId(userId) };

      if (filter?.startDate || filter?.endDate) {
        query.startedAt = {};
        if (filter.startDate) {
          query.startedAt.$gte = filter.startDate;
        }
        if (filter.endDate) {
          query.startedAt.$lte = filter.endDate;
        }
      }

      if (filter?.type) {
        query.type = filter.type;
      }

      if (filter?.completed !== undefined) {
        query.completed = filter.completed;
      }

      const sessions = await collection
        .find(query)
        .sort({ startedAt: -1 })
        .toArray();

      return sessions;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return [];
    }
  }

  // Get activity data for streak/heatmap visualization
  static async getActivityData(userId: string, days: number = 49): Promise<ActivityDay[]> { // 7 weeks
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return [];
      }

      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0);

      const pipeline = [
        {
          $match: {
            userId: new ObjectId(userId),
            completed: true,
            startedAt: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$startedAt" }
            },
            sessions: { $sum: 1 },
            totalTime: { $sum: "$duration" }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ];

      const results = await collection.aggregate(pipeline).toArray();
      
      // Create array for all days in range
      const activityData: ActivityDay[] = [];
      const dataMap = new Map(results.map(r => [r._id, r]));

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayData = dataMap.get(dateStr);
        const sessions = dayData?.sessions || 0;
        const totalTime = dayData?.totalTime || 0;

        // Calculate activity level (0-4) for heatmap
        let level = 0;
        if (sessions > 0) {
          if (sessions >= 8) level = 4;
          else if (sessions >= 6) level = 3;
          else if (sessions >= 3) level = 2;
          else level = 1;
        }

        activityData.push({
          date: dateStr,
          sessions,
          totalTime,
          level
        });
      }

      return activityData;
    } catch (error) {
      console.error('Error getting activity data:', error);
      return [];
    }
  }

  // Calculate current streak
  static async getCurrentStreak(userId: string): Promise<number> {
    try {
      const activityData = await this.getActivityData(userId, 365); // Check last year
      
      let streak = 0;
      // Start from today and count backwards
      for (let i = activityData.length - 1; i >= 0; i--) {
        if (activityData[i].sessions > 0) {
          streak++;
        } else {
          break;
        }
      }

      return streak;
    } catch (error) {
      console.error('Error calculating current streak:', error);
      return 0;
    }
  }

  // Calculate longest streak
  static async getLongestStreak(userId: string): Promise<number> {
    try {
      const activityData = await this.getActivityData(userId, 365); // Check last year
      
      let longestStreak = 0;
      let currentStreak = 0;

      for (const day of activityData) {
        if (day.sessions > 0) {
          currentStreak++;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      }

      return longestStreak;
    } catch (error) {
      console.error('Error calculating longest streak:', error);
      return 0;
    }
  }

  // Get session statistics
  static async getStats(userId: string): Promise<{
    totalSessions: number;
    totalFocusTime: number;
    todayFocusTime: number;
    thisWeekSessions: number;
    averageSessionLength: number;
    currentStreak: number;
    longestStreak: number;
  }> {
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return {
          totalSessions: 0,
          totalFocusTime: 0,
          todayFocusTime: 0,
          thisWeekSessions: 0,
          averageSessionLength: 0,
          currentStreak: 0,
          longestStreak: 0
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const weekStart = new Date(today);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());

      const [
        totalStats,
        todayStats,
        weekStats,
        currentStreak,
        longestStreak
      ] = await Promise.all([
        collection.aggregate([
          { $match: { userId: new ObjectId(userId), completed: true } },
          { $group: { 
            _id: null, 
            totalSessions: { $sum: 1 },
            totalFocusTime: { $sum: '$duration' },
            averageSessionLength: { $avg: '$duration' }
          }}
        ]).toArray(),
        collection.aggregate([
          { 
            $match: { 
              userId: new ObjectId(userId), 
              completed: true,
              startedAt: { $gte: today, $lt: tomorrow }
            } 
          },
          { $group: { _id: null, todayFocusTime: { $sum: '$duration' } }}
        ]).toArray(),
        collection.countDocuments({
          userId: new ObjectId(userId),
          completed: true,
          startedAt: { $gte: weekStart }
        }),
        this.getCurrentStreak(userId),
        this.getLongestStreak(userId)
      ]);

      const totalData = totalStats[0] || {};
      const todayData = todayStats[0] || {};

      return {
        totalSessions: totalData.totalSessions || 0,
        totalFocusTime: totalData.totalFocusTime || 0,
        todayFocusTime: todayData.todayFocusTime || 0,
        thisWeekSessions: weekStats,
        averageSessionLength: Math.round(totalData.averageSessionLength || 0),
        currentStreak,
        longestStreak
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      return {
        totalSessions: 0,
        totalFocusTime: 0,
        todayFocusTime: 0,
        thisWeekSessions: 0,
        averageSessionLength: 0,
        currentStreak: 0,
        longestStreak: 0
      };
    }
  }

  // Update user's focus time statistics
  private static async updateUserFocusStats(userId: string, focusTime: number): Promise<void> {
    try {
      // This will update the User model's stats
      const { UserModel } = await import('./User');
      const user = await UserModel.findById(userId);
      if (user && user.stats) {
        await UserModel.updateStats(userId, {
          ...user.stats,
          totalFocusTime: user.stats.totalFocusTime + focusTime
        });
      }
    } catch (error) {
      console.error('Error updating user focus stats:', error);
    }
  }

  // Create indexes for better performance
  static async createIndexes(): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<SessionDocument>(this.COLLECTION_NAME);

      await collection.createIndex({ userId: 1 });
      await collection.createIndex({ userId: 1, startedAt: -1 });
      await collection.createIndex({ userId: 1, completed: 1 });
      await collection.createIndex({ userId: 1, type: 1 });

      console.log('Session indexes created successfully');
    } catch (error) {
      console.error('Error creating session indexes:', error);
    }
  }
}