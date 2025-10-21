import { ObjectId } from 'mongodb';
import { getDb } from '../mongodb';
import { hashPassword, verifyPassword, validateEmail, validateName, validatePassword } from '../auth';

export interface UserDocument {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isVerified: boolean;
  profilePicture?: string;
  preferences?: {
    theme: 'light' | 'dark';
    notifications: boolean;
    language: string;
  };
  stats?: {
    totalTasks: number;
    completedTasks: number;
    currentStreak: number;
    longestStreak: number;
    totalFocusTime: number;
    level: number;
    points: number;
  };
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  profilePicture?: string;
  preferences?: Partial<UserDocument['preferences']>;
  lastLoginAt?: Date;
}

export class UserModel {
  private static readonly COLLECTION_NAME = 'users';

  // Create a new user
  static async create(userData: CreateUserData): Promise<{ success: boolean; user?: UserDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      // Validate input data
      if (!validateName(userData.name)) {
        return { success: false, error: 'Name must be between 2-50 characters' };
      }

      if (!validateEmail(userData.email)) {
        return { success: false, error: 'Invalid email format' };
      }

      const passwordValidation = validatePassword(userData.password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      // Check if user already exists
      const existingUser = await collection.findOne({
        email: userData.email.toLowerCase().trim()
      });

      if (existingUser) {
        return { success: false, error: 'User already exists with this email' };
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create user document
      const now = new Date();
      const newUser: Omit<UserDocument, '_id'> = {
        name: userData.name.trim(),
        email: userData.email.toLowerCase().trim(),
        password: hashedPassword,
        createdAt: now,
        updatedAt: now,
        isVerified: false,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en',
        },
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          currentStreak: 0,
          longestStreak: 0,
          totalFocusTime: 0,
          level: 1,
          points: 0,
        },
      };

      const result = await collection.insertOne(newUser);

      if (result.insertedId) {
        const createdUser = await collection.findOne({ _id: result.insertedId });
        return { success: true, user: createdUser! };
      }

      return { success: false, error: 'Failed to create user' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: 'Internal server error' };
    }
  }

  // Find user by email
  static async findByEmail(email: string): Promise<UserDocument | null> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      const user = await collection.findOne({
        email: email.toLowerCase().trim()
      });

      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  // Find user by ID
  static async findById(userId: string): Promise<UserDocument | null> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return null;
      }

      const user = await collection.findOne({
        _id: new ObjectId(userId)
      });

      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  // Authenticate user (login)
  static async authenticate(email: string, password: string): Promise<{ success: boolean; user?: UserDocument; error?: string }> {
    try {
      if (!validateEmail(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      if (!password) {
        return { success: false, error: 'Password is required' };
      }

      const user = await this.findByEmail(email);
      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login time
      await this.updateById(user._id!.toString(), { lastLoginAt: new Date() });

      return { success: true, user };
    } catch (error) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  // Update user by ID
  static async updateById(userId: string, updateData: UpdateUserData): Promise<{ success: boolean; user?: UserDocument; error?: string }> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return { success: false, error: 'Invalid user ID' };
      }

      // Validate update data
      if (updateData.name && !validateName(updateData.name)) {
        return { success: false, error: 'Name must be between 2-50 characters' };
      }

      if (updateData.email && !validateEmail(updateData.email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Check if email already exists (if updating email)
      if (updateData.email) {
        const existingUser = await collection.findOne({
          email: updateData.email.toLowerCase().trim(),
          _id: { $ne: new ObjectId(userId) }
        });

        if (existingUser) {
          return { success: false, error: 'Email already exists' };
        }
      }

      const updateDoc: any = {
        ...updateData,
        updatedAt: new Date(),
      };

      if (updateData.email) {
        updateDoc.email = updateData.email.toLowerCase().trim();
      }

      if (updateData.name) {
        updateDoc.name = updateData.name.trim();
      }

      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateDoc },
        { returnDocument: 'after' }
      );

      if (result) {
        return { success: true, user: result };
      }

      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: 'Failed to update user' };
    }
  }

  // Update user stats
  static async updateStats(userId: string, statsUpdate: Partial<UserDocument['stats']>): Promise<boolean> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return false;
      }

      const result = await collection.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            'stats': statsUpdate,
            updatedAt: new Date()
          }
        }
      );

      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user stats:', error);
      return false;
    }
  }

  // Delete user
  static async deleteById(userId: string): Promise<boolean> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      if (!ObjectId.isValid(userId)) {
        return false;
      }

      const result = await collection.deleteOne({
        _id: new ObjectId(userId)
      });

      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Get leaderboard users
  static async getLeaderboard(limit: number = 10): Promise<UserDocument[]> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      const users = await collection
        .find({}, {
          projection: {
            name: 1,
            stats: 1,
            createdAt: 1
          }
        })
        .sort({ 'stats.points': -1 })
        .limit(limit)
        .toArray();

      return users;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return [];
    }
  }

  // Create indexes for better performance
  static async createIndexes(): Promise<void> {
    try {
      const db = await getDb();
      const collection = db.collection<UserDocument>(this.COLLECTION_NAME);

      // Create indexes
      await collection.createIndex({ email: 1 }, { unique: true });
      await collection.createIndex({ 'stats.points': -1 });
      await collection.createIndex({ createdAt: 1 });

      console.log('User indexes created successfully');
    } catch (error) {
      console.error('Error creating user indexes:', error);
    }
  }
}
