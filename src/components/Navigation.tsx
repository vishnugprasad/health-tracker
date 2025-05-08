'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { memo } from 'react';

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavLink = memo(({ href, icon, label, isActive }: NavLinkProps) => (
  <Link 
    href={href} 
    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600' 
        : 'text-slate-600 hover:text-emerald-600'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
));

NavLink.displayName = 'NavLink';

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isAdmin = () => {
    const adminIds = process.env.NEXT_PUBLIC_ADMIN_USER_IDS?.split(',') || [];
    return session?.user?.slack_id && adminIds.includes(session.user.slack_id);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
            <span className="text-white font-bold">FT</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
            Fitness Tracker
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {isAdmin() && (
            <NavLink
              href="/admin"
              icon={<Settings className="h-5 w-5" />}
              label="Admin"
              isActive={isActive('/admin')}
            />
          )}
        </div>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <div className="flex items-center gap-2">
                <img 
                  src={session.user?.image || ''} 
                  alt={session.user?.name || ''} 
                  className="h-8 w-8 rounded-full"
                  loading="lazy"
                />
                <span className="text-slate-600">{session.user?.name}</span>
              </div>
              <Button 
                onClick={() => signOut()}
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-500/10"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => signIn('slack')}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-none"
            >
              Sign in with Slack
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 