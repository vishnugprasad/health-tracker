import { useSession, signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const SignInButton = () => (
  <Button
    onClick={() => signIn('slack')}
    size="lg"
    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none px-8 py-6 text-lg rounded-full shadow-lg shadow-emerald-500/20 transition-all hover:shadow-emerald-500/40"
  >
    <span>Sign in with Slack to Get Started</span>
    <ArrowRight className="ml-2 h-5 w-5" />
  </Button>
);

export function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="container mx-auto px-4 py-20 pb-32 relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[150px] opacity-10"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500 rounded-full filter blur-[150px] opacity-10"></div>

      <div className="flex flex-col items-center justify-center py-32">
      <div className="max-w-4xl mx-auto text-center relative z-10 pb-32 ">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 pb-16">
          Track Your Fitness Journey Together
        </h2>
        <p className="text-xl text-slate-600 mb-8">
          Join your colleagues in staying fit and healthy. Share your progress, earn points, and compete in challenges.
        </p>
        {!session && <SignInButton />}
      </div>
      </div>
    </section>
  );
} 