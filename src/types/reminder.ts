export interface Reminder {
  id: string;
  title: string;
  datetime: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  isRecurring: boolean;
  recurringDays?: number[]; // 0-6 representing days of week (0 = Sunday)
  recurringTime?: string; // HH:MM format
}
