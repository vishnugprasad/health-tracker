import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import SlackProvider from 'next-auth/providers/slack';
import { supabase } from '@/lib/supabase/client';

export const authOptions: NextAuthOptions = {
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
    async signIn({ account, profile }: { account: any; profile: any }) {
      if (account?.provider === 'slack') {
        const workspaceId = profile?.['https://slack.com/team_id'];

        console.log('Auth attempt:', {
          workspaceId,
          expectedWorkspaceId: process.env.SLACK_WORKSPACE_ID,
          user: profile.name,
          email: profile.email,
        });

        if (workspaceId !== process.env.SLACK_WORKSPACE_ID) {
          console.error('Workspace ID mismatch:', {
            received: workspaceId,
            expected: process.env.SLACK_WORKSPACE_ID,
          });
          return false;
        }

        const slackId = profile.sub;
        const photoUrl = profile.picture;
        const name = profile.name;

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

    async session({ session, token }: { session: any; token: any }) {
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
    },

    async jwt({ token, account, profile }: { token: any; account: any; profile: any }) {
      if (account?.provider === 'slack' && profile?.sub) {
        token.sub = profile.sub; // sets Slack user ID
        token.slack_id = profile.sub;
      }
      return token;
    },

    async redirect({ url, baseUrl }) {
      // Redirect to leaderboard after sign in
      return `${baseUrl}/leaderboard`;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
  },

  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
