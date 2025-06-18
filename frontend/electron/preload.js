const { contextBridge, ipcRenderer } = require('electron');

// 안전한 API 노출
contextBridge.exposeInMainWorld('electronAPI', {
  getSalesData: () => ipcRenderer.invoke('get-sales-data'),
  insertSalesData: (salesData) =>
    ipcRenderer.invoke('insert-sales-data', salesData),
  updateSalesData: (salesData) =>
    ipcRenderer.invoke('update-sales-data', salesData),
  deleteSales: (id) => ipcRenderer.invoke('delete-sales-data', id),
  bulkDeleteSales: (ids) => ipcRenderer.invoke('bulk-delete-sales-data', ids),
  minimize: () => ipcRenderer.send('minimize-window'),
  maximize: () => ipcRenderer.send('maximize-window'),
  close: () => ipcRenderer.send('close-window')
});
