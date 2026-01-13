'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { handleError, logError } from '@/utils/error-handler';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !email.trim()) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: `${window.location.origin}/login`,
        handleCodeInApp: true,
      });

      setSubmitted(true);
      toast({
        title: 'Email Sent',
        description: 'Check your email for the password reset link.',
      });
    } catch (error) {
      const appError = handleError(error);
      logError(appError);
      setErrorMessage(appError.message);
      toast({
        variant: 'destructive',
        title: appError.title,
        description: appError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Check Your Email</h2>
          <p className="mt-2 text-muted-foreground text-center max-w-sm">
            We've sent a password reset link to <strong>{email}</strong>. Please check your email and follow the instructions to reset your password.
          </p>
          <p className="mt-4 text-sm text-muted-foreground text-center">
            Didn't receive the email? Check your spam folder.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => router.push('/login')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Reset Password</CardTitle>
        <CardDescription>
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          {errorMessage && (
            <Alert variant="destructive">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Enter the email address associated with your account
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || !email.trim()}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Reset Link
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Remember your password?{' '}
          <Link href="/login" className="underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
