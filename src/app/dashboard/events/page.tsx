'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Trophy, 
  Filter,
  Search,
  Globe,
  Tag,
  ChevronRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Event interface based on your database schema
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
  // Additional fields for display
  organizerName?: string;
  registeredTeams?: number;
}

// Mock events data based on your database schema
const mockEvents: Event[] = [
  {
    EventID: 1,
    OrganizerID: 1,
    Name: "AI Innovation Hackathon 2025",
    Description: "Build the next generation of AI-powered applications that can change the world. Join us for 48 hours of intense coding, collaboration, and innovation.",
    Theme: "Artificial Intelligence & Machine Learning",
    Mode: "Online",
    StartDate: "2025-01-15T09:00:00Z",
    EndDate: "2025-01-17T18:00:00Z",
    SubmissionDeadline: "2025-01-17T23:59:00Z",
    ResultDate: "2025-01-20T15:00:00Z",
    Rules: "Teams of 1-4 members, original code only, open source libraries allowed, no pre-built solutions",
    Timeline: "Registration: Dec 20-Jan 10, Event: Jan 15-17, Judging: Jan 18-19, Results: Jan 20",
    Tracks: "Healthcare AI, FinTech AI, Educational AI, Open Innovation",
    Prizes: "1st Place: $5000, 2nd Place: $3000, 3rd Place: $1500, Best Innovation: $1000",
    MaxTeamSize: 4,
    Sponsors: "TechCorp, InnovateLabs, AI Solutions Inc, CloudTech",
    IsActive: true,
    CreatedAt: "2024-12-01T10:00:00Z",
    organizerName: "TechCorp Events",
    registeredTeams: 245
  },
  {
    EventID: 2,
    OrganizerID: 2,
    Name: "Web Development Championship",
    Description: "Create stunning web applications using modern frameworks and technologies. Showcase your full-stack development skills.",
    Theme: "Full Stack Web Development",
    Mode: "Offline",
    StartDate: "2025-01-25T10:00:00Z",
    EndDate: "2025-01-26T20:00:00Z",
    SubmissionDeadline: "2025-01-26T20:00:00Z",
    ResultDate: "2025-01-28T12:00:00Z",
    Rules: "Individual participation, any modern framework allowed, must be responsive design, deployment required",
    Timeline: "Registration: Jan 1-20, Workshop: Jan 22, Event: Jan 25-26, Results: Jan 28",
    Tracks: "Frontend Development, Backend APIs, Full-Stack Solutions, UI/UX Design",
    Prizes: "Winner: $2000, Runner-up: $1000, Best Design: $500, Best Innovation: $300",
    MaxTeamSize: 1,
    Sponsors: "WebDev Studios, CloudHost, DesignPro, DevTools Inc",
    IsActive: true,
    CreatedAt: "2024-12-15T14:30:00Z",
    organizerName: "WebDev Studios",
    registeredTeams: 156
  },
  {
    EventID: 3,
    OrganizerID: 3,
    Name: "Data Science Olympics 2025",
    Description: "Solve real-world data problems using advanced analytics and machine learning techniques. Compete with the best data scientists.",
    Theme: "Data Science & Analytics",
    Mode: "Online",
    StartDate: "2025-02-01T08:00:00Z",
    EndDate: "2025-02-03T17:00:00Z",
    SubmissionDeadline: "2025-02-03T23:00:00Z",
    ResultDate: "2025-02-05T14:00:00Z",
    Rules: "Teams of 1-3 members, public datasets only, detailed methodology report required, code submission mandatory",
    Timeline: "Registration: Jan 10-25, Dataset Release: Feb 1, Submission: Feb 3, Results: Feb 5",
    Tracks: "Predictive Analytics, Natural Language Processing, Computer Vision, Time Series Analysis",
    Prizes: "Gold Medal: $4000, Silver Medal: $2500, Bronze Medal: $1000, Best Insight Award: $750",
    MaxTeamSize: 3,
    Sponsors: "DataCorp, AnalyticsPlus, MLSolutions, StatsTech",
    IsActive: true,
    CreatedAt: "2024-12-20T09:15:00Z",
    organizerName: "DataCorp Solutions",
    registeredTeams: 89
  },
  {
    EventID: 4,
    OrganizerID: 4,
    Name: "Blockchain Innovation Summit",
    Description: "Develop decentralized applications and explore the future of blockchain technology. Build the next generation of Web3 solutions.",
    Theme: "Blockchain & Web3",
    Mode: "Online",
    StartDate: "2025-02-10T09:00:00Z",
    EndDate: "2025-02-12T19:00:00Z",
    SubmissionDeadline: "2025-02-12T22:00:00Z",
    ResultDate: "2025-02-15T16:00:00Z",
    Rules: "Teams of 2-5 members, smart contracts deployment required, testnet usage mandatory, open source preferred",
    Timeline: "Registration: Jan 20-Feb 5, Workshops: Feb 8-9, Hackathon: Feb 10-12, Demo Day: Feb 15",
    Tracks: "DeFi Applications, NFT Platforms, DAO Tools, Blockchain Infrastructure",
    Prizes: "Grand Prize: $6000, Innovation Prize: $4000, Technical Excellence: $2000, Community Choice: $1000",
    MaxTeamSize: 5,
    Sponsors: "BlockChain Ventures, CryptoTech, DeFi Labs, Web3 Foundation",
    IsActive: true,
    CreatedAt: "2025-01-01T12:00:00Z",
    organizerName: "BlockChain Ventures",
    registeredTeams: 134
  },
  {
    EventID: 5,
    OrganizerID: 5,
    Name: "Mobile App Development Sprint",
    Description: "Build innovative mobile applications that solve everyday problems. Create apps that make a difference in people's lives.",
    Theme: "Mobile Application Development",
    Mode: "Offline",
    StartDate: "2025-02-20T09:30:00Z",
    EndDate: "2025-02-21T18:30:00Z",
    SubmissionDeadline: "2025-02-21T18:30:00Z",
    ResultDate: "2025-02-23T11:00:00Z",
    Rules: "Teams of 2-3 members, native or cross-platform, working prototype required, app store submission ready",
    Timeline: "Registration: Feb 1-15, Ideation Workshop: Feb 18, Sprint: Feb 20-21, Pitch Day: Feb 23",
    Tracks: "Social Impact Apps, Productivity Tools, Entertainment Apps, Educational Apps",
    Prizes: "Best App: $3000, Most Innovative: $1500, Best Design: $1000, People's Choice: $500",
    MaxTeamSize: 3,
    Sponsors: "AppDev Studios, MobileTech, DeviceHub, CodeCraft",
    IsActive: true,
    CreatedAt: "2025-01-10T16:45:00Z",
    organizerName: "AppDev Studios",
    registeredTeams: 92
  },
  {
    EventID: 6,
    OrganizerID: 6,
    Name: "Cybersecurity CTF Championship",
    Description: "Test your security skills in this capture-the-flag competition. Solve challenging cybersecurity puzzles and demonstrate your expertise.",
    Theme: "Cybersecurity & Ethical Hacking",
    Mode: "Online",
    StartDate: "2025-03-01T10:00:00Z",
    EndDate: "2025-03-02T22:00:00Z",
    SubmissionDeadline: "2025-03-02T22:00:00Z",
    ResultDate: "2025-03-04T13:00:00Z",
    Rules: "Individual or teams up to 4 members, no automated tools, writeups required, ethical hacking guidelines",
    Timeline: "Registration: Feb 10-25, Practice Round: Feb 28, Main Event: Mar 1-2, Awards: Mar 4",
    Tracks: "Web Security, Cryptography, Digital Forensics, Reverse Engineering, Network Security",
    Prizes: "Champion: $5000, Runner-up: $3000, Third Place: $1500, Best Writeup: $500",
    MaxTeamSize: 4,
    Sponsors: "SecureNet Labs, CyberGuard, HackSafe, InfoSec Pro",
    IsActive: true,
    CreatedAt: "2025-01-15T08:20:00Z",
    organizerName: "SecureNet Labs",
    registeredTeams: 178
  }
];

const EventsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMode, setSelectedMode] = useState('all');
  const [selectedTheme, setSelectedTheme] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Filter events based on search and filters
  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.Theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.organizerName && event.organizerName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMode = selectedMode === 'all' || event.Mode.toLowerCase() === selectedMode;
    const matchesTheme = selectedTheme === 'all' || event.Theme.toLowerCase().includes(selectedTheme.toLowerCase());
    const isActive = event.IsActive;
    
    return matchesSearch && matchesMode && matchesTheme && isActive;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEventStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'live';
    return 'ended';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge className="bg-green-100 text-green-700 border-green-200">🔴 Live</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">📅 Upcoming</Badge>;
      case 'ended':
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">✅ Ended</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Events</h1>
            <p className="text-muted-foreground">Discover and participate in exciting competitions</p>
          </div>
          <Button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Calendar className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events, themes, or organizers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedMode} onValueChange={setSelectedMode}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedTheme} onValueChange={setSelectedTheme}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Themes</SelectItem>
                <SelectItem value="ai">AI & ML</SelectItem>
                <SelectItem value="web">Web Development</SelectItem>
                <SelectItem value="data">Data Science</SelectItem>
                <SelectItem value="blockchain">Blockchain</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => {
          const status = getEventStatus(event.StartDate, event.EndDate);
          // Extract tags from Theme and Tracks for display
          const displayTags = [
            event.Theme.split('&')[0].trim(),
            ...event.Tracks.split(',').slice(0, 2).map(track => track.trim())
          ];
          
          return (
            <Link key={event.EventID} href={`/dashboard/events/${event.EventID}`}>
              <Card className="card-optimized hover:shadow-lg transition-fast cursor-pointer h-full group border hover:border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors-fast line-clamp-2">
                        {event.Name}
                      </CardTitle>
                      <CardDescription className="mt-1 text-xs text-muted-foreground">
                        by {event.organizerName}
                      </CardDescription>
                    </div>
                    {getStatusBadge(status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 pt-0">
                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {event.Description}
                  </p>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      {event.Mode === 'Online' ? (
                        <Globe className="h-3 w-3 text-primary/70" />
                      ) : (
                        <MapPin className="h-3 w-3 text-primary/70" />
                      )}
                      <span className="text-muted-foreground">{event.Mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3 w-3 text-blue-500" />
                      <span className="text-muted-foreground">Max {event.MaxTeamSize}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">{formatDate(event.StartDate)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Trophy className="h-3 w-3 text-orange-500" />
                      <span className="text-muted-foreground">{event.registeredTeams || 0} teams</span>
                    </div>
                  </div>

                  {/* Theme Badge */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <Badge variant="secondary" className="text-xs px-2 py-1 truncate max-w-[70%]">
                      {event.Theme}
                    </Badge>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or filters
          </p>
          <Button variant="outline" onClick={() => {
            setSearchTerm('');
            setSelectedMode('all');
            setSelectedTheme('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{mockEvents.length}</div>
          <div className="text-sm text-muted-foreground">Total Events</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockEvents.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'live').length}
          </div>
          <div className="text-sm text-muted-foreground">Live Now</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {mockEvents.filter(e => getEventStatus(e.StartDate, e.EndDate) === 'upcoming').length}
          </div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">
            {mockEvents.reduce((sum, event) => sum + (event.registeredTeams || 0), 0)}
          </div>
          <div className="text-sm text-muted-foreground">Total Participants</div>
        </div>
      </div>
    </div>
  );
};

export default EventsPage;