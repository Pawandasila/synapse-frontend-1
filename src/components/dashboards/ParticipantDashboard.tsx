'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { mockEvents, mockTeams } from '@/lib/mockData';
import { Event, Team } from '@/contexts/EventContext';
import {
  Calendar,
  Clock,
  Users,
  Trophy,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Star,
  Target,
  TrendingUp,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';

const ParticipantDashboard = () => {
  const { user } = useAuth();
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [stats, setStats] = useState({
    eventsJoined: 0,
    projectsSubmitted: 0,
    averageRank: 0,
    totalPrizeWon: 0,
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const userEvents = mockEvents.filter(event => 
      event.status === 'upcoming' || event.status === 'ongoing'
    ).slice(0, 3);
    
    const userTeams = mockTeams.filter(team => 
      team.members.includes(user?.id || '1')
    );

    setRegisteredEvents(userEvents);
    setMyTeams(userTeams);
    setStats({
      eventsJoined: 12,
      projectsSubmitted: 8,
      averageRank: 3.2,
      totalPrizeWon: 2500,
    });
  }, [user]);

  const getEventProgress = (event: Event) => {
    const now = new Date();
    const start = new Date(event.eventStart);
    const end = new Date(event.eventEnd);
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    return Math.round((elapsed / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground">
          Here's what's happening with your events and projects.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Events Joined</p>
                <p className="text-3xl font-bold">{stats.eventsJoined}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Projects Submitted</p>
                <p className="text-3xl font-bold">{stats.projectsSubmitted}</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Rank</p>
                <p className="text-3xl font-bold">#{stats.averageRank}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prize Won</p>
                <p className="text-3xl font-bold">${stats.totalPrizeWon}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="events">My Events</TabsTrigger>
          <TabsTrigger value="teams">My Teams</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Registered Events</h2>
            <Button asChild>
              <Link href="/events">Browse More Events</Link>
            </Button>
          </div>

          <div className="grid gap-6">
            {registeredEvents.map((event) => (
              <Card key={event.id} className="hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="mt-2">
                        by {event.organizer}
                      </CardDescription>
                    </div>
                    <Badge 
                      className={
                        event.status === 'ongoing' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {event.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground line-clamp-2">
                      {event.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{format(new Date(event.eventStart), 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {event.status === 'upcoming'
                            ? formatDistanceToNow(new Date(event.eventStart), { addSuffix: true })
                            : formatDistanceToNow(new Date(event.eventEnd), { addSuffix: true })}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{event.registrationCount} participants</span>
                      </div>
                    </div>

                    {event.status === 'ongoing' && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Event Progress</span>
                          <span>{getEventProgress(event)}%</span>
                        </div>
                        <Progress value={getEventProgress(event)} />
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex space-x-2">
                        {event.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/events/${event.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="teams" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Teams</h2>
            <Button variant="outline">Create Team</Button>
          </div>

          <div className="grid gap-6">
            {myTeams.map((team) => (
              <Card key={team.id} className="hover-lift">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{team.name}</CardTitle>
                      <CardDescription>
                        {mockEvents.find(e => e.id === team.eventId)?.title}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">
                      {team.members.length} member{team.members.length !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Team Members: {team.members.length}</span>
                    </div>

                    {team.submission ? (
                      <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-800 dark:text-green-200">
                            Project Submitted
                          </span>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300">
                          {team.submission.title}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                          Submitted {formatDistanceToNow(new Date(team.submission.submittedAt), { addSuffix: true })}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium text-yellow-800 dark:text-yellow-200">
                            Submission Pending
                          </span>
                        </div>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                          Don't forget to submit your project before the deadline.
                        </p>
                        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                          <Upload className="h-4 w-4 mr-2" />
                          Submit Project
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="submissions" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Project Submissions</h2>
          </div>

          <div className="grid gap-6">
            {myTeams.filter(team => team.submission).map((team) => (
              <Card key={team.id} className="hover-lift">
                <CardHeader>
                  <CardTitle className="text-xl">{team.submission?.title}</CardTitle>
                  <CardDescription>
                    Submitted by {team.name} • {mockEvents.find(e => e.id === team.eventId)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      {team.submission?.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {team.submission?.githubUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={team.submission.githubUrl} target="_blank">
                            GitHub
                          </Link>
                        </Button>
                      )}
                      {team.submission?.liveUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={team.submission.liveUrl} target="_blank">
                            Live Demo
                          </Link>
                        </Button>
                      )}
                      {team.submission?.videoUrl && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={team.submission.videoUrl} target="_blank">
                            Video Demo
                          </Link>
                        </Button>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>
                          Submitted {formatDistanceToNow(new Date(team.submission?.submittedAt || ''), { addSuffix: true })}
                        </span>
                      </div>
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Under Review
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParticipantDashboard;
