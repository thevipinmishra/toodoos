import { BellRing } from 'lucide-react';
import { Button } from 'react-aria-components';
import { memo, useState } from 'react';
import { useNotificationContext } from '../../context/NotificationContext';

export const NotificationPermissionButton = memo(() => {
  const { hasNotificationPermission, requestNotificationPermission } = useNotificationContext();
  const [isRequesting, setIsRequesting] = useState(false);
  
  // Don't show if notifications are already enabled or not supported
  if (hasNotificationPermission === true || typeof Notification === 'undefined') {
    return null;
  }
  
  const handleRequestPermission = async () => {
    setIsRequesting(true);
    await requestNotificationPermission();
    setIsRequesting(false);
  };
  
  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onPress={handleRequestPermission}
        isDisabled={isRequesting}
        className="bg-gray-900 text-white px-4 py-2 rounded-md shadow-lg flex items-center gap-2 hover:bg-gray-800 transition-colors"
      >
        <BellRing size={16} />
        {isRequesting ? 'Requesting...' : 'Enable notifications'}
      </Button>
    </div>
  );
});

NotificationPermissionButton.displayName = 'NotificationPermissionButton';
