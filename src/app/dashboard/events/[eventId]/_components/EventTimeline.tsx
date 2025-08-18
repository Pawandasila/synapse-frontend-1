'use client';

import { CalendarDays, User, Calendar, Clock, Upload, Star, Trophy, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

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

interface EventTimelineProps {
  event: Event;
  formatDateTime: (dateString: string) => string;
  formatList: (text: string) => ReactElement[];
}

export const EventTimeline = ({ event, formatDateTime, formatList }: EventTimelineProps) => {
  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-blue-500" />
          Event Timeline
        </CardTitle>
        <CardDescription>
          Follow the complete journey of the event from start to finish
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500"></div>
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {/* Registration Phase */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
                <User className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pb-8">
                <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Registration Opens</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Teams can register and submit their initial details
                  </p>
                  <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                    <Clock className="h-3 w-3" />
                    <span>Before {formatDateTime(event.StartDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Start */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white shadow-lg">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pb-8">
                <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Event Kicks Off</h3>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Opening ceremony and project development begins
                  </p>
                  <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(event.StartDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Development Phase */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500 text-white shadow-lg">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pb-8">
                <div className="bg-purple-50 dark:bg-purple-950 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Development Phase</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-300 mb-2">
                    Teams work on their projects, mentorship sessions, and workshops
                  </p>
                  <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400">
                    <Clock className="h-3 w-3" />
                    <span>During the event period</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Deadline */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                <Upload className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pb-8">
                <div className="bg-orange-50 dark:bg-orange-950 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Submission Deadline</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mb-2">
                    Final submissions must be completed by this time
                  </p>
                  <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(event.SubmissionDeadline)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Judging Phase */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg">
                <Star className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0 pb-8">
                <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
                  <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Judging & Evaluation</h3>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                    Expert judges review and evaluate all submissions
                  </p>
                  <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
                    <Clock className="h-3 w-3" />
                    <span>After submission deadline</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Announcement */}
            <div className="relative flex items-start gap-6">
              <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500 text-white shadow-lg">
                <Trophy className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="bg-yellow-50 dark:bg-yellow-950 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Results & Awards</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
                    Winners announced and awards ceremony
                  </p>
                  <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(event.ResultDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Timeline Items from Database */}
        {event.Timeline && event.Timeline.trim() && (
          <div className="mt-8 pt-6 border-t">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              Additional Timeline Details
            </h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="prose prose-sm max-w-none">
                {formatList(event.Timeline)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
