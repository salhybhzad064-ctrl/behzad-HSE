// Preload - can expose safe APIs if needed
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // add APIs if needed
});
