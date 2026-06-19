export type Side = 'top' | 'bottom' | 'left' | 'right';
export type Align = 'start' | 'center' | 'end';

export type Rect = { x: number; y: number; width: number; height: number };

export type PopoverContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRect: Rect | null;
  setTriggerRect: (r: Rect | null) => void;
};
