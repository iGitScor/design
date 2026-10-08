# @iscor/design

See it at [design.iscor.me](https://design.iscor.me).

The colours, type and shapes shared by every app of the ecosystem ([Myna](https://podcast.iscor.me), list, remora, and the hub [iscor.me](https://iscor.me)): an off-white, an ink, one lime accent, Outfit, round corners, together the **Estuary** theme. Written once as tokens, delivered in the format each app reads.

| You build         | You get                                                                      | From                                                                |
| ----------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| A web app or site | CSS variables (`--ink`, `--accent`, `--r-xl`, `--font`…), in light and dark  | `npm install @iscor/design`                                         |
| A Tauri app       | The same CSS variables, in its web view                                      | `npm install @iscor/design`                                         |
| A JS or TS tool   | The same values as typed constants, or JSON                                  | the same package                                                    |
| A Swift app       | `Estuary.ink.color` (SwiftUI), `.nsColor` / `.uiColor`, radii, the font name | SwiftPM: this repository                                            |
| VS Code           | **Estuary Light** and **Estuary Dark** themes                                | `packages/vscode` (VS Code Marketplace and Open VSX)                |
| Xcode             | **Estuary Light** and **Estuary Dark** themes                                | `packages/xcode`: copy into Xcode ([how](packages/xcode/README.md)) |
| A script (Python) | `dist/tokens.json`: `{ light, dark, base }`                                  | the npm package, or a build of this repository                      |

## Use it

**CSS**, switched by the system's scheme, or forced with `data-theme="light"` or `"dark"` on `<html>`:

```css
@import '@iscor/design/tokens.css';

body {
  background: var(--backdrop);
  color: var(--ink);
  font-family: var(--font);
}
```

On a site that switches with a `.dark` class (VitePress), import `@iscor/design/tokens-class.css` instead.

**TypeScript**:

```ts
import { light, dark, base } from '@iscor/design'
light.accent // '#b9ff66'
```

**Swift**:

```swift
.package(url: "https://github.com/iGitScor/design", from: "0.1.0")

import IscorDesign
Text("Bonjour").foregroundStyle(Estuary.ink.color)
```

Each `EstuaryColor` follows the appearance it is drawn in (light or dark) by itself. The app ships the font (Outfit, SIL OFL: `@fontsource-variable/outfit` on the web).

## The rules

The tokens carry rules every app inherits, and `npm run check` enforces them on every change:

- **Lime is a fill, or text on dark surfaces, never text on a light one** (about 1.1:1). As text on light, use `--accent-text`.
- **Every text colour reads at 4.5:1 on every surface**, in both schemes: `ink`, `ink-soft`, `muted`, `accent-text`, `ok`, `warn`, `danger`, `info` on `backdrop`, `surface`, `card`, `card-2` and `field`; `on-accent` on the lime; `on-dark` on the dark bands.
- An app may override what is its own (a font, the corners) in its own stylesheet; colours stay the system's.

## Change it

The source is `tokens/`, in the [W3C design tokens format](https://www.designtokens.org/): `color.light.json` and `color.dark.json` (the same names in both), `base.json` (radii, fonts). Everything else is generated:

```sh
npm run build    # dist/ (npm), Sources/…/Tokens.swift, the VS Code and Xcode themes (committed)
npm run check    # the committed files match the tokens, and the contrast rules hold
npm run site     # site-dist/: design.iscor.me, deployed by .github/workflows/site.yml
swift test
```

The VS Code themes come from `packages/vscode/theme.template.json` and the Xcode themes from `packages/xcode/theme.template.json`, where each colour is a `{color.name}` reference.

Versions follow [Semantic Versioning](https://semver.org/): renaming or removing a token is a major version; adding one, a minor version. See the [changelog](CHANGELOG.md).

## Licence

The code and the tokens are under the [MIT licence](LICENSE). The art (the birds, the fishes, the kingfisher, the app logos) is not: [art/LICENSE](art/LICENSE).
