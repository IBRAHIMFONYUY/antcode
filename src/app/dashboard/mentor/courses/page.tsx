'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';
import { useMentor } from '@/hooks/use-mentor';
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  enrolledStudents: number;
  rating: number;
  price: number;
  isPublished: boolean;
  ownerId: string;
  createdAt: any;
}

export default function MentorCoursesPage() {
  const { profile, loading: mentorLoading, user } = useMentor();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner' as const,
    price: '49.99',
  });

  // Load mentor's courses
  useEffect(() => {
    if (!firestore || !user) return;
    const loadCourses = async () => {
      try {
        setLoading(true);
        const q = query(collection(firestore, 'courses'), where('ownerId', '==', user.uid));
        const snap = await getDocs(q);
        const loaded = snap.docs.map(doc => ({
          ...(doc.data() as any),
          id: doc.id,
          enrolledStudents: doc.data().enrolledStudents || 0,
          rating: doc.data().rating || 0,
        })) as Course[];
        setCourses(loaded);
      } catch (err) {
        console.error('Load courses error', err);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [firestore, user]);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user) return;

    if (!formData.title || !formData.description || !formData.category) {
      toast({
        variant: 'destructive',
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
      });
      return;
    }

    try {
      setLoading(true);
      await addDoc(collection(firestore, 'courses'), {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        price: parseFloat(formData.price),
        ownerId: user.uid,
        isPublished: true,
        enrolledStudents: 0,
        rating: 0,
        createdAt: serverTimestamp(),
      });

      toast({
        title: 'Course Created',
        description: 'Your course has been published and is now visible to students.',
      });

      // Reset form and close dialog
      setFormData({ title: '', description: '', category: '', level: 'beginner', price: '49.99' });
      setIsDialogOpen(false);

      // Reload courses
      const q = query(collection(firestore, 'courses'), where('ownerId', '==', user.uid));
      const snap = await getDocs(q);
      const loaded = snap.docs.map(doc => ({
        ...(doc.data() as any),
        id: doc.id,
      })) as Course[];
      setCourses(loaded);
    } catch (err) {
      console.error('Create course error', err);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to create course. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (mentorLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your teaching courses</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Course</DialogTitle>
              <DialogDescription>
                Add a new course to your catalog. Students will be able to enroll and complete tasks.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., React Advanced Patterns"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="React">React</SelectItem>
                      <SelectItem value="Backend">Backend</SelectItem>
                      <SelectItem value="Frontend">Frontend</SelectItem>
                      <SelectItem value="DevOps">DevOps</SelectItem>
                      <SelectItem value="Database">Database</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="level">Level</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value as any })}>
                    <SelectTrigger id="level">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="49.99"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  min="0"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Course
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Courses</CardTitle>
          <CardDescription>
            You have {courses.length} course{courses.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground mb-4">No courses yet. Create your first course to get started!</p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-destructive hover:text-destructive" disabled>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary">{course.category}</Badge>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                    {course.isPublished && (
                      <Badge variant="default">Published</Badge>
                    )}
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Enrolled</p>
                      <p className="font-semibold">{course.enrolledStudents}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Rating</p>
                      <p className="font-semibold">{course.rating.toFixed(1)}/5</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Price</p>
                      <p className="font-semibold">${course.price.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-muted-foreground text-xs mb-1">Revenue</p>
                      <p className="font-semibold">
                        ${(course.price * course.enrolledStudents).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
