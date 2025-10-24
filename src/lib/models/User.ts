export interface User {
  _id?: string;
  email: string;
  name?: string;
  passwordHash: string;
  points?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicUser = Pick<User, '_id' | 'email' | 'name' | 'points'>;


