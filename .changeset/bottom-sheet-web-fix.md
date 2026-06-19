---
"@lunar-primitive/bottom-sheet": minor
---

Fix web rendering: `BottomSheet` now uses `AdaptiveModal` instead of `react-native`'s `Modal` directly. The previous implementation rendered as a partial/broken modal under `react-native-web`. With `AdaptiveModal`, sheets render via DOM portal on web while keeping native behavior on iOS/Android.
