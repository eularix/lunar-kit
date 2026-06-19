---
"@lunar-primitive/adaptive-modal": major
---

**BREAKING:** Removed `AdaptiveModalRef` and `forwardRef` API. The component is now props-only (`visible` controls visibility). The previous `present()` / `dismiss()` ref methods were no-ops; use `visible` and `onDismiss` instead.

Web a11y + UX improvements:
- ESC key closes the modal (when `closeOnBackdropPress`).
- Focus trap inside the dialog (Tab / Shift+Tab cycles focusable elements).
- `role="dialog"` + `aria-modal="true"` on the dialog root.
- New `aria-label` / `aria-labelledby` props.
- Body scroll lock while open (reference-counted across stacked modals).
- Restores focus to the previously-active element on close.

Internal:
- `Portal` now uses static `react-dom` import instead of `require()` (less fragile under strict ESM).
