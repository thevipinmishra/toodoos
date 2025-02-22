import type {CalendarGridProps} from 'react-aria-components';
import {CalendarCell, CalendarStateContext} from 'react-aria-components';
import {useCalendarGrid} from '@react-aria/calendar'
import { useContext } from 'react';

export default function WeekCalendarGrid(props: CalendarGridProps) {
  const state = useContext(CalendarStateContext)!;
  const { gridProps } = useCalendarGrid(props, state);

  return (
    <table {...gridProps}>
      <tbody>
        <tr>
          {state.getDatesInWeek(0).map((date, i) => (
            date && <CalendarCell key={i} date={date}  className="flex items-center justify-center size-8 rounded-sm text-sm font-medium text-gray-600 cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-900 data-[selected]:bg-gray-900 data-[selected]:text-white data-[unavailable]:text-gray-300 data-[outside-month]:text-gray-300 aria-disabled:pointer-events-none aria-disabled:opacity-50 focus:outline-none focus:ring-1 focus:ring-gray-200" />
          ))}
        </tr>
      </tbody>
    </table>
  );
}