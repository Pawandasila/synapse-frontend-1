'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  EventHeader,
  EventHeroCard,
  EventOverview,
  EventTimeline,
  EventRules,
  EventTracks,
  EventPrizes,
  EventSidebar,
  LoadingState,
  NotFoundState,
  type Event,
  mockEventData
} from './_components';

const EventDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    // In real app, fetch event data from API
    // For now, using mock data
    setTimeout(() => {
      setEvent(mockEventData);
      setIsRegistered(mockEventData.userRegistered || false);
      setLoading(false);
    }, 500);
  }, [eventId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = () => {
    if (!event) return { status: 'unknown', color: 'gray', text: 'Unknown' };
    
    const now = new Date();
    const start = new Date(event.StartDate);
    const end = new Date(event.EndDate);
    const submission = new Date(event.SubmissionDeadline);

    if (now < start) return { status: 'upcoming', color: 'blue', text: 'Registration Open' };
    if (now >= start && now <= end) return { status: 'live', color: 'green', text: 'Live Now' };
    if (now > end && now <= submission) return { status: 'submission', color: 'orange', text: 'Submission Phase' };
    return { status: 'ended', color: 'gray', text: 'Event Ended' };
  };

  const handleRegister = () => {
    // Handle registration logic
    setIsRegistered(!isRegistered);
  };

  const formatList = (text: string) => {
    return text.split('\n').filter(line => line.trim()).map((line, index) => (
      <div key={index} className="mb-2">
        {line.trim()}
      </div>
    ));
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!event) {
    return <NotFoundState onBack={() => router.back()} />;
  }

  const eventStatus = getEventStatus();

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <EventHeader 
        eventStatus={eventStatus} 
        onBack={() => router.back()} 
      />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <EventHeroCard event={event} />

          {/* Event Details Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="tracks">Tracks</TabsTrigger>
              <TabsTrigger value="prizes">Prizes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <EventOverview 
                event={event} 
                formatDate={formatDate}
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="rules">
              <EventRules 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="timeline">
              <EventTimeline 
                event={event} 
                formatDateTime={formatDateTime}
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="tracks">
              <EventTracks 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>

            <TabsContent value="prizes">
              <EventPrizes 
                event={event} 
                formatList={formatList}
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Sidebar */}
        <div className="lg:col-span-1">
          <EventSidebar 
            event={event}
            isRegistered={isRegistered}
            onRegister={handleRegister}
            formatDateTime={formatDateTime}
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;

         