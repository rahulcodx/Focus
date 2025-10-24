export interface Task {
  _id?: string;
  userId: string;
  text: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicTask = Pick<Task, '_id' | 'text' | 'completed'>;