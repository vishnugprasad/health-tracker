'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import type { User, Badge, CheckIn } from '@/lib/supabase/client';

type ProfileData = {
  user: User | null;
  badges: Badge[];
  recentCheckIns: CheckIn[];
  stats: {
    weeklyCheckIns: number;
    monthlyCheckIns: number;
    totalCheckIns: number;
  };
};

export default function ProfilePage() {
  const { id } = useParams();
  const [profileData, setProfileData] = useState<ProfileData>({
    user: null,
    badges: [],
    recentCheckIns: [],
    stats: {
      weeklyCheckIns: 0,
      monthlyCheckIns: 0,
      totalCheckIns: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchProfileData(id as string);
  }, [id]);

  const fetchProfileData = async (userId: string) => {
    try {
      setLoading(true);

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const { data: badgesData, error: badgesError } = await supabase
        .from('badges')
        .select('*')
        .eq('user_id', userId);

      if (badgesError) throw badgesError;

      const { data: checkInsData, error: checkInsError } = await supabase
        .from('check_ins')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(5);

      if (checkInsError) throw checkInsError;

      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const { count: weeklyCount } = await supabase
        .from('check_ins')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .gte('timestamp', weekAgo.toISOString());

      const { count: monthlyCount } = await supabase
        .from('check_ins')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .gte('timestamp', monthAgo.toISOString());

      const { count: totalCount } = await supabase
        .from('check_ins')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      setProfileData({
        user: userData,
        badges: badgesData || [],
        recentCheckIns: checkInsData || [],
        stats: {
          weeklyCheckIns: weeklyCount || 0,
          monthlyCheckIns: monthlyCount || 0,
          totalCheckIns: totalCount || 0,
        },
      });
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeEmoji = (badgeType: string) => {
    switch (badgeType) {
      case 'first_check_in':
        return '🎯';
      case 'weekly_warrior':
        return '⚔️';
      case 'century_club':
        return '💯';
      default:
        return '🏅';
    }
  };

  const getBadgeTitle = (badgeType: string) => {
    switch (badgeType) {
      case 'first_check_in':
        return 'First Check-in';
      case 'weekly_warrior':
        return 'Weekly Warrior';
      case 'century_club':
        return 'Century Club';
      default:
        return badgeType
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileData.user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-red-600">User not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center">
            {profileData.user.photo_url && (
              <img
                src={profileData.user.photo_url}
                alt={profileData.user.name}
                className="h-20 w-20 rounded-full mr-6"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{profileData.user.name}</h1>
              <p className="text-gray-600">Total Points: {profileData.user.total_points}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <p className="text-gray-600">Weekly Check-ins</p>
            <p className="text-2xl font-bold">{profileData.stats.weeklyCheckIns}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <p className="text-gray-600">Monthly Check-ins</p>
            <p className="text-2xl font-bold">{profileData.stats.monthlyCheckIns}</p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 text-center">
            <p className="text-gray-600">Total Check-ins</p>
            <p className="text-2xl font-bold">{profileData.stats.totalCheckIns}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {profileData.badges.map((badge) => (
              <div
                key={badge.id}
                className="bg-gray-50 rounded-lg p-4 flex items-center"
              >
                <span className="text-2xl mr-3">{getBadgeEmoji(badge.badge_type)}</span>
                <div>
                  <p className="font-medium">{getBadgeTitle(badge.badge_type)}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(badge.awarded_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">Recent Check-ins</h2>
          <div className="space-y-4">
            {profileData.recentCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="border-b pb-4">
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    {new Date(checkIn.timestamp).toLocaleDateString()}
                  </p>
                  <p className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    +{checkIn.points_awarded} points
                  </p>
                </div>
                <img
                  src={checkIn.image_url}
                  alt="Check-in"
                  className="mt-2 rounded-lg w-full object-cover h-48"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
