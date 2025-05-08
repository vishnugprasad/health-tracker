'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@/lib/supabase/client';

type TimeFilter = 'week' | 'month' | 'quarter' | 'year' | 'all';

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<(User & { rank: number })[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchLeaderboard();
    }
  }, [session, timeFilter]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('total_points', { ascending: false });

      if (error) throw error;

      // Add rank to each user
      const rankedUsers = data.map((user, index) => ({
        ...user,
        rank: index + 1
      }));

      setUsers(rankedUsers);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Leaderboard</h1>
          <div className="flex gap-2">
            {(['week', 'month', 'quarter', 'year', 'all'] as TimeFilter[]).map((filter) => (
              <button
                key={filter}
                onClick={() => setTimeFilter(filter)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  timeFilter === filter
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-4 ${
                  user.id === session?.user?.id ? 'bg-emerald-50' : ''
                }`}
              >
                <div className="w-12 text-center">
                  {user.rank <= 3 ? (
                    <span className="text-2xl">
                      {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-gray-500 font-medium">#{user.rank}</span>
                  )}
                </div>
                <div className="flex items-center flex-1">
                  {user.photo_url && (
                    <img
                      src={user.photo_url}
                      alt={user.name}
                      className="h-10 w-10 rounded-full mr-4"
                    />
                  )}
                  <span className="font-medium">{user.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-emerald-600">
                    {user.total_points} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 