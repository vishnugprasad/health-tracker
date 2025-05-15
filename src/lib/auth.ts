import { supabase } from './supabase/client';
import { NextAuthOptions } from 'next-auth';
import SlackProvider from 'next-auth/providers/slack';

export const authOptions: NextAuthOptions = {
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'slack') {
        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('slack_id', profile.sub)
            .single();

          if (!existingUser) {
            await supabase.from('users').insert({
              slack_id: profile.sub,
              name: profile.name,
              photo_url: profile.picture,
              total_points: 0,
            });
          }
          return true;
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (token?.sub) {
        try {
          const { data: user } = await supabase
            .from('users')
            .select()
            .eq('slack_id', token.sub)
            .single();

          if (user) {
            session.user.id = user.id;
            session.user.slack_id = user.slack_id;
            session.user.total_points = user.total_points;
          }
        } catch (error) {
          console.error('Error fetching user session data:', error);
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/',
    error: '/',
  },
};

export async function getUserBySlackId(slackId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('slack_id', slackId)
    .single();

  if (error) throw error;
  return data;
}

export async function createUser(slackId: string, name: string, photoUrl?: string) {
  const { data, error } = await supabase
    .from('users')
    .insert({
      slack_id: slackId,
      name,
      photo_url: photoUrl,
      total_points: 0
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserPoints(userId: string, points: number) {
  const { data, error } = await supabase
    .from('users')
    .update({ total_points: points })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
} 