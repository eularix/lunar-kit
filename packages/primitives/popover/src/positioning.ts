import type { Side, Align, Rect } from './types';

export type ComputeArgs = {
  trigger: Rect;
  content: { width: number; height: number };
  viewport: { width: number; height: number };
  side: Side;
  align: Align;
  sideOffset: number;
  collisionPadding: number;
  avoidCollisions: boolean;
};

export type ComputeResult = {
  top: number;
  left: number;
  /** Resolved side after possible flip. */
  side: Side;
  /** Resolved align after possible nudge. */
  align: Align;
};

const flipSide = (s: Side): Side =>
  s === 'top' ? 'bottom' : s === 'bottom' ? 'top' : s === 'left' ? 'right' : 'left';

function placeOnAxis(side: Side, args: ComputeArgs): { top: number; left: number } {
  const { trigger, content, sideOffset } = args;
  switch (side) {
    case 'top':
      return { top: trigger.y - content.height - sideOffset, left: 0 };
    case 'bottom':
      return { top: trigger.y + trigger.height + sideOffset, left: 0 };
    case 'left':
      return { top: 0, left: trigger.x - content.width - sideOffset };
    case 'right':
      return { top: 0, left: trigger.x + trigger.width + sideOffset };
  }
}

function alignOnAxis(side: Side, args: ComputeArgs): number {
  const { trigger, content, align } = args;
  const isVertical = side === 'top' || side === 'bottom';
  const triggerStart = isVertical ? trigger.x : trigger.y;
  const triggerSize = isVertical ? trigger.width : trigger.height;
  const contentSize = isVertical ? content.width : content.height;
  switch (align) {
    case 'start': return triggerStart;
    case 'end': return triggerStart + triggerSize - contentSize;
    case 'center':
    default: return triggerStart + triggerSize / 2 - contentSize / 2;
  }
}

function fits(side: Side, top: number, left: number, args: ComputeArgs): boolean {
  const { content, viewport, collisionPadding: pad } = args;
  if (side === 'top') return top >= pad;
  if (side === 'bottom') return top + content.height <= viewport.height - pad;
  if (side === 'left') return left >= pad;
  return left + content.width <= viewport.width - pad;
}

export function computePosition(args: ComputeArgs): ComputeResult {
  let resolvedSide = args.side;
  let placement = placeOnAxis(resolvedSide, args);
  let cross = alignOnAxis(resolvedSide, args);

  const isVertical = resolvedSide === 'top' || resolvedSide === 'bottom';
  let top = isVertical ? placement.top : cross;
  let left = isVertical ? cross : placement.left;

  if (args.avoidCollisions && !fits(resolvedSide, top, left, args)) {
    const flipped = flipSide(resolvedSide);
    const flippedPlacement = placeOnAxis(flipped, args);
    const flippedCross = alignOnAxis(flipped, args);
    const fIsVertical = flipped === 'top' || flipped === 'bottom';
    const fTop = fIsVertical ? flippedPlacement.top : flippedCross;
    const fLeft = fIsVertical ? flippedCross : flippedPlacement.left;
    if (fits(flipped, fTop, fLeft, args)) {
      resolvedSide = flipped;
      top = fTop;
      left = fLeft;
    }
  }

  /* Clamp cross axis inside viewport. */
  const { content, viewport, collisionPadding: pad } = args;
  if (resolvedSide === 'top' || resolvedSide === 'bottom') {
    left = Math.max(pad, Math.min(left, viewport.width - content.width - pad));
  } else {
    top = Math.max(pad, Math.min(top, viewport.height - content.height - pad));
  }

  return { top, left, side: resolvedSide, align: args.align };
}
