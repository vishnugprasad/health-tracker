'use client';

import { HeroSection } from "@/components/features/HeroSection";
import { HomeFeatures } from "@/components/features/HomeFeatures";
import { HowItWorks } from "@/components/features/HowItWorks";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 text-slate-800 overflow-hidden">
      <HeroSection />
      <HomeFeatures />
      <HowItWorks />
    </div>
  );
}
