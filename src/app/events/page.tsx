'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/contexts/EventContext';
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  Clock,
  Users,
  Trophy,
  Zap,
  Star,
  Target,
  SlidersHorizontal,
} from 'lucide-react';

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setEvents(mockEvents);
    setFilteredEvents(mockEvents);
  }, []);

  useEffect(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
      const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
      const matchesDifficulty = selectedDifficulty === 'all' || event.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    });

    // Sort events
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime();
        case 'popularity':
          return b.registrationCount - a.registrationCount;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'prize':
          return b.prizes.length - a.prizes.length;
        default:
          return 0;
      }
    });

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedCategory, selectedStatus, selectedDifficulty, sortBy]);

  const categories = [
    { value: 'all', label: 'All Categories', icon: Star },
    { value: 'hackathon', label: 'Hackathons', icon: Zap },
    { value: 'competition', label: 'Competitions', icon: Trophy },
    { value: 'workshop', label: 'Workshops', icon: Target },
    { value: 'conference', label: 'Conferences', icon: Users },
  ];

  const statuses = [
    { value: 'all', label: 'All Status' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'ongoing', label: 'Ongoing' },
    { value: 'completed', label: 'Completed' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'popularity', label: 'Popularity' },
    { value: 'alphabetical', label: 'Alphabetical' },
    { value: 'prize', label: 'Prize Pool' },
  ];

  const getStatusCounts = () => {
    return {
      all: events.length,
      upcoming: events.filter(e => e.status === 'upcoming').length,
      ongoing: events.filter(e => e.status === 'ongoing').length,
      completed: events.filter(e => e.status === 'completed').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Discover Amazing Events
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join hackathons, competitions, workshops, and conferences from around the world.
                Find your next opportunity to learn, build, and connect.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="text-center hover-lift">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
                  <div className="text-sm text-muted-foreground">Total Events</div>
                </CardContent>
              </Card>
              <Card className="text-center hover-lift">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{statusCounts.ongoing}</div>
                  <div className="text-sm text-muted-foreground">Live Now</div>
                </CardContent>
              </Card>
              <Card className="text-center hover-lift">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">{statusCounts.upcoming}</div>
                  <div className="text-sm text-muted-foreground">Upcoming</div>
                </CardContent>
              </Card>
              <Card className="text-center hover-lift">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-muted-foreground">Participants</div>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  placeholder="Search events, organizers, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-6 text-lg bg-white/80 backdrop-blur border-white/20 shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Content */}
        <section className="py-8 px-4">
          <div className="container mx-auto">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>

            {/* Advanced Filters */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filters</span>
                </Button>
                
                {showFilters && (
                  <div className="flex flex-wrap gap-3">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statuses.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map((difficulty) => (
                          <SelectItem key={difficulty.value} value={difficulty.value}>
                            {difficulty.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </span>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        Sort by {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-16">
                <CardContent>
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or browse all events.
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                      setSelectedStatus('all');
                      setSelectedDifficulty('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Load More */}
            {filteredEvents.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Events
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default EventsPage;
