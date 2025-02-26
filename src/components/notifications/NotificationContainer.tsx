import { memo } from 'react';
import { NotificationToast } from './NotificationToast';
import { useNotificationContext } from '../../context/NotificationContext';

export const NotificationContainer = memo(() => {
  const { activeNotifications, dismissNotification, completeReminder } = useNotificationContext();

  if (activeNotifications.length === 0) {
    return null;
  }

  return (
    <>
      {activeNotifications.map((reminder) => (
        <NotificationToast 
          key={reminder.id} 
          reminder={reminder} 
          onDismiss={dismissNotification}
          onCompleted={completeReminder}
        />
      ))}
    </>
  );
});

NotificationContainer.displayName = 'NotificationContainer';
