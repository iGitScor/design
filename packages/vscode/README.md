# Estuary for VS Code

The Estuary theme of [@iscor/design](https://github.com/iGitScor/design), as two color themes, **Estuary Light** and **Estuary Dark**: the same off-white, ink and lime as Myna, list, remora and iscor.me.

Lime is a fill, or text on dark surfaces, never text on light ones: the light theme uses the darker accent text where the dark one uses lime, and the focus and progress colours for the focus ring, the cursor and the progress bar.

The theme files are generated from the design system's tokens (`themes/` is written by `npm run build` at the repository's root, from `theme.template.json`): change a colour in `tokens/`, not here.

## Try it

Open this folder in VS Code and press `F5`: a second window opens with the extension loaded. Pick the theme with **Preferences: Color Theme**.

## Install it

```sh
npx @vscode/vsce package
code --install-extension estuary-theme-0.1.0.vsix
```
