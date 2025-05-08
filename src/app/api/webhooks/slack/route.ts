import { NextResponse } from 'next/server';
import { WebClient } from '@slack/web-api';
import { supabase } from '@/lib/supabase/client';

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Handle Slack URL verification
    if (body.type === 'url_verification') {
      return NextResponse.json({ challenge: body.challenge });
    }

    // Handle message events
    if (body.type === 'event_callback' && body.event.type === 'message' && body.event.channel === process.env.SLACK_CHANNEL_ID) {
      const event = body.event;

      // Check if message has files (images)
      if (event.files && event.files.length > 0) {
        const images = event.files.filter((file: any) => file.mimetype.startsWith('image/'));
        
        if (images.length > 0) {
          // Get user details
          const { data: existingUser } = await supabase
            .from('users')
            .select()
            .eq('slack_id', event.user)
            .single();

          if (existingUser) {
            // Check if user already checked in today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const { data: existingCheckIn } = await supabase
              .from('check_ins')
              .select()
              .eq('user_id', existingUser.id)
              .gte('timestamp', today.toISOString())
              .single();

            if (!existingCheckIn) {
              // Create check-in
              const { data: checkIn } = await supabase
                .from('check_ins')
                .insert({
                  user_id: existingUser.id,
                  message_id: event.client_msg_id || event.ts,
                  image_url: images[0].url_private,
                  points_awarded: 1,
                })
                .select()
                .single();

              if (checkIn) {
                // Update user's total points
                await supabase
                  .from('users')
                  .update({
                    total_points: existingUser.total_points + 1,
                  })
                  .eq('id', existingUser.id);

                // Log points
                await supabase
                  .from('points_log')
                  .insert({
                    user_id: existingUser.id,
                    amount: 1,
                    source: 'daily_check_in',
                  });

                // Check for badges
                await checkAndAwardBadges(existingUser.id);
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Slack webhook:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function checkAndAwardBadges(userId: string) {
  try {
    // Get user's check-ins count
    const { count } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // First check-in badge
    if (count === 1) {
      await awardBadge(userId, 'first_check_in');
    }

    // Get weekly check-ins
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    
    const { count: weeklyCount } = await supabase
      .from('check_ins')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .gte('timestamp', weekStart.toISOString());

    // Weekly warrior badge
    if (weeklyCount >= 5) {
      await awardBadge(userId, 'weekly_warrior');
    }

    // Check total points for other badges
    const { data: user } = await supabase
      .from('users')
      .select('total_points')
      .eq('id', userId)
      .single();

    if (user && user.total_points >= 100) {
      await awardBadge(userId, 'century_club');
    }
  } catch (error) {
    console.error('Error checking badges:', error);
  }
}

async function awardBadge(userId: string, badgeType: string) {
  try {
    // Check if badge already awarded
    const { data: existingBadge } = await supabase
      .from('badges')
      .select()
      .eq('user_id', userId)
      .eq('badge_type', badgeType)
      .single();

    if (!existingBadge) {
      await supabase
        .from('badges')
        .insert({
          user_id: userId,
          badge_type: badgeType,
        });
    }
  } catch (error) {
    console.error('Error awarding badge:', error);
  }
} 