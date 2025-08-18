'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockAnnouncements } from '@/lib/mockData';
import { Bell, X, Info, AlertTriangle, CheckCircle, Megaphone } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success' | 'announcement';
  eventId?: string;
}

const AnnouncementWidget = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load announcements from mock data
    setAnnouncements(mockAnnouncements);
  }, []);

  const getIcon = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return <Info className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: Announcement['type']) => {
    switch (type) {
      case 'info':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-950 dark:text-yellow-400';
      case 'success':
        return 'text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400';
      case 'announcement':
        return 'text-purple-600 bg-purple-50 dark:bg-purple-950 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950 dark:text-gray-400';
    }
  };

  const dismissAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(ann => ann.id !== id));
  };

  if (announcements.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-lg border-0 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-smooth ${
        isExpanded ? 'h-96' : 'h-auto'
      }`}>
        <CardHeader 
          className="pb-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <CardTitle className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Announcements</span>
              <Badge variant="secondary" className="text-xs">
                {announcements.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1"
            >
              {isExpanded ? '−' : '+'}
            </Button>
          </CardTitle>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0">
            <ScrollArea className="h-72">
              <div className="space-y-3">
                {announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-3 rounded-lg border ${getTypeColor(announcement.type)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getIcon(announcement.type)}
                        <h4 className="font-medium text-sm line-clamp-1">
                          {announcement.title}
                        </h4>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-1 opacity-50 hover:opacity-100"
                        onClick={() => dismissAnnouncement(announcement.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {announcement.message}
                    </p>
                    
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(announcement.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        )}

        {!isExpanded && announcements.length > 0 && (
          <CardContent className="pt-0">
            <div className={`p-3 rounded-lg border ${getTypeColor(announcements[0].type)}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getIcon(announcements[0].type)}
                  <h4 className="font-medium text-sm line-clamp-1">
                    {announcements[0].title}
                  </h4>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-1 opacity-50 hover:opacity-100"
                  onClick={() => dismissAnnouncement(announcements[0].id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {announcements[0].message}
              </p>
              
              <div className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(announcements[0].timestamp), { addSuffix: true })}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default AnnouncementWidget;
