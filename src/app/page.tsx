'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Trophy, BarChart3, ArrowRight, Sparkles, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-16">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-[40%] -right-[10%] w-[70%] h-[70%] rounded-full bg-cyan-100/30 blur-3xl"></div>
          <div className="absolute -bottom-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/30 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <Badge variant="outline" className="mb-4 px-3 py-1 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              Team Fitness Made Simple
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-emerald-700 to-cyan-700 bg-clip-text text-transparent">
              Track Your Fitness Journey Together
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-8">
              Join your colleagues in staying fit and healthy. Share your progress, earn points, and compete in
              challenges.
            </p>

            <Button
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-full px-8 h-12 shadow-lg shadow-emerald-500/20"
            >
              Sign in with Slack to Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Floating Device Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-[16/9] rounded-xl overflow-hidden shadow-2xl shadow-slate-900/10 border border-slate-200 bg-white">
              <img
                src="/fitness-dashboard.png"
                alt="Fitness Tracker Dashboard"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200 hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Daily Goal</div>
                  <div className="text-xs text-slate-500">8,546 / 10,000 steps</div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-slate-200 hidden md:block">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-cyan-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">Team Rank</div>
                  <div className="text-xs text-slate-500">#2 this week</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-500"></div>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Easy Check-ins</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Simply post a photo in the #health Slack channel to log your gym activity and earn points.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 to-cyan-500"></div>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Compete & Win</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Join weekly, monthly, and quarterly challenges to compete with your colleagues and win badges.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-slate-200 shadow-lg shadow-slate-900/5 hover:shadow-xl hover:shadow-slate-900/10 transition-all duration-300 overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-500"></div>
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-bold text-slate-800">Track Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor your fitness journey with detailed stats and leaderboards to stay motivated.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              How It Works
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-cyan-500 to-blue-500 hidden sm:block"></div>

              <div className="space-y-12 relative">
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-lg shadow-emerald-500/20 border border-slate-200 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                      1
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200 flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Sign in with Slack</h3>
                    <p className="text-slate-600">Use your work Slack account to join the fitness community.</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-lg shadow-cyan-500/20 border border-slate-200 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                      2
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200 flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Post Your Workouts</h3>
                    <p className="text-slate-600">
                      Share photos of your gym sessions in the #health Slack channel. Each post counts as a check-in and
                      earns you points.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-lg shadow-blue-500/20 border border-slate-200 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                      3
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200 flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Participate in Challenges</h3>
                    <p className="text-slate-600">
                      Join various fitness challenges to compete with colleagues and earn special badges.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 md:w-24 md:h-24 rounded-full bg-white shadow-lg shadow-purple-500/20 border border-slate-200 flex items-center justify-center z-10">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-400 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      4
                    </div>
                  </div>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg shadow-slate-900/5 border border-slate-200 flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Progress</h3>
                    <p className="text-slate-600">
                      Monitor your achievements, view your ranking on the leaderboard, and collect badges for
                      milestones.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-2xl p-8 md:p-12 shadow-xl shadow-slate-900/5 border border-slate-200 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-emerald-200/30 blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-cyan-200/30 blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-cyan-700 bg-clip-text text-transparent">
                Ready to Start Your Fitness Journey?
              </h2>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                Join your colleagues today and transform your workplace into a healthier, more active community.
              </p>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 rounded-full px-8 h-12 shadow-lg shadow-emerald-500/20"
              >
                Sign in with Slack
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-200 bg-white/70 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                FT
              </div>
              <span className="text-lg font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
                Fitness Tracker
              </span>
            </div>

            <div className="text-sm text-slate-500">
              © {new Date().getFullYear()} Fitness Tracker. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
