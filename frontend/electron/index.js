import { config } from 'dotenv';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { spawn } from 'child_process';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
config({ path: path.join(__dirname, '../../.env') });

// API 클라이언트 설정
const apiClient = axios.create({
  baseURL: process.env.SPRING_API_URL || 'http://localhost:4141/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// IPC 핸들러 설정
ipcMain.handle('get-sales-data', async () => {
  try {
    const response = await apiClient.get('/test/test-list');
    if (response.data && response.data.status === 'OK') {
      return response.data.data;
    } else {
      console.error('API 응답 오류:', response.data.message);
      return [];
    }
  } catch (err) {
    console.error('데이터 조회 오류:', err);
    return [];
  }
});

ipcMain.handle('insert-sales-data', async (event, salesData) => {
  try {
    const response = await apiClient.post('/test/insert-sales-data', salesData);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('테스트 데이터 삽입 오류:', err);
    return false;
  }
});

ipcMain.handle('bulk-delete-sales-data', async (event, ids) => {
  try {
    const response = await apiClient.post('/test/bulk-delete-sales-data', ids);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('다중 삭제 오류:', err);
    return false;
  }
});

ipcMain.handle('update-sales-data', async (event, salesData) => {
  try {
    const response = await apiClient.post('/test/update-sales-data', salesData);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('판매 데이터 업데이트 오류:', err);
    return false;
  }
});

// 아이콘 경로 수정
const iconPath = path.join(__dirname, '../src/assets/icons/app-icon.ico');

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'), // 같은 폴더에 있음
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  const template = [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.env.NODE_ENV === 'development') {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:4242';
    console.log('dev URL:', devUrl);
    win.loadURL(devUrl).then((r) => r);
    win.webContents.openDevTools();
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    win.loadFile(path.join(__dirname, '../dist/index.html')).then((r) => r);
  }

  win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          process.env.NODE_ENV === 'development'
            ? `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:* http://127.0.0.1:*; img-src 'self' data:; font-src 'self' data:`
            : `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src 'self' ${process.env.SPRING_API_URL || 'http://localhost:4141/api/v1'}; img-src 'self' data:; font-src 'self' data:`
        ]
      }
    });
  });
};

let backendProcess = null;

function startBackendServer() {
  let jarPath;

  if (app.isPackaged) {
    jarPath = path.join(
      process.resourcesPath,
      'backend',
      'GR-0.0.1-SNAPSHOT.jar'
    );
  } else {
    jarPath = path.join(
      __dirname,
      '../../backend/build/libs/GR-0.0.1-SNAPSHOT.jar'
    );
  }

  console.log('JAR Path:', jarPath);

  if (!fs.existsSync(jarPath)) {
    console.error('JAR file not found:', jarPath);
    return;
  }

  backendProcess = spawn('java', ['-jar', jarPath], {
    detached: false,
    stdio: 'pipe'
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

app.whenReady().then(async () => {
  startBackendServer();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 창 컨트롤 이벤트 처리
ipcMain.on('minimize-window', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('maximize-window', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});

ipcMain.on('close-window', () => {
  BrowserWindow.getFocusedWindow()?.close();
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});
