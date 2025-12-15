'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const techCareers = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
];

export default function OnboardingPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [techCareer, setTechCareer] = useState('');
  const [loading, setLoading] = useState(false);
  
  if (userLoading) {
    return <div className='flex items-center justify-center h-screen'><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }
  
  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;
    
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
        await setDoc(doc(firestore, 'users', user.uid), {
            techCareer: techCareer,
        }, { merge: true });

        toast({
            title: 'Profile Updated',
            description: 'Your tech career has been saved.',
        });
        
        router.push('/dashboard');

    } catch (error: any) {
        console.error("Onboarding error:", error);
        toast({
            variant: 'destructive',
            title: 'Update Failed',
            description: error.message,
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="dark flex min-h-screen flex-col items-center justify-center bg-background p-4 text-foreground">
        <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>
            Just one more step. Please tell us about your career path.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleOnboardingSubmit} className="grid gap-4">
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
                <Button type="submit" className="w-full" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Continue to Dashboard
                </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
}
