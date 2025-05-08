import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Types for our database tables
export type User = {
  id: string;
  slack_id: string;
  name: string;
  photo_url: string | null;
  total_points: number;
  created_at: string;
  updated_at: string;
};

export type CheckIn = {
  id: string;
  user_id: string;
  timestamp: string;
  message_id: string;
  image_url: string;
  points_awarded: number;
};

export type PointsLog = {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  timestamp: string;
};

export type Badge = {
  id: string;
  user_id: string;
  badge_type: string;
  awarded_at: string;
};

export type Challenge = {
  id: string;
  type: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  created_at: string;
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  points: number;
  joined_at: string;
}; 