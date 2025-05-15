import NextAuth from 'next-auth';
import SlackProvider from 'next-auth/providers/slack';
import { supabase } from '@/lib/supabase/client';
import type { DefaultSession, NextAuthOptions } from 'next-auth';
import type { Account, Profile, Session } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

// Extend the session user type to include custom fields
interface CustomSessionUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  id?: string;
  slack_id?: string;
  total_points?: number;
}

// Type for the Slack profile fields
interface SlackProfile extends Profile {
  sub: string;
  name: string;
  email?: string;
  picture?: string;
  "https://slack.com/team_id"?: string;
}

// Auth configuration object
const authOptions: NextAuthOptions = {
  providers: [
    SlackProvider({
      clientId: process.env.SLACK_CLIENT_ID!,
      clientSecret: process.env.SLACK_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid profile email',
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account, profile }: { account?: Account | null; profile?: Profile }) {
      if (account?.provider === 'slack') {
        if (!profile) return false;

        const slackProfile = profile as SlackProfile;

        const workspaceId = slackProfile["https://slack.com/team_id"];
        const slackId = slackProfile.sub;
        const photoUrl = slackProfile.picture;
        const name = slackProfile.name;

        if (workspaceId !== process.env.SLACK_WORKSPACE_ID) {
          console.error('Workspace ID mismatch:', {
            received: workspaceId,
            expected: process.env.SLACK_WORKSPACE_ID,
          });
          return false;
        }

        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('slack_id', slackId)
            .single();

          if (!existingUser) {
            await supabase.from('users').insert({
              slack_id: slackId,
              name,
              photo_url: photoUrl,
            });
          } else {
            await supabase
              .from('users')
              .update({
                name,
                photo_url: photoUrl,
              })
              .eq('slack_id', slackId);
          }
        } catch (error) {
          console.error('Error managing user in database:', error);
          return false;
        }
      }

      return true;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token?.sub) {
        try {
          const { data: user } = await supabase
            .from('users')
            .select()
            .eq('slack_id', token.sub)
            .single();

          if (user) {
            const customUser = session.user as CustomSessionUser;
            customUser.id = user.id;
            customUser.slack_id = user.slack_id;
            customUser.total_points = user.total_points;
          }
        } catch (error) {
          console.error('Error enriching session with Supabase user:', error);
        }
      }

      return session;
    },

    async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile }) {
      if (account?.provider === 'slack' && profile?.sub) {
        token.sub = profile.sub;
        token.slack_id = profile.sub;
      }
      return token;
    },

    async redirect({ baseUrl }: { baseUrl: string }) {
      return `${baseUrl}/leaderboard`;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
