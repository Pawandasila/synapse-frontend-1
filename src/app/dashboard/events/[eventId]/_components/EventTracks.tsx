'use client';

import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Tracks: string;
}

interface EventTracksProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventTracks = ({ event, formatList }: EventTracksProps) => {
  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Competition Tracks
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {formatList(event.Tracks)}
        </div>
      </CardContent>
    </Card>
  );
};
