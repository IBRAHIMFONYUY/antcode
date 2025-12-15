'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const techCareers = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
];

export default function SignupPage() {
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [techCareer, setTechCareer] = useState('');
  const [role, setRole] = useState(searchParams.get('role') === 'mentor' ? 'mentor' : 'student');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    if (!techCareer) {
        toast({
            variant: 'destructive',
            title: 'Missing Information',
            description: 'Please select your tech career.',
        });
        return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await setDoc(doc(firestore, 'users', user.uid), {
        uid: user.uid,
        displayName: fullName,
        email: user.email,
        role: role,
        techCareer: techCareer,
        createdAt: new Date(),
      });
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        variant: 'destructive',
        title: 'Signup Failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth || !firestore) return;
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user already exists to decide on redirection
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().techCareer) {
         router.push('/dashboard');
      } else {
        // New user or existing user without a tech career, save basic info and redirect
        await setDoc(userDocRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            role: role, // Persist role from selection
            createdAt: new Date(),
        }, { merge: true });
        router.push('/onboarding');
      }
    } catch (error: any) {
      console.error("Google Sign-in error:", error);
       toast({
        variant: 'destructive',
        title: 'Google Sign-in Failed',
        description: error.message,
      });
    } finally {
      setGoogleLoading(false);
    }
  };
  
  if (userLoading) {
    return <div className='flex items-center justify-center h-screen'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  // Redirect logged-in users who land here
  if (user) {
    router.push('/dashboard');
    return null;
  }

  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full name</Label>
            <Input 
              id="full-name" 
              placeholder="Max Robinson" 
              required 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

           <div className="grid gap-2">
            <Label htmlFor="tech-career">Tech Career</Label>
            <Select onValueChange={setTechCareer} value={techCareer}>
                <SelectTrigger id="tech-career">
                    <SelectValue placeholder="Select your career path" />
                </SelectTrigger>
                <SelectContent>
                    {techCareers.map((career) => (
                        <SelectItem key={career} value={career}>
                            {career}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>


          <div className="grid gap-2">
            <Label>I am a...</Label>
            <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-2 gap-4">
              <div>
                <RadioGroupItem value="student" id="student" className="peer sr-only" />
                <Label
                  htmlFor="student"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Student
                </Label>
              </div>
              <div>
                <RadioGroupItem value="mentor" id="mentor" className="peer sr-only" />
                <Label
                  htmlFor="mentor"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                >
                  Mentor
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create an account
          </Button>
        </form>
         <Button variant="outline" className="w-full mt-4" onClick={handleGoogleSignIn} disabled={googleLoading}>
           {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 56.4l-64.4 64.4c-22.6-21.5-55.2-34.6-92.8-34.6-69.5 0-126.4 56.2-126.4 125.7s56.8 125.7 126.4 126.4c76.1 0 104.4-32.6 108.8-48.5H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          }
          Sign up with Google
        </Button>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
