import { useState, useEffect, useCallback } from 'react';
import { meetingService } from '../services/api';

export interface Meeting {
  id: number;
  title: string;
  notes: string;
  date_time: string;
  action_items?: { status: string }[];
}

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await meetingService.getMeetings();
      setMeetings(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  }, []);

  const addMeeting = async (title: string, notes: string) => {
    try {
      const newMeeting = await meetingService.createMeeting({ title, notes });
      setMeetings(prev => [newMeeting, ...prev]);
      return newMeeting;
    } catch (err: any) {
      throw new Error(err.message || 'Failed to add meeting');
    }
  };

  const deleteMeeting = async (id: number) => {
    try {
      await meetingService.deleteMeeting(id);
      setMeetings(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      throw new Error(err.message || 'Failed to delete meeting');
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  return { meetings, loading, error, fetchMeetings, addMeeting, deleteMeeting };
}

export function useMeeting(id: string) {
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMeeting = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await meetingService.getMeetingById(id);
      setMeeting(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch meeting');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchMeeting();
  }, [fetchMeeting]);

  return { meeting, loading, error, setMeeting, refreshMeeting: fetchMeeting };
}
