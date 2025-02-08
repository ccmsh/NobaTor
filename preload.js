const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld("electronAPI", {
    showPrompt: (options) => ipcRenderer.invoke("show-prompt", options),
    sendMessage: (message) => ipcRenderer.invoke("send-discord-message", message)
});
