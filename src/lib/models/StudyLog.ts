export interface StudyLog {
  _id?: string;
  userId: string;
  subject: string;
  duration: number; // in seconds
  date: string; // YYYY-MM-DD
  createdAt?: Date;
  updatedAt?: Date;
}

export type PublicStudyLog = Pick<StudyLog, '_id' | 'subject' | 'duration' | 'date'>;