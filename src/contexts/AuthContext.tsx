import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { AuthState, User } from '@/types/auth';

const AuthContext = createContext<AuthState>({
  session: null,
  status: 'loading',
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const [authState, setAuthState] = useState<AuthState>({
    session: null,
    status: 'loading',
  });

  useEffect(() => {
    if (session) {
      const user = session.user as User;
      setAuthState({
        session: {
          user: {
            ...user,
            notification_preferences: {
              email: true,
              slack: true,
              challenges: true,
              leaderboard: true,
              achievements: true,
              ...user.notification_preferences,
            },
          },
          expires: session.expires,
          company: session.company,
        },
        status: 'authenticated',
      });
    } else {
      setAuthState({
        session: null,
        status: 'unauthenticated',
      });
    }
  }, [session, status]);

  return (
    <AuthContext.Provider value={authState}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 