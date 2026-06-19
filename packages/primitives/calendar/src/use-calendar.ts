import { useCallback, useMemo, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import type {
  CalendarContext,
  Day,
  Mode,
  RangeValue,
  ValueByMode,
  WeekStart,
} from './types';

export type UseCalendarOptions<M extends Mode> = {
  mode?: M;
  value?: ValueByMode<M>;
  defaultValue?: ValueByMode<M>;
  onValueChange?: (v: ValueByMode<M>) => void;
  defaultMonth?: Date;
  weekStartsOn?: WeekStart;
  minDate?: Date;
  maxDate?: Date;
  disabled?: (date: Date) => boolean;
  /** 7-element array of weekday short labels. Defaults to en-US. */
  weekdayLabels?: string[];
};

const DEFAULT_WEEKDAYS_SUN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function isSameDay(a: Dayjs, b: Dayjs): boolean {
  return a.isSame(b, 'day');
}

function withinRange(d: Dayjs, from: Dayjs, to: Dayjs): boolean {
  return (d.isAfter(from, 'day') || d.isSame(from, 'day')) &&
         (d.isBefore(to, 'day') || d.isSame(to, 'day'));
}

export function useCalendar<M extends Mode = 'single'>(
  options: UseCalendarOptions<M> = {}
): CalendarContext<M> {
  const {
    mode = 'single' as M,
    value: valueProp,
    defaultValue,
    onValueChange,
    defaultMonth,
    weekStartsOn = 0,
    minDate,
    maxDate,
    disabled,
    weekdayLabels,
  } = options;

  const initialValue = (defaultValue ?? defaultValueFor(mode)) as ValueByMode<M>;
  const [internalValue, setInternalValue] = useState<ValueByMode<M>>(initialValue);
  const value = (valueProp !== undefined ? valueProp : internalValue) as ValueByMode<M>;

  const initialMonth = defaultMonth
    ? dayjs(defaultMonth)
    : dayjs(firstSelected(value as any) ?? new Date());
  const [visibleMonth, setVisibleMonth] = useState<Dayjs>(initialMonth.startOf('month'));

  const setValue = useCallback(
    (v: ValueByMode<M>) => {
      if (valueProp === undefined) setInternalValue(v);
      onValueChange?.(v);
    },
    [valueProp, onValueChange]
  );

  const isDateDisabled = useCallback(
    (d: Date): boolean => {
      if (minDate && dayjs(d).isBefore(dayjs(minDate), 'day')) return true;
      if (maxDate && dayjs(d).isAfter(dayjs(maxDate), 'day')) return true;
      if (disabled?.(d)) return true;
      return false;
    },
    [minDate, maxDate, disabled]
  );

  const weekdays = useMemo(() => {
    const base = weekdayLabels ?? DEFAULT_WEEKDAYS_SUN;
    return rotate(base, weekStartsOn);
  }, [weekdayLabels, weekStartsOn]);

  const weeks = useMemo<Day[][]>(() => {
    const monthStart = visibleMonth.startOf('month');
    const monthEnd = visibleMonth.endOf('month');
    /* Find first cell: the start of the week containing monthStart. */
    const startOffset = (monthStart.day() - weekStartsOn + 7) % 7;
    const gridStart = monthStart.subtract(startOffset, 'day');

    const today = dayjs();
    const out: Day[][] = [];
    let cursor = gridStart;
    /* Render until we cover the month and complete the trailing week. */
    while (true) {
      const week: Day[] = [];
      for (let i = 0; i < 7; i++) {
        const d = cursor;
        const date = d.toDate();
        week.push({
          date,
          inMonth: d.month() === monthStart.month() && d.year() === monthStart.year(),
          isToday: isSameDay(d, today),
          isSelected: isSelectedFor(value as any, mode, d),
          isDisabled: isDateDisabled(date),
          isInRange: mode === 'range' ? isInRangeFor(value as any, d) : false,
          isRangeStart: mode === 'range' ? isRangeBoundary(value as any, d, 'from') : false,
          isRangeEnd: mode === 'range' ? isRangeBoundary(value as any, d, 'to') : false,
        });
        cursor = cursor.add(1, 'day');
      }
      out.push(week);
      if (cursor.isAfter(monthEnd, 'day') && out.length >= 5) break;
      if (out.length >= 6) break;
    }
    return out;
  }, [visibleMonth, value, mode, weekStartsOn, isDateDisabled]);

  const selectDay = useCallback(
    (d: Date) => {
      if (isDateDisabled(d)) return;
      if (mode === 'single') {
        setValue(d as ValueByMode<M>);
        return;
      }
      if (mode === 'range') {
        const range = (value as unknown as RangeValue) || { from: null, to: null };
        const { from, to } = range;
        let next: RangeValue;
        if (!from || (from && to)) {
          next = { from: d, to: null };
        } else {
          if (dayjs(d).isBefore(dayjs(from), 'day')) {
            next = { from: d, to: from };
          } else {
            next = { from, to: d };
          }
        }
        setValue(next as ValueByMode<M>);
        return;
      }
      /* multiple */
      const arr = ((value as unknown as Date[]) ?? []).slice();
      const idx = arr.findIndex((x) => isSameDay(dayjs(x), dayjs(d)));
      if (idx >= 0) arr.splice(idx, 1);
      else arr.push(d);
      setValue(arr as ValueByMode<M>);
    },
    [mode, value, setValue, isDateDisabled]
  );

  return {
    mode,
    value,
    visibleMonth: visibleMonth.toDate(),
    weekdays,
    weeks,
    goToPrevMonth: () => setVisibleMonth((m) => m.subtract(1, 'month')),
    goToNextMonth: () => setVisibleMonth((m) => m.add(1, 'month')),
    goToMonth: (d: Date) => setVisibleMonth(dayjs(d).startOf('month')),
    goToToday: () => setVisibleMonth(dayjs().startOf('month')),
    selectDay,
    isDisabled: isDateDisabled,
  };
}

/* ---------- helpers ---------- */

function defaultValueFor(mode: Mode): ValueByMode<Mode> {
  if (mode === 'range') return { from: null, to: null } as RangeValue;
  if (mode === 'multiple') return [] as Date[];
  return null as unknown as Date;
}

function firstSelected(value: any): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value[0];
  if (value.from instanceof Date) return value.from;
  return undefined;
}

function isSelectedFor(value: any, mode: Mode, d: Dayjs): boolean {
  if (mode === 'single') return value instanceof Date && isSameDay(dayjs(value), d);
  if (mode === 'range') {
    if (!value) return false;
    const fromMatch = value.from instanceof Date && isSameDay(dayjs(value.from), d);
    const toMatch = value.to instanceof Date && isSameDay(dayjs(value.to), d);
    return fromMatch || toMatch;
  }
  if (mode === 'multiple') {
    return Array.isArray(value) && value.some((x: Date) => isSameDay(dayjs(x), d));
  }
  return false;
}

function isInRangeFor(value: any, d: Dayjs): boolean {
  if (!value || !(value.from instanceof Date) || !(value.to instanceof Date)) return false;
  return withinRange(d, dayjs(value.from), dayjs(value.to));
}

function isRangeBoundary(value: any, d: Dayjs, side: 'from' | 'to'): boolean {
  if (!value) return false;
  const target = value[side];
  return target instanceof Date && isSameDay(dayjs(target), d);
}

function rotate<T>(arr: T[], n: number): T[] {
  const k = ((n % arr.length) + arr.length) % arr.length;
  return arr.slice(k).concat(arr.slice(0, k));
}
