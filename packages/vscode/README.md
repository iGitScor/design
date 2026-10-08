# Estuary for VS Code

The Estuary theme of [@iscor/design](https://design.iscor.me), as two color themes, **Estuary Light** and **Estuary Dark**: the same off-white, ink and lime as Myna, list, remora and iscor.me.

Lime is a fill, or text on dark surfaces, never text on light ones: the light theme uses the darker accent text where the dark one uses lime, and the focus and progress colours for the focus ring, the cursor and the progress bar. Every text colour reads at 4.5:1 on the editor's background, in both themes.

## Install it

Search for **Estuary** in the Extensions view, or:

```sh
code --install-extension igitscor.estuary-theme
```

Then pick **Estuary Light** or **Estuary Dark** with **Preferences: Color Theme**. To follow the system's appearance, in your settings:

```json
"window.autoDetectColorScheme": true,
"workbench.preferredLightColorTheme": "Estuary Light",
"workbench.preferredDarkColorTheme": "Estuary Dark"
```

The same theme exists for Xcode, and as CSS variables, typed tokens and a Swift package: [design.iscor.me](https://design.iscor.me).

## Change it

The theme files are generated from the design system's tokens (`themes/` is written by `npm run build` at the repository's root, from `theme.template.json`): change a colour in `tokens/`, not here.

To try a change, open this folder in VS Code and press `F5`: a second window opens with the extension loaded. To publish, bump `version` here and in `CHANGELOG.md`, then push a `vscode-v<version>` tag: `.github/workflows/vscode.yml` publishes to the Marketplace and Open VSX.
