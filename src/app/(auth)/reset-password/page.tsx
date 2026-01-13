'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { handleError, logError } from '@/utils/error-handler';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ResetPasswordPage() {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const oobCode = searchParams.get('oobCode');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!auth || !oobCode) {
      setErrorMessage('Invalid reset link');
      setVerifying(false);
      return;
    }

    const verifyCode = async () => {
      try {
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setVerifying(false);
      } catch (error) {
        const appError = handleError(error);
        logError(appError);
        setErrorMessage(appError.message);
        setVerifying(false);
      }
    };

    verifyCode();
  }, [auth, oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !oobCode) return;

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      await confirmPasswordReset(auth, oobCode, password);
      setSubmitted(true);
      toast({
        title: 'Success',
        description: 'Your password has been reset successfully',
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

  if (verifying) {
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying reset link...</p>
        </CardContent>
      </Card>
    );
  }

  if (submitted) {
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Password Reset Successful</h2>
          <p className="mt-2 text-muted-foreground text-center max-w-sm">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Button className="mt-6" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (errorMessage && !email) {
    return (
      <Card className="mx-auto w-full max-w-sm">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="text-muted-foreground text-center">
            The reset link may have expired or is invalid. Please request a new one.
          </p>
          <Button className="mt-6" onClick={() => router.push('/forgot-password')}>
            Request New Link
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Create New Password</CardTitle>
        <CardDescription>
          {email && `Enter a new password for ${email}`}
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
            <Label htmlFor="password">New Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Remembered your password?{' '}
          <Link href="/login" className="underline">
            Back to Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
