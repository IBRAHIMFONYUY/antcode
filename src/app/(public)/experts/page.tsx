'use client';
import { useState, useMemo } from 'react';
import { ExpertCard } from '@/components/expert-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { experts } from '@/lib/data';

export default function ExpertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');

  // Filter experts based on search and selected filters
  const filteredExperts = useMemo(() => {
    return experts.filter((expert) => {
      const matchesSearch =
        expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expert.expertise.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesSkill = selectedSkill ? expert.expertise.includes(selectedSkill) : true;
      const matchesIndustry = selectedIndustry ? expert.company === selectedIndustry : true;

      return matchesSearch && matchesSkill && matchesIndustry;
    });
  }, [searchQuery, selectedSkill, selectedIndustry]);

  return (
    <div className="container py-12">
      <div className="mb-10 text-center">
        <h1 className="font-headline text-4xl font-bold tracking-tight">Find Your Mentor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse our curated list of industry experts and find the perfect mentor for your career goals.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 md:flex-row">
        <Input
          placeholder="Search by name or keyword..."
          className="flex-grow"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex gap-4">
          <Select onValueChange={(value) => setSelectedSkill(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="AWS">AWS</SelectItem>
              <SelectItem value="UI/UX">UI/UX</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => setSelectedIndustry(value)}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SaaS">S</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Fintech">Fintech</SelectItem>
              <SelectItem value="Healthtech">Healthtech</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExperts.length > 0 ? (
          filteredExperts.map((expert) => <ExpertCard key={expert.id} expert={expert} />)
        ) : (
          <p className="text-center col-span-full text-muted-foreground">
            No experts found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
}
