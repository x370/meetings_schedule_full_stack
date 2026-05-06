'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, Circle, Plus, Loader2, StickyNote, ListTodo } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { meetingService, actionService } from '@/services/api';
import { cn } from '@/lib/utils';

interface ActionItem {
  id: number;
  description: string;
  status: 'pending' | 'done';
}

interface Meeting {
  id: number;
  title: string;
  notes: string;
  date_time: string;
  action_items: ActionItem[];
}

export default function MeetingDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [newAction, setNewAction] = useState('');
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (id) fetchMeetingDetails();
  }, [id]);

  const fetchMeetingDetails = async () => {
    try {
      const data = await meetingService.getMeetingById(id as string);
      setMeeting(data);
    } catch (err) {
      console.error('Failed to fetch meeting details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAction.trim() || !meeting) return;

    setIsSubmittingAction(true);
    try {
      const created = await actionService.addActionItem({
        meeting_id: meeting.id,
        description: newAction,
      });
      setMeeting({
        ...meeting,
        action_items: [...meeting.action_items, created],
      });
      setNewAction('');
    } catch (err) {
      console.error('Failed to add action item:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleMarkAsDone = async (actionId: number) => {
    if (!meeting) return;

    // Optimistic update
    const updatedActions = meeting.action_items.map(item => 
      item.id === actionId ? { ...item, status: 'done' as const } : item
    );
    setMeeting({ ...meeting, action_items: updatedActions });

    try {
      await actionService.markAsDone(actionId);
    } catch (err) {
      console.error('Failed to mark as done:', err);
      // Revert if failed
      fetchMeetingDetails();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading meeting details...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Meeting not found</h2>
        <button onClick={() => router.push('/')} className="mt-4 text-primary font-medium hover:underline">
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      {/* Back Button */}
      <button 
        onClick={() => router.push('/')}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span>Back to Meetings</span>
      </button>

      {/* Header */}
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight">{meeting.title}</h1>
        <p className="text-muted-foreground flex items-center gap-2">
          <CalendarIcon size={16} />
          {mounted ? new Date(meeting.date_time).toLocaleDateString(undefined, { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
          }) : 'Loading date...'}
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Notes Section */}
        <section className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <StickyNote size={20} />
            <h2 className="text-xl font-bold">Notes</h2>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm min-h-[300px] leading-relaxed text-lg">
            {meeting.notes || "No notes captured for this meeting."}
          </div>
        </section>

        {/* Action Items Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <ListTodo size={20} />
            <h2 className="text-xl font-bold">Action Items</h2>
          </div>
          
          <div className="bg-secondary/30 rounded-3xl border border-border p-5 space-y-4">
            {/* Action Item List */}
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
              <AnimatePresence initial={false}>
                {meeting.action_items.length > 0 ? (
                  meeting.action_items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-2xl transition-all",
                        item.status === 'done' ? "bg-muted/50 opacity-60" : "bg-card border border-border shadow-sm"
                      )}
                    >
                      <button 
                        onClick={() => item.status === 'pending' && handleMarkAsDone(item.id)}
                        disabled={item.status === 'done'}
                        className={cn(
                          "mt-0.5 transition-transform active:scale-90",
                          item.status === 'done' ? "text-green-500" : "text-muted-foreground hover:text-primary"
                        )}
                      >
                        {item.status === 'done' ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </button>
                      <span className={cn(
                        "text-sm font-medium",
                        item.status === 'done' && "line-through text-muted-foreground"
                      )}>
                        {item.description}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-sm text-muted-foreground py-4">No action items yet.</p>
                )}
              </AnimatePresence>
            </div>

            {/* Add Action Input */}
            <form onSubmit={handleAddAction} className="relative mt-4">
              <input
                type="text"
                placeholder="Add new action..."
                className="w-full bg-card border border-border pl-4 pr-10 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                disabled={isSubmittingAction}
              />
              <button 
                type="submit"
                disabled={!newAction.trim() || isSubmittingAction}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary text-primary-foreground p-1.5 rounded-xl disabled:opacity-50 transition-all hover:scale-105"
              >
                {isSubmittingAction ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
}

function CalendarIcon({ size }: { size: number }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
