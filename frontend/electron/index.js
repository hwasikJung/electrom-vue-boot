import { config } from 'dotenv';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// .env 파일 로드
config({ path: path.join(__dirname, '../.env') });

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

// 테스트 데이터 삽입 기능은 이제 Spring Boot 백엔드에서 처리해야 합니다.
// 필요한 경우 Spring Boot API 호출로 변경
ipcMain.handle('insert-sales-data', async (event, salesData) => {
  try {
    // Spring Boot API를 호출하여 테스트 데이터 삽입 요청
    const response = await apiClient.post('/test/insert-sales-data', salesData);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('테스트 데이터 삽입 오류:', err);
    return false;
  }
});

ipcMain.handle('bulk-delete-sales-data', async (event, ids) => {
  try {
    // Spring Boot API를 호출하여 다중 삭제 요청
    const response = await apiClient.post('/test/bulk-delete-sales-data', ids);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('다중 삭제 오류:', err);
    return false;
  }
});

ipcMain.handle('update-sales-data', async (event, salesData) => {
  try {
    // Spring Boot API를 호출하여 판매 데이터 업데이트 요청
    const response = await apiClient.post('/test/update-sales-data', salesData);
    return response.data && response.data.status === 'OK';
  } catch (err) {
    console.error('판매 데이터 업데이트 오류:', err);
    return false;
  }
});

// 상대 경로를 절대 경로로 변경
const iconPath = path.join(__dirname, '../src/assets/icons/app-icon.ico');

// 창 상태 유지 (선택사항)
const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    // frame: false, // 기본 창 프레임 제거
    // titleBarStyle: 'hidden', // 타이틀바 숨기기
    icon: iconPath,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });
  const template = [];
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // 개발 모드에서는 로컬 개발 서버에서 로드
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

app.whenReady().then(async () => {
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
