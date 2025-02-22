import { Settings } from "lucide-react";
import { Button, DialogTrigger } from "react-aria-components";
import { getGreeting } from "../../utils/greeting";
import { useState, useEffect, useMemo } from "react";
import { useUserName } from "../../hooks/useMetaState";
import {
  fromDate,
  getLocalTimeZone,
  DateFormatter,
} from "@internationalized/date";
import { SettingsDialog } from "./SettingsDialog";

const dateTimeFormatter = new DateFormatter("en-IN", {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
});

export const Header = () => {
  const { name } = useUserName();
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(() =>
    fromDate(new Date(), getLocalTimeZone())
  );

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

  const greeting = useMemo(() => {
    const baseGreeting = getGreeting();
    return name ? `${baseGreeting}, ${name}` : baseGreeting;
  }, [name]);

  return (
    <header className="bg-white py-4 border-b border-gray-200">
      <div className="container flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-gray-600 text-sm font-medium">{greeting}</p>
          <p className="text-gray-500 font-medium text-xs tabular-nums">
            {formattedDateTime}
          </p>
        </div>

        <DialogTrigger
          isOpen={settingsDialogOpen}
          onOpenChange={setSettingsDialogOpen}
        >
          <Button className="p-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors outline-none ring-gray-200 focus-visible:ring-1">
            <Settings size={16} />
          </Button>
          <SettingsDialog onClose={() => setSettingsDialogOpen(false)} />
        </DialogTrigger>
      </div>
    </header>
  );
};
