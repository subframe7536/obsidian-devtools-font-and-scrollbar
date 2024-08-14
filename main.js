'use strict';

const obsidian = require('obsidian');
const { getCurrentWindow } = require('electron').remote;
let win
class DevtoolsFontPlugin extends obsidian.Plugin {
  async onload() {
    const { monospaceFontFamily, interfaceFontFamily, textFontFamily } = this.app.vault.config
    win = getCurrentWindow()

    const mono = monospaceFontFamily || 'Maple Mono, Maple Mono NF CN, Menlo, Cascadia Code, consolas, monospace'
    const sans = interfaceFontFamily || textFontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Lucida Grande, Microsoft YaHei, Segoe UI, Arial, sans-serif'
    win.webContents.on('devtools-opened', () => {
      const css = `
:root {
  --scrollbar-width: max(0.85vw, 10px);
}

@media (prefers-color-scheme: light) {
  :root {
    --scrollbar-color-rgb: 0, 0, 0;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    --scrollbar-color-rgb: 255, 255, 255;
  }
}

*::-webkit-scrollbar {
  width: var(--scrollbar-width) !important;
  height: var(--scrollbar-width) !important;
}

*::-webkit-scrollbar-track {
  background-color: transparent !important;
  border-radius: var(--scrollbar-width) !important;
  box-shadow: none !important;
}

*::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 0 var(--scrollbar-width) !important;
  border-radius: var(--scrollbar-width) !important;
  border: calc(var(--scrollbar-width) * 2 / 9) solid transparent !important;
  background-clip: content-box;
  background-color: transparent !important;
  color: rgba(var(--scrollbar-color-rgb), 30%) !important;
}

*::-webkit-scrollbar-thumb:hover {
  color: rgba(var(--scrollbar-color-rgb), 45%) !important;
}

*::-webkit-scrollbar-thumb:active {
  color: rgba(var(--scrollbar-color-rgb), 60%) !important;
}

@supports not selector(::-webkit-scrollbar) {
  html {
    scrollbar-color: rgb(var(--scrollbar-color-rgb));
    scrollbar-width: thin;
  }
}
:root, body {
  --source-code-font-family: ${mono} !important;
  --source-code-font-size: 12px !important;
  --monospace-font-family: ${mono} !important;
  --monospace-font-size: 12px !important;
  --default-font-family: ${sans}, sans-serif !important;
  --default-font-size: 12px !important;
}
button,
input,
select,
.undisplayable-text,
.expandable-inline-button {
  font-family: ${sans} !important;
}`
      win.webContents.devToolsWebContents.executeJavaScript(`
const overriddenStyle = document.createElement('style');
overriddenStyle.innerHTML = '${css.replaceAll('\n', ' ')}';
document.body.append(overriddenStyle);
document.body.classList.remove('platform-windows', 'platform-mac', 'platform-linux');`)
    })
  }
}

module.exports = DevtoolsFontPlugin;
