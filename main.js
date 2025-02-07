'use strict';

const obsidian = require('obsidian');
const { getCurrentWindow } = require('electron').remote;
// https://github.com/subframe7536/electron-incremental-update/blob/d3b2b66eb9012e4019f25a224680c1dc397847da/src/utils/electron.ts#L161-L197
function beautifyDevTools(win, options) {
  const { mono, sans, scrollbar = true } = options;
  win.webContents.on("devtools-opened", async () => {
    let css = `:root{--sans:${sans};--mono:${mono}}:root,body{--source-code-font-family:var(--mono)!important;--source-code-font-size:12px!important;--monospace-font-family:var(--mono)!important;--monospace-font-size:12px!important;--default-font-family:var(--sans), sans-serif!important;--default-font-size:12px!important}button,input,select,.undisplayable-text,.expandable-inline-button{font-family:var(--sans)!important}`;
    if (scrollbar) {
      css += ":root{--scrollbar-width:max(.85vw,10px)}@media (prefers-color-scheme:light){:root{--scrollbar-color-rgb:0,0,0}}@media (prefers-color-scheme:dark){:root{--scrollbar-color-rgb:255,255,255}}*::-webkit-scrollbar{width:var(--scrollbar-width)!important;height:var(--scrollbar-width)!important}*::-webkit-scrollbar-track{background-color:transparent!important;border-radius:var(--scrollbar-width)!important;box-shadow:none!important}*::-webkit-scrollbar-thumb{box-shadow:inset 0 0 0 var(--scrollbar-width)!important;border-radius:var(--scrollbar-width)!important;border:calc(var(--scrollbar-width) * 2/9) solid transparent!important;background-clip:content-box;background-color:transparent!important;color:rgba(var(--scrollbar-color-rgb),30%)!important}*::-webkit-scrollbar-thumb:hover{color:rgba(var(--scrollbar-color-rgb),45%)!important}*::-webkit-scrollbar-thumb:active{color:rgba(var(--scrollbar-color-rgb),60%)!important}@supports not selector(::-webkit-scrollbar){html{scrollbar-color:rgb(var(--scrollbar-color-rgb));scrollbar-width:thin}}";
    }
    const js = `${'function run(n){let d=document.createElement("style");d.innerHTML=n,document.body.append(d),["platform-windows","platform-mac","platform-linux"].forEach(t=>document.querySelectorAll(`.${t}`).forEach(o=>o.classList.remove(t))),l();const r=new MutationObserver(t=>{for(const o of t)if(o.type==="childList")for(let e=0;e<o.addedNodes.length;e++)o.addedNodes[e].classList.contains("editor-tooltip-host")&&l()});r.observe(document.body,{childList:!0});function l(){document.querySelectorAll(".editor-tooltip-host").forEach(t=>{if(t?.shadowRoot?.querySelectorAll(\'[data-key="overridden-dev-tools-font"]\').length===0){const o=document.createElement("style");o.setAttribute("data-key","overridden-dev-tools-font"),o.innerHTML=`${n}.cm-tooltip-autocomplete ul[role=listbox]{font-family:var(--mono)!important;}`,t.shadowRoot.append(o)}})}document.onclose=()=>r.disconnect()}'};run(\`${css}\`)`;
    await win?.webContents.devToolsWebContents?.executeJavaScript(js);
  });
}
class DevtoolsFontPlugin extends obsidian.Plugin {
  async onload() {
    const { monospaceFontFamily, interfaceFontFamily, textFontFamily } = this.app.vault.config

    const mono = monospaceFontFamily || 'Maple Mono, Maple Mono NF CN, Menlo, Cascadia Code, consolas, monospace'
    const sans = interfaceFontFamily || textFontFamily || 'system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Lucida Grande, Microsoft YaHei, Segoe UI, Arial, sans-serif'
    beautifyDevTools(getCurrentWindow(), { mono, sans })
    console.log('DevtoolsFontPlugin Loaded')
  }
}

module.exports = DevtoolsFontPlugin;
