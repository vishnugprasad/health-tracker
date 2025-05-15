'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase/client';
import type { User, CheckIn } from '@/lib/supabase/client';

type AdminData = {
  users: User[];
  recentCheckIns: (CheckIn & { user: User })[];
};

export default function AdminPage() {
  const { data: session } = useSession();
  const [adminData, setAdminData] = useState<AdminData>({
    users: [],
    recentCheckIns: [],
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [pointsToAdd, setPointsToAdd] = useState<number>(0);
  const [reason, setReason] = useState<string>('');

  useEffect(() => {
    if (session) {
      checkAdminAccess();
      fetchAdminData();
    }
  }, [session]);

  const checkAdminAccess = () => {
    const adminIds = process.env.ADMIN_USER_IDS?.split(',') || [];
    const slackId = (session?.user as { slack_id?: string })?.slack_id || '';

    if (!adminIds.includes(slackId)) {
      window.location.href = '/';
    }
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('name');

      if (usersError) throw usersError;

      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .select(`
          *,
          user:users(*)
        `)
        .order('timestamp', { ascending: false })
        .limit(20);

      if (checkInsError) throw checkInsError;

      setAdminData({
        users: users || [],
        recentCheckIns: checkIns || [],
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPoints = async () => {
    if (!selectedUser || !pointsToAdd || !reason) return;

    try {
      const { data: user } = await supabase
        .from('users')
        .select('total_points')
        .eq('id', selectedUser)
        .single();

      if (!user) return;

      await supabase
        .from('users')
        .update({
          total_points: user.total_points + pointsToAdd,
        })
        .eq('id', selectedUser);

      await supabase
        .from('points_log')
        .insert({
          user_id: selectedUser,
          amount: pointsToAdd,
          source: `admin_adjustment: ${reason}`,
        });

      setSelectedUser('');
      setPointsToAdd(0);
      setReason('');
      fetchAdminData();
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const handleRemoveCheckIn = async (checkInId: string, userId: string, points: number) => {
    try {
      await supabase
        .from('check_ins')
        .delete()
        .eq('id', checkInId);

      const { data: user } = await supabase
        .from('users')
        .select('total_points')
        .eq('id', userId)
        .single();

      if (user) {
        await supabase
          .from('users')
          .update({
            total_points: Math.max(0, user.total_points - points),
          })
          .eq('id', userId);

        await supabase
          .from('points_log')
          .insert({
            user_id: userId,
            amount: -points,
            source: 'check_in_removal',
          });
      }

      fetchAdminData();
    } catch (error) {
      console.error('Error removing check-in:', error);
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
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      {/* Add Points Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Add Points</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="border rounded-lg p-2"
          >
            <option value="">Select User</option>
            {adminData.users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={pointsToAdd}
            onChange={(e) => setPointsToAdd(parseInt(e.target.value))}
            placeholder="Points"
            className="border rounded-lg p-2"
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason"
            className="border rounded-lg p-2"
          />
          <button
            onClick={handleAddPoints}
            disabled={!selectedUser || !pointsToAdd || !reason}
            className="bg-blue-600 text-white rounded-lg p-2 disabled:opacity-50"
          >
            Add Points
          </button>
        </div>
      </div>

      {/* Recent Check-ins */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Recent Check-ins</h2>
        <div className="space-y-4">
          {adminData.recentCheckIns.map((checkIn) => (
            <div key={checkIn.id} className="border-b pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {checkIn.user.photo_url && (
                    <img
                      src={checkIn.user.photo_url}
                      alt={checkIn.user.name}
                      className="h-8 w-8 rounded-full mr-2"
                    />
                  )}
                  <div>
                    <p className="font-medium">{checkIn.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(checkIn.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    +{checkIn.points_awarded} points
                  </p>
                  <button
                    onClick={() => handleRemoveCheckIn(checkIn.id, checkIn.user_id, checkIn.points_awarded)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <img
                src={checkIn.image_url}
                alt="Check-in"
                className="rounded-lg w-full object-cover h-48"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
