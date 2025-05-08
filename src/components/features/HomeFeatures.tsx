import { BarChart3, Camera, Trophy } from "lucide-react";
import { FeatureCard } from "@/components/ui/FeatureCard";

export function HomeFeatures() {
  return (
    <section className="container mx-auto px-4 py-20 relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={Camera}
          title="Easy Check-ins"
          description="Simply post a photo in the #health Slack channel to log your gym activity and earn points."
          gradientFrom="emerald"
          gradientTo="teal"
        />
        <FeatureCard
          icon={Trophy}
          title="Compete & Win"
          description="Join weekly, monthly, and quarterly challenges to compete with your colleagues and win badges."
          gradientFrom="teal"
          gradientTo="emerald"
        />
        <FeatureCard
          icon={BarChart3}
          title="Track Progress"
          description="Monitor your fitness journey with detailed stats and leaderboards to stay motivated."
          gradientFrom="cyan"
          gradientTo="teal"
        />
      </div>
    </section>
  );
} 