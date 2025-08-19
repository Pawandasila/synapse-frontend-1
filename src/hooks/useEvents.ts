import { useState, useEffect } from "react";
import { eventsAPI } from "@/lib/api";

export interface Event {
  EventID: number;
  OrganizerID: number;
  Name: string;
  Description: string;
  Theme: string;
  Mode: "Online" | "Offline" | "Hybrid";
  StartDate: string;
  EndDate: string;
  SubmissionDeadline: string | null;
  ResultDate: string | null;
  Rules: string;
  Timeline: string;
  Tracks: string;
  Prizes: string;
  MaxTeamSize: number;
  Sponsors: string | null;
  IsActive: boolean;
  CreatedAt: string;
}

const transformEvent = (apiEvent: Event): Event => {
  // Return the event as-is since we want to use the exact API structure
  return apiEvent;
};

export interface EventSearchParams {
  query?: string;
  mode?: string;
  theme?: string;
}

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getAll();
      const eventsData = response.data || response;

      const transformedEvents = eventsData.map(transformEvent);
      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return { events, loading, error, refetch: fetchEvents };
};

export const useUpcomingEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUpcomingEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getUpcoming();
      const eventsData = response.data || response;
      const transformedEvents = eventsData.map(transformEvent);
      setEvents(transformedEvents);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch upcoming events"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  return { events, loading, error, refetch: fetchUpcomingEvents };
};

export const useEventSearch = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchEvents = async (params: EventSearchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.search(
        params.query,
        params.mode,
        params.theme
      );
      const eventsData = response.data || response;
      const transformedEvents = eventsData.map(transformEvent);
      setEvents(transformedEvents);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to search events");
    } finally {
      setLoading(false);
    }
  };

  return { events, loading, error, searchEvents };
};

export const useEvent = (id: string | null) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventsAPI.getById(eventId);
      const eventData = response.data || response;
      const transformedEvent = transformEvent(eventData);
      setEvent(transformedEvent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    } else {
      setLoading(false);
    }
  }, [id]);

  return { event, loading, error, refetch: () => id && fetchEvent(id) };
};
