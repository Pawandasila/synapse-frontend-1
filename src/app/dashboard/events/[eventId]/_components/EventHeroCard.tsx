'use client';

import { User, MapPin, Users, Target, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Event {
  EventID: number;
  OrganizerID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: 'Online' | 'Offline';
  StartDate: string;
  EndDate: string;
  SubmissionDeadline: string;
  ResultDate: string;
  Rules: string;
  Timeline: string;
  Tracks: string;
  Prizes: string;
  MaxTeamSize: number;
  Sponsors: string;
  IsActive: boolean;
  CreatedAt: string;
  organizerName?: string;
  registeredTeams?: number;
  totalParticipants?: number;
  userRegistered?: boolean;
}

interface EventHeroCardProps {
  event: Event;
}

export const EventHeroCard = ({ event }: EventHeroCardProps) => {
  return (
    <Card className="card-optimized">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold mb-2">{event.Name}</CardTitle>
            <CardDescription className="text-base mb-4">
              {event.Description}
            </CardDescription>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>by {event.organizerName}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.Mode}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event.registeredTeams} teams</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span>{event.totalParticipants} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button variant="outline" size="sm">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};
