# Fitness Tracker

A web application that tracks gym activity among employees using Slack integration. The app pulls photo posts from a dedicated #health channel to log activity, assign points, and foster a fun, competitive fitness environment through gamification.

## Features

- 🔐 **Slack Authentication**: Secure login through Slack OAuth
- 📲 **Slack Integration**: Automatic syncing of gym check-ins from #health channel
- 🎮 **Gamification**: Points system, badges, and challenges
- 🏆 **Leaderboards**: Track progress across different time periods
- 👤 **User Profiles**: View personal stats and achievements
- 🛠 **Admin Panel**: Manage points and monitor activity

## Tech Stack

- Frontend: Next.js 14 with TypeScript
- Backend: Next.js API Routes
- Database: Supabase (PostgreSQL)
- Authentication: NextAuth.js with Slack provider
- Styling: Tailwind CSS
- Integration: Slack Web API & Events API

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account
- Slack workspace with admin access

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd health-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Slack App:
   - Go to [api.slack.com/apps](https://api.slack.com/apps)
   - Create a new app
   - Enable OAuth & Permissions
   - Add required scopes:
     - `identity.basic`
     - `identity.email`
     - `identity.avatar`
     - `channels:history`
     - `channels:read`
     - `chat:write`
   - Install the app to your workspace

4. Set up Supabase:
   - Create a new project
   - Run the database schema from `supabase/schema.sql`
   - Get your project URL and API keys

5. Create a `.env.local` file:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

   # Slack
   SLACK_CLIENT_ID=your-slack-client-id
   SLACK_CLIENT_SECRET=your-slack-client-secret
   SLACK_SIGNING_SECRET=your-slack-signing-secret
   SLACK_BOT_TOKEN=xoxb-your-bot-token
   SLACK_WORKSPACE_ID=your-workspace-id
   SLACK_CHANNEL_ID=your-health-channel-id

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   # Admin Users (comma-separated Slack user IDs)
   ADMIN_USER_IDS=U123456,U789012
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Set up Slack Event Subscriptions:
   - Go to your Slack App settings
   - Enable Event Subscriptions
   - Set the Request URL to: `https://your-domain/api/webhooks/slack`
   - Subscribe to workspace events:
     - `message.channels`

## Deployment

1. Deploy to Vercel:
   ```bash
   npm run build
   vercel deploy
   ```

2. Update environment variables in your hosting platform

3. Update Slack App configuration with production URLs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.
