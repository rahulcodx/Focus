export interface Syllabus {
  _id?: string;
  userId: string;
  subject: string;
  totalChapters: number;
  completedChapters: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicSyllabus = Pick<Syllabus, '_id' | 'subject' | 'totalChapters' | 'completedChapters'>;