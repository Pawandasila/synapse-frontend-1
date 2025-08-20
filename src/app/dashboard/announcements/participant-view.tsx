'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Megaphone,
  Calendar,
  Star,
  Eye,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';

interface Announcement {
  _id: string;
  eventId: number;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  isImportant: boolean;
  createdAt: string;
  updatedAt: string;
  eventName?: string;
}

export default function ParticipantAnnouncementsView() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [importantAnnouncements, setImportantAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  useEffect(() => {
    fetchAnnouncements();
    fetchImportantAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      // Use the new endpoint to get all announcements for participant's enrolled events
      const response = await apiRequest<{ data: Announcement[] }>('/announcements/my-all');
      setAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('Failed to fetch announcements');
    } finally {
      setLoading(false);
    }
  };

  const fetchImportantAnnouncements = async () => {
    try {
      const response = await apiRequest<{ data: Announcement[] }>('/announcements/my-important');
      setImportantAnnouncements(response.data || []);
    } catch (error) {
      console.error('Error fetching important announcements:', error);
      toast.error('Failed to fetch important announcements');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'all' || announcement.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200 font-medium';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 font-medium';
      case 'low': return 'bg-green-100 text-green-800 border-green-200 font-medium';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 font-medium';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Megaphone className="h-8 w-8" />
            Announcements
          </h1>
        </div>
        <div className="space-y-6">
          {/* Loading skeleton for important announcements */}
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Star className="h-5 w-5 fill-current" />
                Important Announcements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="bg-white p-5 rounded-lg border border-orange-200 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Loading skeleton for search */}
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 h-10 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-48 h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
          
          {/* Loading skeleton for announcements */}
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="animate-pulse border-l-4 border-l-gray-200">
                <CardContent className="p-6">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Megaphone className="h-8 w-8" />
          Announcements
        </h1>
      </div>

      {/* Search and Filter */}
      <Card className="border-slate-200">
        <CardHeader>
          <CardTitle className="text-lg">Find Announcements</CardTitle>
          <CardDescription>Search and filter announcements from your events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Important Announcements Section */}
      {importantAnnouncements.length > 0 && (
        <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Star className="h-5 w-5 fill-current" />
              Important Announcements
            </CardTitle>
            <CardDescription className="text-orange-700">
              High priority updates that require your attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {importantAnnouncements.map((announcement) => (
              <div key={announcement._id} className="bg-white p-5 rounded-lg border border-orange-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-orange-500 fill-current" />
                    <Badge className={getPriorityColor(announcement.priority)}>
                      {announcement.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">{announcement.message}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {announcement.eventName}
                  </span>
                  <span>{formatDistanceToNow(new Date(announcement.createdAt))} ago</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}


      {/* All Announcements */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <Megaphone className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No announcements found</h3>
              <p className="text-gray-500">
                {searchTerm || priorityFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'There are no announcements available at the moment.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                All Announcements ({filteredAnnouncements.length})
              </h2>
            </div>
            {filteredAnnouncements.map((announcement) => (
              <Card key={announcement._id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg text-gray-900">{announcement.title}</h3>
                    <div className="flex items-center gap-2">
                      {announcement.isImportant && (
                        <Star className="h-4 w-4 text-orange-500 fill-current" />
                      )}
                      <Badge className={getPriorityColor(announcement.priority)}>
                        {announcement.priority.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">{announcement.message}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {announcement.eventName}
                    </span>
                    <span>{formatDistanceToNow(new Date(announcement.createdAt))} ago</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
