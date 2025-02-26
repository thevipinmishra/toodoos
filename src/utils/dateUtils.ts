import { DateFormatter } from "@internationalized/date";

export const dateTimeFormatter = new DateFormatter("en-IN", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "numeric",
  hour12: true,
});

export const dateFormatter = new DateFormatter("en-IN", {
  day: "numeric",
  month: "short",
});

export const formatDate = (date: Date, includeTime: boolean = false) => {
  return includeTime
    ? dateTimeFormatter.format(date)
    : dateFormatter.format(date);
};
