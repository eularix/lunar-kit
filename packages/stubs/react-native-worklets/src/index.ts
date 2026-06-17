export {};

const noop = () => {};
const identity = <T,>(v: T): T => v;

export const createSerializable = identity;
export const createShareable = identity;
export const createSynchronizable = identity;
export const createWorkletRuntime = () => ({});
export const executeOnUIRuntimeSync = noop;
export const isWorkletFunction = () => false;
export const makeShareable = identity;
export const runOnJS = noop;
export const runOnRuntime = noop;
export const runOnUI = noop;
export const runOnUISync = noop;
export const scheduleOnRN = noop;
export const scheduleOnUI = noop;
export const serializableMappingCache = new Map();
export const UIRuntimeId = 0;
export const RuntimeKind = { UI: 'ui', RN: 'rn' } as const;
export const WorkletsModule = { scheduleOnRN: noop, createValue: () => ({}), addListener: noop };

// Missing exports needed by reanimated 4.x
export const getUIRuntimeHolder = noop;
export const getUISchedulerHolder = noop;
export const getStaticFeatureFlag = () => false;
export const callMicrotasks = noop;
export default {};