export interface Background {
  _id?: string;
  userId: string;
  url: string;
  type: 'url' | 'upload';
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicBackground = Pick<Background, '_id' | 'url' | 'type'>;