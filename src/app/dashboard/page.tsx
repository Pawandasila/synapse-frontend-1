'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ParticipantDashboard from '@/components/dashboards/ParticipantDashboard';
import OrganizerDashboard from '@/components/dashboards/OrganizerDashboard';

import { Loader2 } from 'lucide-react';
import JudgeDashboard from '@/components/dashboards/JudgeDashboard';

const DashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderDashboard = () => {
    switch (user.role) {
      case 'participant':
        return <ParticipantDashboard />;
      case 'organizer':
        return <OrganizerDashboard />;
      case 'judge':
        return <JudgeDashboard />;
      default:
        return <ParticipantDashboard />;
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        {renderDashboard()}
      </main>
      <Footer />
    </>
  );
};

export default DashboardPage;
