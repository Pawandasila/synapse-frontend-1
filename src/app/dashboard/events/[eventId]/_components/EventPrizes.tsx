'use client';

import { Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Prizes: string;
}

interface EventPrizesProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventPrizes = ({ event, formatList }: EventPrizesProps) => {
  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Prizes & Rewards
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {formatList(event.Prizes)}
        </div>
      </CardContent>
    </Card>
  );
};
