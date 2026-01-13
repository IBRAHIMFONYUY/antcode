'use client';

import { useState, useEffect } from 'react';
import { useMentor } from '@/hooks/use-mentor';
import { useFirestore } from '@/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { UserProfile } from '@/firebase/auth/use-user';

const techExpertise = [
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'AWS',
  'Docker',
  'GraphQL',
  'MongoDB',
  'PostgreSQL',
  'Vue.js',
  'Angular',
  'Next.js',
  'DevOps',
  'UI/UX Design',
  'Machine Learning',
];

export default function MentorSettingsPage() {
  const { profile, loading: userLoading, user } = useMentor();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [expertise, setExpertise] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (profile && !userLoading) {
      setDisplayName(profile.displayName || '');
      setBio(profile.bio || '');
      setHourlyRate(profile.hourlyRate?.toString() || '');
      setExpertise(profile.expertise || []);
    }
  }, [profile, userLoading]);

  const handleAddExpertise = () => {
    if (selectedExpertise && !expertise.includes(selectedExpertise)) {
      setExpertise([...expertise, selectedExpertise]);
      setSelectedExpertise('');
    }
  };

  const handleRemoveExpertise = (item: string) => {
    setExpertise(expertise.filter((e) => e !== item));
  };

  const handleSaveChanges = async () => {
    if (!user || !firestore) return;

    if (!displayName.trim()) {
      setErrorMessage('Display name is required');
      return;
    }

    if (!hourlyRate || parseFloat(hourlyRate) <= 0) {
      setErrorMessage('Hourly rate must be greater than 0');
      return;
    }

    if (expertise.length === 0) {
      setErrorMessage('Please add at least one area of expertise');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          displayName,
          bio,
          hourlyRate: parseFloat(hourlyRate),
          expertise,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      toast({
        title: 'Success',
        description: 'Your mentor profile has been updated.',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save changes';
      setErrorMessage(message);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Mentor Settings</h1>
        <p className="text-muted-foreground">Manage your mentor profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Picture Section */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.photoURL} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName?.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Button variant="outline" disabled>
              Upload Photo (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Main Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your mentor profile details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {errorMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your full name"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hourly-rate">Hourly Rate ($)</Label>
              <Input
                id="hourly-rate"
                type="number"
                min="0"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="50"
                disabled={loading}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell students about yourself, your experience, and what you can help them with..."
                rows={4}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">{bio.length}/500 characters</p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="expertise-select">Areas of Expertise</Label>
              <div className="flex gap-2">
                <select
                  id="expertise-select"
                  value={selectedExpertise}
                  onChange={(e) => setSelectedExpertise(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-md border border-input bg-background text-foreground"
                  disabled={loading}
                >
                  <option value="">Select an expertise area...</option>
                  {techExpertise
                    .filter((exp) => !expertise.includes(exp))
                    .map((exp) => (
                      <option key={exp} value={exp}>
                        {exp}
                      </option>
                    ))}
                </select>
                <Button
                  type="button"
                  onClick={handleAddExpertise}
                  disabled={!selectedExpertise || loading}
                >
                  Add
                </Button>
              </div>

              {expertise.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {expertise.map((exp) => (
                    <div
                      key={exp}
                      className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm"
                    >
                      {exp}
                      <button
                        onClick={() => handleRemoveExpertise(exp)}
                        className="hover:opacity-70"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSaveChanges} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
