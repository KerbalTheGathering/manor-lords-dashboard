import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { SettlementStore } from './settlement-store';

const store = new SettlementStore();
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1280,
    minHeight: 720,
    title: 'Manor Lords Dashboard',
    backgroundColor: '#3C2415',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    if (process.env.NODE_ENV !== 'production') {
      mainWindow.webContents.openDevTools();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers
ipcMain.handle('get-settlement', (_event, id: string) => {
  return store.getSettlement(id ?? 'default');
});

ipcMain.handle('update-settlement', (_event, id: string, data: any) => {
  store.setSettlement(id ?? 'default', data);
  return true;
});

ipcMain.handle('update-field', (_event, id: string, field: string, value: any) => {
  return store.updateField(id ?? 'default', field, value);
});

ipcMain.handle('get-resource-chains', (_event, id: string) => {
  const data = store.getSettlement(id ?? 'default');
  return data?.resourceChains ?? [];
});

ipcMain.handle('get-military-status', (_event, id: string) => {
  const data = store.getSettlement(id ?? 'default');
  return data?.military ?? null;
});

ipcMain.handle('get-historical-data', (_event, id: string) => {
  const data = store.getSettlement(id ?? 'default');
  return data?.history ?? [];
});

ipcMain.handle('chat-with-claude', async (_event, message: string, settlementId: string) => {
  const data = store.getSettlement(settlementId ?? 'default');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return 'Claude API key not configured. Set ANTHROPIC_API_KEY in your .env file to enable AI strategy advice.';
  }

  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });

    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are a medieval steward and strategic advisor for a Manor Lords settlement. You have access to real settlement data and provide advice in a period-appropriate tone—knowledgeable, respectful, and practical. Analyze the data provided and give actionable recommendations. Current settlement state:\n\n${JSON.stringify(data, null, 2)}`,
      messages: [{ role: 'user', content: message }],
    });

    const textBlock = response.content.find((b) => b.type === 'text');
    return textBlock?.text ?? 'The steward ponders but offers no counsel.';
  } catch (err: any) {
    return `The steward is unavailable: ${err.message}`;
  }
});

app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
