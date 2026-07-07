# Screenshots

Drop real Blockify screenshots here, then reference them from
`lib/constants.ts` (the `SCREENSHOTS` array). Recommended: PNG, 9:19.5 ratio
(e.g. 1080×2340), optimized/compressed.

Expected files (placeholders until added):

- `home.png` — Home Screen
- `shield.png` — Shield Screen
- `stats.png` — Statistics
- `focus.png` — Focus Session
- `settings.png` — Settings

Until real images exist, the gallery and hero fall back to polished
CSS-rendered mock screens in `components/ui/AppScreens.tsx`.

To use a real image instead of the CSS fallback, update `ScreenshotFrame`
in `components/sections/Screenshots.tsx` to render:

```tsx
import Image from "next/image";

<Image src={shot.src} alt={shot.title} fill className="object-cover" />
```
