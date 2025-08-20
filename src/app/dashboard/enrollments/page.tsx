'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Download,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useOrganizerData } from '@/hooks/useOrganizerData';
import { useEnrollments, Enrollment } from '@/hooks/useEnrollments';
import { format } from 'date-fns';
import {
  EnrollmentStatsCards,
  EnrollmentFilters,
  EnrollmentTable,
  EventBreakdown,
  EnrollmentActions
} from './_components';

const EventEnrollmentsPage = () => {
  const { user } = useAuth();
  const { myEvents } = useOrganizerData();
  
  // Use useMemo to prevent eventIds array from being recreated on every render
  const eventIds = useMemo(() => 
    myEvents.map(event => event.EventID), 
    [myEvents]
  );
  
  const { 
    enrollments, 
    stats, 
    loading, 
    error, 
    refetch 
  } = useEnrollments(eventIds);
  
  const [filteredEnrollments, setFilteredEnrollments] = useState<Enrollment[]>([]);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('all');

  // Filter enrollments based on search and filters
  useEffect(() => {
    let filtered = [...enrollments];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(enrollment =>
        enrollment.UserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enrollment.UserEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enrollment.EventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (enrollment.TeamName && enrollment.TeamName.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Event filter
    if (selectedEvent !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.EventID.toString() === selectedEvent);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(enrollment => enrollment.Status === selectedStatus);
    }

    // Date range filter
    if (selectedDateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (selectedDateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(enrollment => 
            new Date(enrollment.EnrollmentDate) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(enrollment => 
            new Date(enrollment.EnrollmentDate) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(enrollment => 
            new Date(enrollment.EnrollmentDate) >= filterDate
          );
          break;
      }
    }

    setFilteredEnrollments(filtered);
  }, [enrollments, searchQuery, selectedEvent, selectedStatus, selectedDateRange]);

  const handleContactParticipant = (enrollment: Enrollment) => {
    // Open email client
    window.open(`mailto:${enrollment.UserEmail}?subject=Regarding ${enrollment.EventName} Enrollment`);
  };

  const handleViewProfile = (userId: number) => {
    // Navigate to user profile (you can implement this based on your routing)
    console.log('View profile for user:', userId);
  };

  const handleBulkEmail = () => {
    const emails = filteredEnrollments
      .filter(e => e.Status === 'Enrolled')
      .map(e => e.UserEmail)
      .join(',');
    
    window.open(`mailto:?bcc=${emails}&subject=Important Update About Your Event Enrollment`);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedEvent('all');
    setSelectedStatus('all');
    setSelectedDateRange('all');
  };

  const hasActiveFilters = searchQuery !== '' || 
                          selectedEvent !== 'all' || 
                          selectedStatus !== 'all' || 
                          selectedDateRange !== 'all';

  const exportEnrollments = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Event', 'Status', 'Enrollment Date', 'Team'];
    const csvContent = [
      headers.join(','),
      ...filteredEnrollments.map(enrollment => [
        enrollment.UserName,
        enrollment.UserEmail,
        enrollment.EventName,
        enrollment.Status,
        format(new Date(enrollment.EnrollmentDate), 'yyyy-MM-dd HH:mm'),
        enrollment.TeamName || 'Individual'
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enrollments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Event Enrollments</h1>
          <p className="text-muted-foreground">Loading enrollment data...</p>
        </div>
        <EnrollmentStatsCards 
          stats={{
            totalEnrollments: 0,
            enrolledCount: 0,
            cancelledCount: 0,
            pendingCount: 0,
            waitlistCount: 0,
            eventBreakdown: []
          }} 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Event Enrollments</h1>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-2"
                onClick={refetch}
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <EnrollmentActions
        totalEnrollments={enrollments.length}
        filteredCount={filteredEnrollments.length}
        onExport={exportEnrollments}
        onRefresh={refetch}
        onBulkEmail={handleBulkEmail}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />
      
      <p className="text-muted-foreground">
        Manage participant enrollments across your events
      </p>

      {/* Stats Cards */}
      {stats && <EnrollmentStatsCards stats={stats} />}

      {/* Filters */}
      <EnrollmentFilters
        searchQuery={searchQuery}
        selectedEvent={selectedEvent}
        selectedStatus={selectedStatus}
        selectedDateRange={selectedDateRange}
        events={myEvents}
        onSearchChange={setSearchQuery}
        onEventChange={setSelectedEvent}
        onStatusChange={setSelectedStatus}
        onDateRangeChange={setSelectedDateRange}
      />

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredEnrollments.length} of {enrollments.length} enrollments
      </div>

      {/* Enrollments Table */}
      <EnrollmentTable
        enrollments={filteredEnrollments}
        onContactParticipant={handleContactParticipant}
        onViewProfile={handleViewProfile}
      />

      {/* Event Breakdown */}
      {stats && <EventBreakdown stats={stats} />}
    </div>
  );
};

export default EventEnrollmentsPage;
