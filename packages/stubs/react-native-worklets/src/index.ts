export {};

const noop = () => {};
const identity = <T,>(v: T): T => v;

// On web there's no separate UI thread. The `runOn*` helpers are higher-order
// (`runOnUI(worklet)(...args)`), so they MUST return a callable — returning a
// bare noop makes `runOnUI(fn)(...)` throw "is not a function". Return the
// passed function so worklets/callbacks still run inline on web.
const toCallable = (fn?: unknown) =>
  typeof fn === 'function' ? (fn as (...a: unknown[]) => unknown) : noop;
const findFn = (args: unknown[]) => args.find((a) => typeof a === 'function');
// `scheduleOn*` are called directly with the fn + its args.
const callNow = (fn?: unknown, ...args: unknown[]) =>
  typeof fn === 'function' ? (fn as (...a: unknown[]) => unknown)(...args) : undefined;

export const createSerializable = identity;
export const createShareable = identity;
export const createSynchronizable = identity;
export const createWorkletRuntime = () => ({});
export const executeOnUIRuntimeSync = toCallable;
export const isWorkletFunction = () => false;
export const makeShareable = identity;
export const runOnJS = toCallable;
export const runOnRuntime = (...args: unknown[]) => toCallable(findFn(args));
export const runOnUI = toCallable;
export const runOnUISync = toCallable;
export const scheduleOnRN = callNow;
export const scheduleOnUI = callNow;
export const serializableMappingCache = new Map();
export const UIRuntimeId = 0;
export const RuntimeKind = { UI: 'ui', RN: 'rn' } as const;
export const WorkletsModule = { scheduleOnRN: callNow, createValue: () => ({}), addListener: noop };

// Missing exports needed by reanimated 4.x
export const getUIRuntimeHolder = noop;
export const getUISchedulerHolder = noop;
export const getStaticFeatureFlag = () => false;
export const callMicrotasks = noop;
export default {};