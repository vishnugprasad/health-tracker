import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, Mail, XCircle } from 'lucide-react';

export const EmailVerification = () => {
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleResendVerification = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: session?.user.email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification email');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (session?.user.email_verified) {
    return (
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Email Verified</AlertTitle>
        <AlertDescription>
          Your email address has been verified successfully.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Please verify your email address to access all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert variant="success" className="mb-4">
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Verification email sent! Please check your inbox.
            </AlertDescription>
          </Alert>
        )}
        <div className="flex items-center gap-4">
          <Mail className="h-6 w-6 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">{session?.user.email}</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to resend the verification email.
            </p>
          </div>
        </div>
        <Button
          onClick={handleResendVerification}
          disabled={isLoading}
          className="mt-4"
        >
          {isLoading ? 'Sending...' : 'Resend Verification Email'}
        </Button>
      </CardContent>
    </Card>
  );
}; 