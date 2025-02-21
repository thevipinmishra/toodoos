import { DateFormatter, fromDate, getLocalTimeZone } from '@internationalized/date';

export const dateFormatter = new DateFormatter('en-IN', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: 'numeric',
  hour12: true,
});

export function getCurrentDateTime() {
  return fromDate(new Date(), getLocalTimeZone()).toString();
}
