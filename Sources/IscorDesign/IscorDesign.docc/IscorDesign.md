# ``IscorDesign``

The colours, type and shapes of Myna, list, remora and iscor.me: the Estuary theme, for SwiftUI, AppKit and UIKit.

## Overview

An off-white, an ink, one lime accent, Outfit, round corners. The values come from the same tokens as the web's CSS variables and the editor themes, generated from one source: [design.iscor.me](https://design.iscor.me).

```swift
import IscorDesign

Text("Bonjour")
    .font(Estuary.font(size: 17, weight: .semibold))
    .foregroundStyle(Estuary.ink)
    .background(Estuary.card, in: .rect(cornerRadius: Estuary.Radius.lg))
```

Every colour has a light and a dark value and resolves itself in the colour scheme of the view it is drawn in. The package ships Outfit (SIL Open Font License) and registers it the first time it is used.

### The rules the colours keep

- Lime (``Estuary/accent``) is a fill, or text on dark surfaces, never text on a light one. As text, use ``Estuary/accentText``.
- Every text colour reads at 4.5:1 on every surface, in both schemes. On the dark bands, use ``Estuary/onDark`` and ``Estuary/onDarkMuted``.

## Topics

### Tokens

- ``Estuary``
- ``EstuaryColor``

### Type

- ``Estuary/font(size:weight:relativeTo:)``
- ``Estuary/registerFonts()``
