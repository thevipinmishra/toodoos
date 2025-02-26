import { Bell, X } from 'lucide-react';
import { Button } from 'react-aria-components';
import { memo, useEffect, useState } from 'react';
import { Reminder } from '../../types/reminder';
import cx from 'classix';
import { formatDate } from '../../utils/dateUtils';
import { parseZonedDateTime } from '@internationalized/date';

interface NotificationToastProps {
  reminder: Reminder;
  onDismiss: (id: string) => void;
  onCompleted: (id: string) => void;
}

export const NotificationToast = memo(({ reminder, onDismiss, onCompleted }: NotificationToastProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Animation effect
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for exit animation to complete
    setTimeout(() => onDismiss(reminder.id), 300);
  };
  
  const handleComplete = () => {
    setIsVisible(false);
    setTimeout(() => onCompleted(reminder.id), 300);
  };

  return (
    <div 
      className={cx(
        "fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md w-full border-l-4 border-gray-900 transform transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className="bg-gray-100 p-2 rounded-full">
          <Bell className="size-5 text-gray-700" />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">Reminder</h3>
              <p className="text-sm text-gray-600 mt-1">{reminder.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDate(parseZonedDateTime(reminder.datetime).toDate(), true)}
              </p>
            </div>
            
            <Button 
              onPress={handleDismiss}
              aria-label="Dismiss notification"
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <X size={16} />
            </Button>
          </div>
          
          <div className="mt-3 flex gap-2 justify-end">
            <Button
              onPress={handleComplete}
              className="py-1.5 px-3 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-800"
            >
              Mark as done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

NotificationToast.displayName = 'NotificationToast';
