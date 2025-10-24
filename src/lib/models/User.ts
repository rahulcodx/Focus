export interface User {
  _id?: string;
  email: string;
  name?: string;
  passwordHash: string;
  points?: number;
  backgroundUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicUser = Pick<User, '_id' | 'email' | 'name' | 'points'>;


