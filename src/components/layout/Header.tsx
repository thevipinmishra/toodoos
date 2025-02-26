import { Bell, Settings } from "lucide-react";
import {
  Button,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from "react-aria-components";
import { getGreeting } from "../../utils/greeting";
import { useState, useMemo, useCallback, memo, useEffect } from "react";
import { useUserName } from "../../hooks/useMetaState";
import { SettingsDialog } from "./SettingsDialog";
import { ReminderDialog } from "../reminders/ReminderDialog";
import { DateFormatter, fromDate, getLocalTimeZone } from "@internationalized/date";

const TimeDisplay = () => {
    const [currentDateTime, setCurrentDateTime] = useState(() =>
      fromDate(new Date(), getLocalTimeZone())
    );

    const dateTimeFormatter = new DateFormatter("en-IN", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      });
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentDateTime(fromDate(new Date(), getLocalTimeZone()));
      }, 1000);
  
      return () => clearInterval(timer);
    }, []);
  
    const formattedDateTime = useMemo(
      () => dateTimeFormatter.format(currentDateTime.toDate()),
      [currentDateTime]
    );
  
    return (
      <p className="text-gray-500 font-medium text-xs tabular-nums">
        {formattedDateTime}
      </p>
    );
  };

export const Header = memo(() => {
  const { name } = useUserName();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

  const greeting = useMemo(() => {
    const baseGreeting = getGreeting();
    return name ? `${baseGreeting}, ${name}` : baseGreeting;
  }, [name]);

  const handleSettingsDialogClose = useCallback(() => {
    setSettingsDialogOpen(false);
  }, []);

  return (
    <header className="bg-white py-4 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-gray-600 text-sm font-medium">{greeting}</p>
          <TimeDisplay />
        </div>

        <div className="flex gap-6">
          <ReminderButton />

          <DialogTrigger
            isOpen={settingsDialogOpen}
            onOpenChange={setSettingsDialogOpen}
          >
            <Button
              aria-label="Open settings"
              className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
            >
              <Settings size={16} />
            </Button>
            <SettingsDialog onClose={handleSettingsDialogClose} />
          </DialogTrigger>
        </div>
      </div>
    </header>
  );
});

Header.displayName = "Header";

const ReminderButton = memo(() => (
  <DialogTrigger>
    <Button
      aria-label="Open reminders"
      className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1"
    >
      <Bell size={16} />
    </Button>
    <ModalOverlay
      isDismissable
      className="fixed inset-0 bg-black/20 backdrop-blur-sm p-8 flex items-center justify-center overflow-y-auto entering:motion-preset-fade"
    >
      <Modal className="w-full max-w-md bg-white rounded-lg shadow-lg entering:motion-preset-slide-up-sm entering:motion-duration-200">
        <ReminderDialog />
      </Modal>
    </ModalOverlay>
  </DialogTrigger>
));

ReminderButton.displayName = "ReminderButton";
