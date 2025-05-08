import { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth/next';
import SlackProvider from 'next-auth/providers/slack';
import { supabase } from '@/lib/supabase/client';

interface SlackProfile {
  id: string;
  name: string;
  email: string;
  image_original?: string;
  image_512?: string;
}

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
    async signIn({ account, profile }: { account: any; profile: SlackProfile }) {
      if (account?.provider === 'slack') {
        let workspaceId: string | undefined;

        try {
          const response = await fetch('https://slack.com/api/team.info', {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });

          const data = await response.json();
          workspaceId = data?.team?.id;

          console.log('Fetched workspace ID from API:', workspaceId);
        } catch (err) {
          console.error('Failed to fetch workspace ID from Slack:', err);
          return false;
        }

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

        try {
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('slack_id', profile.id)
            .single();

          const photoUrl = profile.image_original || profile.image_512;

          if (!existingUser) {
            await supabase.from('users').insert({
              slack_id: profile.id,
              name: profile.name,
              photo_url: photoUrl,
            });
          } else {
            await supabase
              .from('users')
              .update({
                name: profile.name,
                photo_url: photoUrl,
              })
              .eq('slack_id', profile.id);
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

    async jwt({ token, account, profile }: { token: any; account: any; profile: SlackProfile }) {
      if (account?.provider === 'slack') {
        token.slack_id = profile.id;
      }
      return token;
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
