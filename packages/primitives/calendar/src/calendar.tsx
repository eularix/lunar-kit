import * as React from 'react';
import type { CalendarContext, Mode } from './types';
import { useCalendar, type UseCalendarOptions } from './use-calendar';

/* Optional Provider — share state between sibling components (header outside grid). */

const CalendarCtx = React.createContext<CalendarContext<Mode> | null>(null);

export type CalendarProviderProps<M extends Mode = 'single'> = UseCalendarOptions<M> & {
  children: React.ReactNode;
};

export function CalendarProvider<M extends Mode = 'single'>(
  props: CalendarProviderProps<M>
) {
  const { children, ...options } = props;
  const ctx = useCalendar<M>(options);
  return (
    <CalendarCtx.Provider value={ctx as unknown as CalendarContext<Mode>}>
      {children}
    </CalendarCtx.Provider>
  );
}

export function useCalendarContext<M extends Mode = Mode>(): CalendarContext<M> {
  const ctx = React.useContext(CalendarCtx);
  if (!ctx) throw new Error('useCalendarContext must be used inside <CalendarProvider />');
  return ctx as unknown as CalendarContext<M>;
}
