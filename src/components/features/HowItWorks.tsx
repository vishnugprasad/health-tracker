import { StepCard } from "@/components/ui/StepCard";

export function HowItWorks() {
  return (
    <section className="container mx-auto px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
        How It Works
      </h2>

      <div className="max-w-4xl mx-auto space-y-12">
        <StepCard
          number={1}
          title="Sign in with Slack"
          description="Use your work Slack account to join the fitness community."
        />
        <StepCard
          number={2}
          title="Post Your Workouts"
          description="Share photos of your gym sessions in the #health Slack channel. Each post counts as a check-in and earns you points."
        />
        <StepCard
          number={3}
          title="Participate in Challenges"
          description="Join various fitness challenges to compete with colleagues and earn special badges."
        />
        <StepCard
          number={4}
          title="Track Your Progress"
          description="Monitor your achievements, view your ranking on the leaderboard, and collect badges for milestones."
        />
      </div>
    </section>
  );
} 