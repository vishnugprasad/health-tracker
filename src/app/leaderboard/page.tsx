'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '@/lib/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ChevronUp } from "lucide-react";

type TimeFilter = 'week' | 'month' | 'quarter' | 'year' | 'all';

type LeaderboardUser = {
  id: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  change: string;
  streak: number;
  badges: string[];
  isCurrentUser: boolean;
};

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchLeaderboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, timeFilter]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("total_points", { ascending: false });

    if (error) {
      setLoading(false);
      return;
    }

    // Map your user data to the UI structure
    const rankedUsers = data.map((user: any, index: number): LeaderboardUser => ({
      id: user.id,
      name: user.name,
      avatar: user.photo_url || "/placeholder.svg?height=40&width=40",
      points: user.total_points,
      rank: index + 1,
      change: "up", // You can compute this if you have previous data
      streak: user.streak || Math.floor(Math.random() * 20), // Replace with real streak if available
      badges: user.badges || [], // Replace with real badges if available
      isCurrentUser: user.id === (session?.user as any)?.id,
    }));

    setUsers(rankedUsers);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Leaderboard
          </h1>
          <Tabs defaultValue={timeFilter} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-5 md:flex w-full md:w-auto bg-slate-100/80 backdrop-blur-sm">
              {(["week", "month", "quarter", "year", "all"] as TimeFilter[]).map((filter) => (
                <TabsTrigger
                  key={filter}
                  value={filter}
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white"
                  onClick={() => setTimeFilter(filter)}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Leaderboard Cards */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className={`
                relative overflow-hidden rounded-xl border border-slate-200 
                ${user.rank <= 3 ? "bg-gradient-to-r from-white to-blue-50/50" : "bg-white/80"} 
                backdrop-blur-sm shadow-sm hover:shadow-md transition-all
                ${user.isCurrentUser ? "ring-2 ring-emerald-200" : ""}
              `}
            >
              {user.rank <= 3 && (
                <div className="absolute top-0 right-0 w-24 h-24 -mt-12 -mr-12 bg-gradient-to-br from-yellow-300/20 to-yellow-500/20 rounded-full blur-xl"></div>
              )}

              <div className="flex items-center p-4 md:p-5 gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 md:w-12 flex items-center justify-center">
                  <div
                    className={`
                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-lg
                    ${
                      user.rank === 1
                        ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-white"
                        : user.rank === 2
                          ? "bg-gradient-to-r from-slate-300 to-slate-400 text-white"
                          : user.rank === 3
                            ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white"
                            : "bg-slate-100 text-slate-700"
                    }
                  `}
                  >
                    {user.rank}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <Avatar
                    className={`h-12 w-12 md:h-14 md:w-14 border-2 ${user.rank === 1 ? "border-yellow-400" : user.rank === 2 ? "border-slate-300" : user.rank === 3 ? "border-amber-600" : "border-slate-200"}`}
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-slate-100">
                      {user.name.charAt(0)}
                      {user.name.split(" ")[1]?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg text-slate-800 truncate">{user.name}</h3>
                    {user.change === "up" && (
                      <span className="text-emerald-500 flex items-center text-xs">
                        <ChevronUp className="h-3 w-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                      <Zap className="h-3 w-3 mr-1 text-amber-500" />
                      {user.streak} day streak
                    </Badge>

                    {user.badges?.includes("steps") && (
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        10K Steps
                      </Badge>
                    )}

                    {user.badges?.includes("gym") && (
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100">
                        Gym Pro
                      </Badge>
                    )}

                    {user.badges?.includes("marathon") && (
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100">
                        Marathon
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                    {user.points?.toLocaleString()}
                  </div>
                  <div className="text-xs text-slate-500">points</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 