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
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';
import { useEvents, useEventSearch, Event } from '@/hooks/useEvents';

const EventsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);

  const { 
    events: allEvents, 
    pagination: allEventsPagination, 
    loading: eventsLoading, 
    error: eventsError, 
    fetchPage 
  } = useEvents(currentPage);
  
  const { 
    events: searchResults, 
    pagination: searchPagination, 
    loading: searchLoading, 
    searchEvents 
  } = useEventSearch();

  const truncateDescription = (description: string, maxWords: number = 8): string => {
    const words = description.split(' ');
    if (words.length <= maxWords) {
      return description;
    }
    return words.slice(0, maxWords).join(' ') + '...';
  };

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

  const getTracks = (tracksString: string): string[] => {
    return tracksString.split(',').map(track => track.trim()).slice(0, 4);
  };

  const events = isSearching ? searchResults : allEvents;
  const pagination = isSearching ? searchPagination : allEventsPagination;
  const loading = isSearching ? searchLoading : eventsLoading;

  const handleSearch = async (page: number = 1) => {
    const hasValidQuery = searchQuery.trim().length >= 2;
    const hasFilters = selectedMode !== 'all' || selectedTheme !== 'all';
    
    if (hasValidQuery || hasFilters) {
      setIsSearching(true);
      setCurrentPage(page);
      await searchEvents({
        query: hasValidQuery ? searchQuery.trim() : undefined,
        mode: selectedMode !== 'all' ? selectedMode : undefined,
        theme: selectedTheme !== 'all' ? selectedTheme : undefined,
      }, page);
    } else {
      setIsSearching(false);
      setCurrentPage(page);
    }
  };

  const handlePageChange = (page: number) => {
    if (isSearching) {
      handleSearch(page);
    } else {
      setCurrentPage(page);
    }
  };

  const handleRefresh = () => {
    if (isSearching) {
      handleSearch(currentPage);
    } else {
      fetchPage(currentPage);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedMode('all');
    setSelectedTheme('all');
    setIsSearching(false);
    setCurrentPage(1);
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
              onClick={handleRefresh}
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
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            {/* <Select value={selectedTheme} onValueChange={setSelectedTheme}>
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
            </Select> */}
            {(searchQuery || (selectedMode !== 'all') || (selectedTheme !== 'all')) && (
              <Button variant="outline" onClick={handleClearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

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
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
            const status = getEventStatus(event);
            return (
              <Card key={event.EventID} className="hover:shadow-lg transition-shadow flex flex-col h-full">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2 min-h-[3.5rem]">
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
                  <CardDescription className="line-clamp-2 min-h-[3rem] text-sm">
                    {truncateDescription(event.Description)}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col justify-between space-y-4">
                  {/* Event Details Section */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{formatDate(event.StartDate)} - {formatDate(event.EndDate)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{formatTime(event.StartDate)}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>{event.Mode} Event</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span>Max team size: {event.MaxTeamSize}</span>
                    </div>
                  </div>

                  {/* Tags Section with Fixed Height */}
                  <div className="min-h-[2.5rem] flex items-start">
                    {getTracks(event.Tracks).length > 0 ? (
                      <div className="flex flex-wrap gap-1">
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
                    ) : (
                      <div className="text-xs text-muted-foreground">No tags available</div>
                    )}
                  </div>

                  {/* Bottom Section - Always at bottom */}
                  <div className="pt-4 mt-auto border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm font-medium text-foreground">
                        <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                        <span>1st: ${getFirstPrize(event.Prizes).toLocaleString()}</span>
                      </div>
                      <Button asChild size="sm" className="ml-2">
                        <Link href={`/dashboard/events/${event.EventID}`}>
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pagination - Always show when pagination data exists */}
        {pagination && (
          <div className="mt-8 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasPrevPage) {
                        handlePageChange(pagination.currentPage - 1);
                      }
                    }}
                    className={!pagination.hasPrevPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>

                {/* Smart page number display */}
                {(() => {
                  const { currentPage, totalPages } = pagination;
                  const pages = [];
                  
                  // Always show first page
                  if (totalPages > 0) {
                    pages.push(
                      <PaginationItem key={1}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === 1}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(1);
                          }}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  // Add ellipsis if needed before current page range
                  if (currentPage > 3) {
                    pages.push(
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  // Show pages around current page
                  const start = Math.max(2, currentPage - 1);
                  const end = Math.min(totalPages - 1, currentPage + 1);
                  
                  for (let i = start; i <= end; i++) {
                    if (i !== 1 && i !== totalPages) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href="#"
                            isActive={currentPage === i}
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(i);
                            }}
                            className="cursor-pointer"
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                  }

                  // Add ellipsis if needed after current page range
                  if (currentPage < totalPages - 2) {
                    pages.push(
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  // Always show last page (if more than 1 page)
                  if (totalPages > 1) {
                    pages.push(
                      <PaginationItem key={totalPages}>
                        <PaginationLink
                          href="#"
                          isActive={currentPage === totalPages}
                          onClick={(e) => {
                            e.preventDefault();
                            handlePageChange(totalPages);
                          }}
                          className="cursor-pointer"
                        >
                          {totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }

                  return pages;
                })()}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.hasNextPage) {
                        handlePageChange(pagination.currentPage + 1);
                      }
                    }}
                    className={!pagination.hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {/* {pagination && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Showing {((pagination.currentPage - 1) * pagination.eventsPerPage) + 1} to{' '}
            {Math.min(pagination.currentPage * pagination.eventsPerPage, pagination.totalEvents)} of{' '}
            {pagination.totalEvents} events
          </div>
        )} */}
        </div>
      )}
    </div>
  );
};

export default EventsPage;
