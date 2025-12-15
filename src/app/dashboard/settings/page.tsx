'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

const techCareers = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "Data Scientist",
    "UI/UX Designer",
    "DevOps Engineer",
    "Mobile Developer",
];

export default function SettingsPage() {
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const router = useRouter();

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [bio, setBio] = useState('');
    const [techCareer, setTechCareer] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && firestore) {
            const fetchUserData = async () => {
                const userDocRef = doc(firestore, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setDisplayName(userData.displayName || '');
                    setEmail(userData.email || '');
                    setBio(userData.bio || '');
                    setTechCareer(userData.techCareer || '');
                }
            };
            fetchUserData();
        }
    }, [user, firestore]);
    
    if (userLoading) {
        return <div className='flex items-center justify-center h-full'><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    if (!user) {
        router.push('/login');
        return null;
    }

    const handleSaveChanges = async () => {
        if (!user || !firestore) return;

        setLoading(true);
        try {
            // Update displayName in Firebase Auth
            if (user.displayName !== displayName) {
                await updateProfile(user, { displayName });
            }

            // Update user document in Firestore
            const userDocRef = doc(firestore, 'users', user.uid);
            await setDoc(userDocRef, {
                displayName,
                bio,
                techCareer
            }, { merge: true });

            toast({
                title: 'Success',
                description: 'Your profile has been updated.',
            });

        } catch (error: any) {
            console.error("Profile update error:", error);
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
        <div className="grid gap-8">
            <div>
                <h1 className="font-headline text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and personal information.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>Update your personal information here.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" value={email} disabled />
                        </div>
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
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us a little about yourself" value={bio} onChange={(e) => setBio(e.target.value)} />
                    </div>
                    <div className="flex justify-end">
                        <Button onClick={handleSaveChanges} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
