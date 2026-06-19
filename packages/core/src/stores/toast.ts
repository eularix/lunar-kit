import { create } from 'zustand';

// Cross-platform unique ID. RN/Metro can't resolve `node:crypto`; web `crypto.randomUUID`
// isn't always available in older browsers. Counter + timestamp + Math.random suffices for
// in-memory toast IDs (collision risk negligible at human-scale toast frequency).
let __toastCounter = 0;
function makeId(): string {
  __toastCounter = (__toastCounter + 1) % Number.MAX_SAFE_INTEGER;
  return `toast-${Date.now().toString(36)}-${__toastCounter.toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export interface Toast {
    id: string;
    title?: string;
    description?: string;
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
    duration?: number;
    position?: 'top' | 'bottom';
    direction?: 'top' | 'bottom' | 'left' | 'right';
}

interface ToastState {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, 'id'>) => string;
    removeToast: (id: string) => void;
    dismissToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
    toasts: [],
    addToast: (toast) => {
        const id = makeId();
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));
        return id;
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        })),
    dismissToast: (id) => {
        // Just remove for now, could add 'dismissing' state for animations
        set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
        }));
    }
}));

export const toast = (props: Omit<Toast, 'id'>) => {
    return useToastStore.getState().addToast(props);
};

toast.success = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'success', ...options });
toast.error = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'error', ...options });
toast.warning = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'warning', ...options });
toast.info = (title: string, description?: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'description' | 'variant'>>) => 
    toast({ title, description, variant: 'info', ...options });
