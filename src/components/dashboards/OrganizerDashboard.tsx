'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/contexts/EventContext';
import {
  Plus,
  Calendar,
  Users,
  Trophy,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Edit,
  Eye,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    activeEvents: 0,
    revenue: 0,
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API based on organizer ID
    const organizerEvents = mockEvents.slice(0, 4);
    setMyEvents(organizerEvents);
    
    setStats({
      totalEvents: 15,
      totalParticipants: 1247,
      activeEvents: 3,
      revenue: 12500,
    });
  }, [user]);

  const getEventStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'ongoing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Organizer Dashboard 🎯
            </h1>
            <p className="text-muted-foreground">
              Manage your events and track their performance.
            </p>
          </div>
          <Button className="gradient-primary" asChild>
            <Link href="/create-event">
              <Plus className="h-4 w-4 mr-2" />
              Create New Event
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Events</p>
                <p className="text-3xl font-bold">{stats.totalEvents}</p>
                <p className="text-xs text-green-600">+3 this month</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-3xl font-bold">{stats.totalParticipants}</p>
                <p className="text-xs text-green-600">+127 this month</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Events</p>
                <p className="text-3xl font-bold">{stats.activeEvents}</p>
                <p className="text-xs text-blue-600">Running now</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Revenue</p>
                <p className="text-3xl font-bold">${stats.revenue}</p>
                <p className="text-xs text-green-600">+15% this month</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Event Management</h2>
            <div className="flex space-x-2">
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {myEvents.map((event) => (
              <Card key={event.id} className="hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {event.category} • {format(new Date(event.eventStart), 'MMM dd, yyyy')}
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getEventStatusColor(event.status)}>
                        {event.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.registrationCount} registered</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.status === 'upcoming'
                            ? formatDistanceToNow(new Date(event.eventStart), { addSuffix: true })
                            : event.status === 'ongoing'
                            ? formatDistanceToNow(new Date(event.eventEnd), { addSuffix: true })
                            : 'Completed'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-muted-foreground" />
                        <span>{event.prizes.length} prizes</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{event.difficulty}</Badge>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <div className="flex space-x-2">
                        {event.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Event Analytics</h2>
            <Button variant="outline">
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Registration Trends</CardTitle>
                <CardDescription>Last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">+245</div>
                <div className="text-green-600 text-sm">↗️ 12% increase</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Completion Rate</CardTitle>
                <CardDescription>Average across events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">87%</div>
                <div className="text-green-600 text-sm">↗️ 5% increase</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Participant Satisfaction</CardTitle>
                <CardDescription>Average rating</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">4.8/5</div>
                <div className="text-green-600 text-sm">⭐ Excellent</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Event Performance</CardTitle>
              <CardDescription>Detailed metrics for your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {myEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {event.registrationCount} participants • {event.status}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">92%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Participant Management</h2>
            <Button variant="outline">
              Export List
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Registrations</CardTitle>
              <CardDescription>Latest participants across all events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        U{i}
                      </div>
                      <div>
                        <h4 className="font-medium">User {i}</h4>
                        <p className="text-sm text-muted-foreground">user{i}@example.com</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">AI Hackathon</Badge>
                      <p className="text-sm text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="announcements" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Announcements</h2>
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Send Announcement</CardTitle>
              <CardDescription>
                Communicate with participants across all your events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Event</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>All Events</option>
                    {myEvents.map((event) => (
                      <option key={event.id}>{event.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <input
                    type="text"
                    placeholder="Announcement title..."
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea
                    placeholder="Write your announcement..."
                    rows={4}
                    className="w-full mt-1 p-2 border rounded-md"
                  />
                </div>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Send Announcement
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Important Update {i}</h4>
                      <span className="text-xs text-muted-foreground">2 hours ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit...
                    </p>
                    <Badge variant="outline">AI Innovation Hackathon</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizerDashboard;
