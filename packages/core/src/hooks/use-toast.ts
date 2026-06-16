import { useToastStore, toast, type Toast } from '../stores/toast';

export function useToast() {
    const toasts = useToastStore((state) => state.toasts);
    const dismissToast = useToastStore((state) => state.dismissToast);

    // Return the rich `toast` (with .success/.error/.warning/.info), not the
    // bare store action — the bare `addToast` has none of those methods.
    return {
        toasts,
        toast,
        dismiss: dismissToast,
    };
}
