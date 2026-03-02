import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getSettlement: (id: string) => ipcRenderer.invoke('get-settlement', id),
  updateSettlement: (id: string, data: any) => ipcRenderer.invoke('update-settlement', id, data),
  updateField: (id: string, field: string, value: any) => ipcRenderer.invoke('update-field', id, field, value),
  getResourceChains: (id: string) => ipcRenderer.invoke('get-resource-chains', id),
  getMilitaryStatus: (id: string) => ipcRenderer.invoke('get-military-status', id),
  getHistoricalData: (id: string) => ipcRenderer.invoke('get-historical-data', id),
  chatWithClaude: (message: string, settlementId: string) => ipcRenderer.invoke('chat-with-claude', message, settlementId),
});
