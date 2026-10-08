# Estuary for Xcode

The Estuary theme of [@iscor/design](https://design.iscor.me) as two Xcode themes, **Estuary Light** and **Estuary Dark**: the same off-white, ink and lime as the VS Code themes, in SF Mono.

Strings are the accent text colour, numbers the `ok` green, attributes and macros the `info` blue; everything else is ink, so the code reads in the system's own greys. Every text colour reads at 4.5:1 on the editor's background.

## Install it

From the repository's root:

```sh
mkdir -p ~/Library/Developer/Xcode/UserData/FontAndColorThemes
cp packages/xcode/*.xccolortheme ~/Library/Developer/Xcode/UserData/FontAndColorThemes/
```

Restart Xcode, then pick **Estuary Light** or **Estuary Dark** in **Settings → Themes**. Xcode has no automatic light/dark switch per theme: pick the one that matches your appearance.

The theme files are generated from the tokens (`npm run build`, from `theme.template.json`): change a colour in `tokens/`, the mapping in `theme.template.json`, not the `.xccolortheme` files.
