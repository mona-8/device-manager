const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getDevices: () => ipcRenderer.invoke('get-devices'),
  saveDevice: (device) => ipcRenderer.invoke('save-device', device)
});
