'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Filter,
  Search,
  Globe,
  Tag,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEvents, useEventSearch, Event } from '@/hooks/useEvents';

const EventsPage = () => {
  const { events: allEvents, loading: eventsLoading, error: eventsError, refetch } = useEvents();
  const { events: searchResults, loading: searchLoading, searchEvents } = useEventSearch();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);

  // Helper function to extract first prize amount
  const getFirstPrize = (prizesString: string): number => {
    const firstPrizeMatch = prizesString.match(/1st[:\s]*\$?(\d+(?:,\d+)*)/i);
    if (firstPrizeMatch) {
      return parseInt(firstPrizeMatch[1].replace(/,/g, ''));
    }
    const fallbackMatch = prizesString.match(/\$(\d+(?:,\d+)*)/);
    if (fallbackMatch) {
      return parseInt(fallbackMatch[1].replace(/,/g, ''));
    }
    return 0;
  };

  // Helper function to extract tracks as tags
  const getTracks = (tracksString: string): string[] => {
    return tracksString.split(',').map(track => track.trim()).slice(0, 4);
  };

  const events = isSearching ? searchResults : allEvents;
  const loading = isSearching ? searchLoading : eventsLoading;

  const handleSearch = async () => {
    if (searchQuery.trim() || (selectedMode !== 'all') || (selectedTheme !== 'all')) {
      setIsSearching(true);
      await searchEvents({
        query: searchQuery.trim() || undefined,
        mode: selectedMode !== 'all' ? selectedMode : undefined,
        theme: selectedTheme !== 'all' ? selectedTheme : undefined,
      });
    } else {
      setIsSearching(false);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedMode('all');
    setSelectedTheme('all');
    setIsSearching(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedMode, selectedTheme]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.StartDate);
    const endDate = new Date(event.EndDate);

    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'ongoing';
    return 'completed';
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "destructive" | "outline" | "secondary" | null | undefined; label: string }> = {
      upcoming: { variant: 'default', label: 'Upcoming' },
      ongoing: { variant: 'destructive', label: 'Live' },
      completed: { variant: 'secondary', label: 'Completed' },
    };
    
    const statusInfo = variants[status] || variants.upcoming;
    return (
      <Badge variant={statusInfo.variant} className="text-xs">
        {statusInfo.label}
      </Badge>
    );
  };

  if (eventsError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events</h1>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load events: {eventsError}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refetch}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-muted-foreground">
            Discover and participate in exciting hackathons and competitions
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/events/create">
            <Trophy className="h-4 w-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Find Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search events, themes, organizers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="ai">AI/ML</SelectItem>
                <SelectItem value="web">Web Dev</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
              </SelectContent>
            </Select>
            {(searchQuery || (selectedMode !== 'all') || (selectedTheme !== 'all')) && (
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Events Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading events...</span>
        </div>
      ) : events.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground text-center mb-4">
              {isSearching 
                ? "Try adjusting your search criteria or filters"
                : "There are no events available at the moment"
              }
            </p>
            {isSearching && (
              <Button variant="outline" onClick={handleClearFilters}>
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const status = getEventStatus(event);
            return (
              <Card key={event.EventID} className="hover:shadow-lg transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">
                        {event.Name}
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(status)}
                        <Badge variant="outline" className="text-xs">
                          <Globe className="h-3 w-3 mr-1" />
                          {event.Mode}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {event.Description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(event.StartDate)} - {formatDate(event.EndDate)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {formatTime(event.StartDate)}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.Mode} Event
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2" />
                      Max team size: {event.MaxTeamSize}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Trophy className="h-4 w-4 mr-1" />
                      1st: ${getFirstPrize(event.Prizes).toLocaleString()}
                    </div>
                    <Button asChild size="sm">
                      <Link href={`/dashboard/events/${event.EventID}`}>
                        View Details
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </div>

                  {getTracks(event.Tracks).length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {getTracks(event.Tracks).slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                      {getTracks(event.Tracks).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{getTracks(event.Tracks).length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
