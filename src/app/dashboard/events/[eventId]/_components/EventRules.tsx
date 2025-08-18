'use client';

import { FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReactElement } from 'react';

interface Event {
  Rules: string;
}

interface EventRulesProps {
  event: Event;
  formatList: (text: string) => ReactElement[];
}

export const EventRules = ({ event, formatList }: EventRulesProps) => {
  return (
    <Card className="card-optimized">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Rules & Guidelines
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          {formatList(event.Rules)}
        </div>
      </CardContent>
    </Card>
  );
};
