
    'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import EventCard from '@/components/EventCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementWidget from '@/components/AnnouncementWidget';
import { mockEvents } from '@/lib/mockData';
import { Event } from '@/contexts/EventContext';
import {
  Trophy,
  Users,
  Calendar,
  Zap,
  ArrowRight,
  Search,
  Sparkles,
  Target,
  Globe,
  Star,
  TrendingUp,
  Clock,
  Award,
  Plus,
} from 'lucide-react';

export default function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Filter events by status
    const upcoming = mockEvents.filter(event => event.status === 'upcoming').slice(0, 6);
    const ongoing = mockEvents.filter(event => event.status === 'ongoing');
    const featured = mockEvents.slice(0, 3); // Take first 3 as featured

    setUpcomingEvents(upcoming);
    setOngoingEvents(ongoing);
    setFeaturedEvents(featured);
  }, []);

  const stats = [
    { label: 'Active Events', value: '50+', icon: Calendar, color: 'text-blue-600' },
    { label: 'Participants', value: '10K+', icon: Users, color: 'text-green-600' },
    { label: 'Prize Pool', value: '$500K+', icon: Trophy, color: 'text-yellow-600' },
    { label: 'Success Rate', value: '95%', icon: TrendingUp, color: 'text-purple-600' },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with Next.js and modern web technologies',
      color: 'text-yellow-500',
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with developers and innovators from around the world',
      color: 'text-blue-500',
    },
    {
      icon: Award,
      title: 'Fair Judging',
      description: 'Transparent scoring system with industry expert judges',
      color: 'text-purple-500',
    },
    {
      icon: Target,
      title: 'Goal Oriented',
      description: 'Focused on creating real-world solutions and innovations',
      color: 'text-green-500',
    },
  ];

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          
          <div className="container mx-auto relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <Badge className="mb-6 gradient-primary text-white px-4 py-2">
                <Sparkles className="w-4 h-4 mr-2" />
                Now Live: AI Innovation Hackathon 2025
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 dark:from-white dark:via-blue-200 dark:to-purple-200 leading-tight">
                Where Innovation
                <span className="block gradient-primary bg-clip-text text-transparent">
                  Meets Community
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                Join the fastest-growing platform for hackathons, competitions, and tech events. 
                Build, compete, and connect with the global developer community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" className="px-8 py-4 text-lg gradient-primary hover:opacity-90 transition-smooth" asChild>
                  <Link href="/events">
                    Explore Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg hover-lift" asChild>
                  <Link href="/create-event">
                    Host an Event
                    <Plus className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>

              {/* Quick Search */}
              <div className="max-w-md mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search events, competitions..."
                    className="pl-10 py-3 text-center bg-white/80 backdrop-blur border-white/20"
                  />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg mb-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ongoing Events */}
        {ongoingEvents.length > 0 && (
          <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Clock className="w-4 h-4 mr-2" />
                  Live Now
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ongoing Events</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Join these exciting events that are happening right now
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Featured Events */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 gradient-primary text-white">
                <Star className="w-4 h-4 mr-2" />
                Featured
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Spotlight Events</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hand-picked events with amazing prizes and opportunities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} size="large" />
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Synapse?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the next generation of event hosting and participation
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card key={feature.title} className="text-center hover-lift">
                  <CardHeader>
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-lg mx-auto mb-4 ${feature.color}`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
                <p className="text-muted-foreground">
                  Don't miss out on these exciting upcoming opportunities
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/events">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white">
          <div className="container mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join thousands of developers, designers, and innovators building the future together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 text-lg" asChild>
                <Link href="/auth/signup">Join Community</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg" asChild>
                <Link href="/create-event">Organize Event</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AnnouncementWidget />
    </>
  );
}