export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  type: 'weekly' | 'monthly' | 'quarterly';
  points: number;
  participants: string[];
  winner?: string;
}

export interface ChallengeProgress {
  challengeId: string;
  userId: string;
  points: number;
  checkIns: number;
  completed: boolean;
} 