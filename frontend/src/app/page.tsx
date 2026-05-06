'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Search, Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { meetingService } from '@/services/api';
import { cn } from '@/lib/utils';

interface Meeting {
  id: number;
  title: string;
  notes: string;
  date_time: string;
}

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newMeeting, setNewMeeting] = useState({ title: '', notes: '' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const data = await meetingService.getMeetings();
      setMeetings(data);
    } catch (err) {
      console.error('Failed to fetch meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.title.trim()) return;

    try {
      const created = await meetingService.createMeeting(newMeeting);
      setMeetings([created, ...meetings]);
      setIsAdding(false);
      setNewMeeting({ title: '', notes: '' });
    } catch (err) {
      console.error('Failed to add meeting:', err);
    }
  };

  const filteredMeetings = meetings.filter(m => 
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Meeting Notes</h1>
          <p className="text-muted-foreground mt-1">Manage your client calls and follow-ups.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium transition-transform hover:scale-105 active:scale-95"
        >
          <Plus size={20} />
          <span>New Meeting</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={20} />
        <input
          type="text"
          placeholder="Search by meeting title..."
          className="w-full bg-secondary border border-border pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add Meeting Modal (Simple Overlay) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-md p-6 rounded-3xl shadow-2xl border border-border"
            >
              <h2 className="text-2xl font-bold mb-4">New Meeting</h2>
              <form onSubmit={handleAddMeeting} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Title</label>
                  <input
                    autoFocus
                    required
                    type="text"
                    className="w-full bg-secondary p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="E.g. Project Kickoff"
                    value={newMeeting.title}
                    onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground">Initial Notes</label>
                  <textarea
                    className="w-full bg-secondary p-3 rounded-xl border border-border focus:ring-2 focus:ring-primary/20 outline-none h-32 resize-none"
                    placeholder="Brief summary..."
                    value={newMeeting.notes}
                    onChange={(e) => setNewMeeting({ ...newMeeting, notes: e.target.value })}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 px-4 py-2 border border-border rounded-xl font-medium hover:bg-secondary transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meetings List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>Loading meetings...</p>
          </div>
        ) : filteredMeetings.length > 0 ? (
          filteredMeetings.map((meeting) => (
            <Link key={meeting.id} href={`/meetings/${meeting.id}`}>
              <motion.div 
                whileHover={{ y: -4 }}
                className="bg-card border border-border p-5 rounded-2xl flex items-center justify-between hover:shadow-lg transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 text-primary p-3 rounded-xl">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{meeting.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {mounted ? new Date(meeting.date_time).toLocaleDateString(undefined, { 
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                      }) : 'Loading date...'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-secondary/50 rounded-3xl border border-dashed border-border">
            <p className="text-muted-foreground">No meetings found. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
