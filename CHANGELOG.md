# Changelog

All notable changes are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versions follow [Semantic Versioning](https://semver.org/): a token renamed or removed is a major version, a token added is a minor one, a value changed is a patch only if it keeps every contrast rule.

## [Unreleased]

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
