// Event interface matching your database schema
export interface Event {
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
  totalParticipants?: number;
  userRegistered?: boolean;
}

// Mock event data - in real app, this would come from API
export const mockEventData: Event = {
  EventID: 1,
  OrganizerID: 1,
  Name: "AI Innovation Hackathon 2025",
  Description: "Build the next generation of AI-powered applications that can change the world. Join us for 48 hours of intense coding, collaboration, and innovation. This hackathon focuses on creating practical AI solutions that can solve real-world problems across various domains including healthcare, education, finance, and sustainability.",
  Theme: "Artificial Intelligence & Machine Learning",
  Mode: "Online",
  StartDate: "2025-01-15T09:00:00Z",
  EndDate: "2025-01-17T18:00:00Z",
  SubmissionDeadline: "2025-01-17T23:59:00Z",
  ResultDate: "2025-01-20T15:00:00Z",
  Rules: `1. Teams must consist of 1-4 members
2. All code must be original and written during the hackathon
3. Open source libraries and frameworks are allowed
4. No pre-built solutions or existing projects
5. Teams must submit working prototypes with source code
6. Projects must include a demo video (max 3 minutes)
7. All submissions must be made before the deadline
8. Judging criteria: Innovation (30%), Technical Implementation (25%), Business Impact (25%), Presentation (20%)`,
  Timeline: `December 20, 2024 - January 10, 2025: Registration Period
January 12, 2025: Team Formation and Networking Event
January 15, 2025 9:00 AM: Opening Ceremony & Kickoff
January 15-17, 2025: Development Period (48 hours)
January 17, 2025 6:00 PM: Development Ends
January 17, 2025 11:59 PM: Submission Deadline
January 18-19, 2025: Judging Period
January 20, 2025 3:00 PM: Results Announcement & Closing Ceremony`,
  Tracks: `Healthcare AI: Develop AI solutions for medical diagnosis, treatment optimization, or patient care
FinTech AI: Create intelligent financial applications for trading, risk assessment, or personal finance
Educational AI: Build AI-powered learning platforms, tutoring systems, or educational tools
Environmental AI: Design solutions for climate change, sustainability, or environmental monitoring
Open Innovation: Any other creative AI application that solves real-world problems`,
  Prizes: `1st Place: $5,000 + Internship opportunities at TechCorp
2nd Place: $3,000 + 6-month mentorship program
3rd Place: $1,500 + Cloud computing credits
Best Innovation Award: $1,000 + Patent filing support
People's Choice Award: $500 + Conference tickets
All participants receive: Digital certificates, swag box, networking opportunities`,
  MaxTeamSize: 4,
  Sponsors: "TechCorp (Title Sponsor), InnovateLabs (Gold Sponsor), AI Solutions Inc (Silver Sponsor), CloudTech (Technology Partner), StartupHub (Community Partner)",
  IsActive: true,
  CreatedAt: "2024-12-01T10:00:00Z",
  organizerName: "TechCorp Events",
  registeredTeams: 245,
  totalParticipants: 856,
  userRegistered: false
};
