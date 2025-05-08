'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase/client';
import type { Challenge, ChallengeParticipant, User } from '@/lib/supabase/client';

type ChallengeWithParticipants = Challenge & {
  participants: (ChallengeParticipant & { user: User })[];
};

export default function ChallengesPage() {
  const { data: session } = useSession();
  const [activeChallenges, setActiveChallenges] = useState<ChallengeWithParticipants[]>([]);
  const [pastChallenges, setPastChallenges] = useState<ChallengeWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchChallenges();
    }
  }, [session]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);
      const now = new Date().toISOString();

      // Fetch active challenges
      const { data: activeData, error: activeError } = await supabase
        .from('challenges')
        .select(`
          *,
          participants:challenge_participants(
            *,
            user:users(*)
          )
        `)
        .lte('start_date', now)
        .gte('end_date', now)
        .order('end_date', { ascending: true });

      if (activeError) throw activeError;

      // Fetch past challenges
      const { data: pastData, error: pastError } = await supabase
        .from('challenges')
        .select(`
          *,
          participants:challenge_participants(
            *,
            user:users(*)
          )
        `)
        .lt('end_date', now)
        .order('end_date', { ascending: false })
        .limit(10);

      if (pastError) throw pastError;

      setActiveChallenges(activeData || []);
      setPastChallenges(pastData || []);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!session?.user?.id) return;

    try {
      await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_id: session.user.id,
        });

      fetchChallenges();
    } catch (error) {
      console.error('Error joining challenge:', error);
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  const isParticipating = (challenge: ChallengeWithParticipants) => {
    return challenge.participants.some(p => p.user_id === session?.user?.id);
  };

  const getLeaderboard = (participants: (ChallengeParticipant & { user: User })[]) => {
    return [...participants].sort((a, b) => b.points - a.points).slice(0, 3);
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
      <h1 className="text-3xl font-bold mb-8">Fitness Challenges</h1>

      {/* Active Challenges */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Active Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{challenge.title}</h3>
                  <p className="text-gray-600">{formatDateRange(challenge.start_date, challenge.end_date)}</p>
                </div>
                {!isParticipating(challenge) && (
                  <button
                    onClick={() => joinChallenge(challenge.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                  >
                    Join Challenge
                  </button>
                )}
              </div>
              <p className="text-gray-700 mb-4">{challenge.description}</p>
              <div>
                <h4 className="font-bold mb-2">Current Leaders</h4>
                <div className="space-y-2">
                  {getLeaderboard(challenge.participants).map((participant, index) => (
                    <div key={participant.id} className="flex items-center">
                      <span className="text-lg mr-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <div className="flex items-center">
                        {participant.user.photo_url && (
                          <img
                            src={participant.user.photo_url}
                            alt={participant.user.name}
                            className="h-6 w-6 rounded-full mr-2"
                          />
                        )}
                        <span className="font-medium">{participant.user.name}</span>
                      </div>
                      <span className="ml-auto">{participant.points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Challenges */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Past Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pastChallenges.map((challenge) => (
            <div key={challenge.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="mb-4">
                <h3 className="text-xl font-bold">{challenge.title}</h3>
                <p className="text-gray-600">{formatDateRange(challenge.start_date, challenge.end_date)}</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">Final Results</h4>
                <div className="space-y-2">
                  {getLeaderboard(challenge.participants).map((participant, index) => (
                    <div key={participant.id} className="flex items-center">
                      <span className="text-lg mr-2">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </span>
                      <div className="flex items-center">
                        {participant.user.photo_url && (
                          <img
                            src={participant.user.photo_url}
                            alt={participant.user.name}
                            className="h-6 w-6 rounded-full mr-2"
                          />
                        )}
                        <span className="font-medium">{participant.user.name}</span>
                      </div>
                      <span className="ml-auto">{participant.points} points</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 