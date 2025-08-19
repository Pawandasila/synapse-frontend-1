'use client';

import { CheckCircle, Calendar, Star, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Event } from './types';

interface EventSidebarProps {
  event: Event;
  isRegistered: boolean;
  onRegister: () => void;
  formatDateTime: (dateString: string) => string;
}

export const EventSidebar = ({ event, isRegistered, onRegister, formatDateTime }: EventSidebarProps) => {
  return (
    <div className="space-y-6">
      {/* Registration Card */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isRegistered ? (
            <div className="space-y-3">
              <Badge variant="default" className="w-full justify-center py-2 bg-green-100 text-green-700 border-green-200">
                ✓ Registered
              </Badge>
              <Button variant="outline" className="w-full">
                View Team Details
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={onRegister}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Register Now
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Join other teams in this exciting event
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Start</span>
            <span className="text-sm font-medium">{formatDateTime(event.StartDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event End</span>
            <span className="text-sm font-medium">{formatDateTime(event.EndDate)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Submission Deadline</span>
            <span className="text-sm font-medium">
              {event.SubmissionDeadline ? formatDateTime(event.SubmissionDeadline) : 'TBD'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Results</span>
            <span className="text-sm font-medium">
              {event.ResultDate ? formatDateTime(event.ResultDate) : 'TBD'}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Event Stats */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Event Statistics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Mode</span>
            <span className="text-lg font-bold text-primary">{event.Mode}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Event Theme</span>
            <span className="text-lg font-bold text-blue-600">{event.Theme}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Max Team Size</span>
            <span className="text-lg font-bold text-orange-600">{event.MaxTeamSize}</span>
          </div>
        </CardContent>
      </Card>

      {/* Organizer Info */}
      <Card className="card-optimized">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Organizer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                O{event.OrganizerID}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Organizer #{event.OrganizerID}</div>
              <div className="text-sm text-muted-foreground">Event Organizer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
