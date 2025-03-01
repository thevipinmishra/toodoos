import {DateFormatter} from '@internationalized/date'

// Create formatter instances for different format patterns
export const dateFormatter = new DateFormatter('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
export const dateTimeFormatter = new DateFormatter('en-IN', {
  day: 'numeric', 
  month: 'short', 
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});

// Format date with or without time
export const formatDate = (date: Date, includeTime: boolean = false): string => {
  try {
    if (includeTime) {
      return dateTimeFormatter.format(date);
    }
    return dateFormatter.format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

// Check if a reminder should be active today
export const shouldReminderBeActiveToday = (
  recurringDays: number[] = []
): boolean => {
  const today = new Date().getDay();
  return recurringDays.includes(today);
};

// Get next occurrence for a recurring reminder
export const getNextOccurrence = (
  recurringDays: number[] = [],
  time: string = "00:00"
): Date => {
  const now = new Date();
  const today = now.getDay();
  const [hours, minutes] = time.split(":").map(Number);
  
  // Check if today is in recurring days and the time is in the future
  if (recurringDays.includes(today)) {
    const todayOccurrence = new Date();
    todayOccurrence.setHours(hours, minutes, 0, 0);
    
    if (todayOccurrence > now) {
      return todayOccurrence;
    }
  }
  
  // Find the next day in the recurring days list
  let daysToAdd = 1;
  let nextDay = (today + daysToAdd) % 7;
  
  while (!recurringDays.includes(nextDay) && daysToAdd < 7) {
    daysToAdd += 1;
    nextDay = (today + daysToAdd) % 7;
  }
  
  // If we couldn't find a day in the recurring days list, return today
  if (daysToAdd >= 7) return now;
  
  const nextDate = new Date();
  nextDate.setDate(now.getDate() + daysToAdd);
  nextDate.setHours(hours, minutes, 0, 0);
  
  return nextDate;
};

