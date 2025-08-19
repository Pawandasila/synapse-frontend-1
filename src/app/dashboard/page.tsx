'use client';

import { useAuth } from '@/contexts/AuthContext';
import { 
  Calendar, 
  Trophy, 
  Target,
  MoreHorizontal,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  Award,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// Sample dashboard stats
const dashboardStats = [
  { title: 'Active Events', value: '12', change: '+2.5%', trend: 'up', icon: Calendar },
  { title: 'Completed Challenges', value: '48', change: '+12%', trend: 'up', icon: CheckCircle2 },
  { title: 'Team Rank', value: '#15', change: '+3', trend: 'up', icon: Trophy },
  { title: 'Points Earned', value: '2,847', change: '+156', trend: 'up', icon: Target },
];

// Sample recent activities
const recentActivities = [
  { id: 1, title: 'Completed "Web Dev Challenge"', time: '2 hours ago', type: 'achievement', icon: CheckCircle2 },
  { id: 2, title: 'Joined team "Code Warriors"', time: '5 hours ago', type: 'team', icon: Users },
  { id: 3, title: 'New event: "AI Hackathon 2025"', time: '1 day ago', type: 'event', icon: Calendar },
  { id: 4, title: 'Achievement unlocked: "First Place"', time: '2 days ago', type: 'achievement', icon: Award },
];

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Welcome back, {user?.name}! 👋</h2>
        <p className="text-muted-foreground">Here&apos;s what&apos;s happening with your competitions today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="card-optimized hover:shadow-md transition-fast">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className={`text-xs flex items-center mt-1 ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="h-4 w-4 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activities
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors-fast">
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                      activity.type === 'achievement' ? 'bg-green-100 text-green-600' :
                      activity.type === 'team' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'event' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Upcoming */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Plus className="h-5 w-5" />
                <span className="text-xs">Create Event</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Users className="h-5 w-5" />
                <span className="text-xs">Join Team</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Trophy className="h-5 w-5" />
                <span className="text-xs">Competitions</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col gap-2">
                <Target className="h-5 w-5" />
                <span className="text-xs">Challenges</span>
              </Button>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Don&apos;t miss these events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">AI Hackathon 2025</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Web Dev Challenge</p>
                  <p className="text-xs text-muted-foreground">Dec 25, 2:00 PM</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Data Science Workshop</p>
                  <p className="text-xs text-muted-foreground">Dec 28, 10:00 AM</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
