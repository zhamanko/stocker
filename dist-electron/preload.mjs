"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("api", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  products: {
    get: () => electron.ipcRenderer.invoke("products:get"),
    create: (p) => electron.ipcRenderer.invoke("products:create", p),
    update: (p) => electron.ipcRenderer.invoke("products:update", p),
    delete: (id) => electron.ipcRenderer.invoke("products:delete", id)
  }
  // You can expose other APTs you need here.
  // ...
});
