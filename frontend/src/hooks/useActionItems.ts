import { useState } from 'react';
import { actionService } from '../services/api';

export function useActionItems() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addActionItem = async (meetingId: string, description: string) => {
    setLoading(true);
    try {
      const newItem = await actionService.addActionItem({ 
        meeting_id: parseInt(meetingId), 
        description 
      });
      setError(null);
      return newItem;
    } catch (err: any) {
      setError(err.message || 'Failed to add action item');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleActionStatus = async (id: number) => {
    try {
      await actionService.markAsDone(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to update action item');
      return false;
    }
  };

  const deleteActionItem = async (id: number) => {
    try {
      await actionService.deleteActionItem(id);
      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to delete action item');
      return false;
    }
  };

  return { addActionItem, toggleActionStatus, deleteActionItem, loading, error };
}
