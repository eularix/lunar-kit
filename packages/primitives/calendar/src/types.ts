export type Mode = 'single' | 'range' | 'multiple';

export type WeekStart = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type SingleValue = Date | null;
export type RangeValue = { from: Date | null; to: Date | null };
export type MultipleValue = Date[];

export type ValueByMode<M extends Mode> =
  M extends 'single' ? SingleValue
  : M extends 'range' ? RangeValue
  : MultipleValue;

export type Day = {
  date: Date;
  /** Day belongs to currently visible month. */
  inMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isDisabled: boolean;
  /* Range-specific */
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
};

export type CalendarContext<M extends Mode = Mode> = {
  mode: M;
  value: ValueByMode<M>;
  visibleMonth: Date;
  weekdays: string[];
  weeks: Day[][];
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  goToMonth: (date: Date) => void;
  goToToday: () => void;
  selectDay: (date: Date) => void;
  isDisabled: (date: Date) => boolean;
};
