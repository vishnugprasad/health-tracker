export interface User {
  id: string;
  name: string;
  email: string;
  email_verified: boolean;
  image?: string;
  slack_id: string;
  company_id?: string;
  role?: 'admin' | 'employee';
  notification_preferences: {
    email: boolean;
    slack: boolean;
    challenges: boolean;
    leaderboard: boolean;
    achievements: boolean;
  };
}

export interface Session {
  user: User;
  expires: string;
  company?: {
    id: string;
    name: string;
    domain: string;
  };
}

export interface AuthState {
  session: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

export interface SlackProfile {
  id: string;
  name: string;
  email: string;
  image_192: string;
  team_id: string;
  team_domain: string;
} 