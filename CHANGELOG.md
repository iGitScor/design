# Changelog

All notable changes are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/): a token renamed or removed is a major version, a token added is a minor one, a value changed is a patch only if it keeps every contrast rule.

## [Unreleased]

## [0.4.0] - 2026-10-18

- Increase Contrast: `tokens/color.contrast.{light,dark}.json` darken the inks on light and lighten them on dark, and strengthen lines, borders and the accent's tints. In CSS under `prefers-contrast: more` (both stylesheets), in JS and JSON as `contrast.light` and `contrast.dark` (complete schemes), and in Swift through `EstuaryColor`, which reads the appearance (AppKit), the traits (UIKit) or `colorSchemeContrast` (SwiftUI); `components(dark:increasedContrast:)`. Checked: every text colour at 7:1 on every surface. The values come from remora's Mac app, adjusted where a text missed 7:1.
- Soft status fills, `ok-soft`, `warn-soft`, `danger-soft` and `info-soft`: the background of a status chip or banner, with its colour reading on it at 4.5:1 (7:1 under Increase Contrast) over every surface a chip sits on. The site's status pattern uses them.

## [0.3.0] - 2026-10-18

- `opacity.disabled` (0.45): a control that can't be used yet looks it. `--disabled-opacity` in CSS, `base.disabled` in JS and JSON, `Estuary.Opacity.disabled` in Swift, and a disabled button in the site's patterns.

## [0.2.0] - 2026-10-08

- Swift: the package ships Outfit (SIL OFL) and `Estuary.font(size:weight:relativeTo:)` sets it at any weight, following Dynamic Type; `Estuary.registerFonts()` for AppKit and UIKit code that names it.
- Swift: each colour is a SwiftUI style, `.foregroundStyle(Estuary.ink)`, resolved in the colour scheme of the view it is drawn in. `.color` still works.
- Swift: built for iOS on every change, as well as macOS.
- Estuary Light and Estuary Dark for Xcode (`packages/xcode`), generated from the tokens like the VS Code themes.

## [0.1.0] - 2026-10-08

- The tokens of Myna, list, remora and iscor.me in one place: 29 colours in a light and a dark scheme, the radii and the fonts.
- `info`, a blue for neutral states (list's "partial"), contrast-checked in both schemes.
- CSS variables (switched by the OS or `data-theme`, or by a `.dark` class), JSON, typed JavaScript, a Swift package, and the VS Code themes, all generated from the tokens.
- Contrast rules checked on every change: 4.5:1 for every text colour on every surface, in both schemes.
