import { ReactNode, createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { Reminder } from '../types/reminder';
import { useStore } from '../store';
import { audioService } from '../services/audioService';
import { parseZonedDateTime } from '@internationalized/date';

interface NotificationContextType {
  activeNotifications: Reminder[];
  dismissNotification: (id: string) => void;
  completeReminder: (id: string) => void;
  hasNotificationPermission: boolean | null;
  requestNotificationPermission: () => Promise<boolean>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Maximum number of active notifications to prevent memory issues
const MAX_ACTIVE_NOTIFICATIONS = 10;

// Maximum time to show browser notifications (in ms)
const NOTIFICATION_DURATION = 30000;

// Time to check for missed reminders (in ms)
const BACKUP_CHECK_INTERVAL = 60000;

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [activeNotifications, setActiveNotifications] = useState<Reminder[]>([]);
  const [hasNotificationPermission, setHasNotificationPermission] = useState<boolean | null>(null);
  const { reminders, toggleReminder } = useStore();
  
  // Store timeouts to clear them when needed
  const scheduledTimeoutsRef = useRef<Map<string, number>>(new Map());
  
  // Check for notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        setHasNotificationPermission(true);
      } else if (Notification.permission === 'denied') {
        setHasNotificationPermission(false);
      } else {
        setHasNotificationPermission(null); // 'default' state
      }
    } else {
      setHasNotificationPermission(false);
    }
  }, []);

  // Memoized function to prevent recreation on each render
  const triggerReminderNotification = useCallback((reminder: Reminder) => {
    // Skip completed reminders
    if (reminder.completed) return;
    
    // Skip reminders that are already being shown
    setActiveNotifications(prev => {
      if (prev.some(n => n.id === reminder.id)) return prev;
      
      const newNotifications = [...prev, reminder];
      // If we exceed the maximum, remove the oldest notifications
      if (newNotifications.length > MAX_ACTIVE_NOTIFICATIONS) {
        return newNotifications.slice(newNotifications.length - MAX_ACTIVE_NOTIFICATIONS);
      }
      return newNotifications;
    });
    
    // Show browser notification if permission granted
    if (hasNotificationPermission && typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const notification = new Notification('Reminder', {
          body: reminder.title,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          requireInteraction: true,
          silent: true
        });
        
        // Close browser notification after duration
        setTimeout(() => {
            notification.close();
        }, NOTIFICATION_DURATION);
      } catch (error) {
        console.error("Failed to create notification:", error);
      }
    }
    
    // Play sound
    audioService.playNotification().catch(error => 
      console.error("Failed to play notification sound:", error)
    );
  }, [hasNotificationPermission]);
  
  // Optimized scheduling function
  const scheduleReminders = useCallback(() => {
    const now = new Date();
    const scheduledIds = new Set(scheduledTimeoutsRef.current.keys());
    
    // Clear timeouts for reminders that no longer exist or are completed
    scheduledIds.forEach(id => {
      const reminder = reminders.find(r => r.id === id);
      if (!reminder || reminder.completed) {
        const timeoutId = scheduledTimeoutsRef.current.get(id);
        if (timeoutId !== undefined) {
          window.clearTimeout(timeoutId);
          scheduledTimeoutsRef.current.delete(id);
        }
      }
    });
    
    // Schedule each upcoming, non-completed reminder that isn't already scheduled
    reminders.forEach(reminder => {
      if (reminder.completed) return;
      if (scheduledTimeoutsRef.current.has(reminder.id)) return; // Already scheduled
      
      try {
        const reminderDate = parseZonedDateTime(reminder.datetime).toDate();
        
        // Skip if the reminder is already past due
        if (reminderDate < now) return;
        
        // Calculate milliseconds until the reminder is due - use precise calculation
        const timeUntilDue = reminderDate.getTime() - now.getTime();
        
        // Only schedule if it's in the future
        if (timeUntilDue <= 0) return;
        
        console.log(`Scheduling reminder "${reminder.title}" to trigger in ${timeUntilDue}ms`);
        
        // Schedule the reminder with precise timing
        const timeoutId = window.setTimeout(() => {
          console.log(`Triggering reminder: ${reminder.title}`);
          triggerReminderNotification(reminder);
          // Remove from scheduledTimeouts map once triggered
          scheduledTimeoutsRef.current.delete(reminder.id);
        }, timeUntilDue);
        
        // Store the timeout ID
        scheduledTimeoutsRef.current.set(reminder.id, timeoutId);
      } catch (e) {
        console.error(`Invalid date format for reminder: ${reminder.id}`, e);
      }
    });
  }, [reminders, triggerReminderNotification]);

  // Re-schedule reminders whenever the reminders list changes
  useEffect(() => {
    scheduleReminders();
    
    // Backup check periodically to catch any missed reminders
    const backupIntervalId = window.setInterval(() => {
      const now = new Date();
      
      reminders.forEach(reminder => {
        // Skip completed or already active reminders
        if (reminder.completed) return;
        
        setActiveNotifications(prev => {
          if (prev.some(n => n.id === reminder.id)) return prev;
          
          try {
            const reminderDate = parseZonedDateTime(reminder.datetime).toDate();
            // Check if reminder is due but somehow wasn't triggered (within last backup interval)
            if (reminderDate <= now && now.getTime() - reminderDate.getTime() <= BACKUP_CHECK_INTERVAL) {
              triggerReminderNotification(reminder);
            }
          } catch (e) {
            console.error(`Invalid date format for reminder: ${reminder.id}`, e);
          }
          
          return prev;
        });
      });
    }, BACKUP_CHECK_INTERVAL);
    
    return () => {
      // Clean up all timeouts when component unmounts or reminders change
      scheduledTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
      scheduledTimeoutsRef.current.clear();
      window.clearInterval(backupIntervalId);
    };
  }, [reminders, triggerReminderNotification, scheduleReminders]);
  
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }
    
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setHasNotificationPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const dismissNotification = useCallback((id: string) => {
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);
  
  const completeReminder = useCallback((id: string) => {
    toggleReminder(id);
    dismissNotification(id);
  }, [toggleReminder, dismissNotification]);

  // Value object memoized to prevent unnecessary re-renders
  const contextValue = {
    activeNotifications,
    dismissNotification,
    completeReminder,
    hasNotificationPermission,
    requestNotificationPermission,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};
