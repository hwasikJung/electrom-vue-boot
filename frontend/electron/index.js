import { config } from 'dotenv';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import { exec, spawn } from 'child_process';
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

let mainWindow = null;
let backendProcess = null;
let backendPid = null;

// 포트로 실행 중인 프로세스 종료
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const command =
      process.platform === 'win32'
        ? `netstat -ano | findstr :${port}`
        : `lsof -ti:${port}`;

    exec(command, (error, stdout) => {
      if (error) {
        console.log(`포트 ${port}에서 실행 중인 프로세스가 없습니다.`);
        resolve();
        return;
      }

      if (process.platform === 'win32') {
        const lines = stdout.split('\n');
        const pids = new Set();

        lines.forEach((line) => {
          const match = line.trim().match(/\s+(\d+)$/);
          if (match) {
            pids.add(match[1]);
          }
        });

        if (pids.size > 0) {
          pids.forEach((pid) => {
            exec(`taskkill /F /PID ${pid}`, (killError) => {
              if (killError) {
                console.error(`PID ${pid} 종료 실패:`, killError);
              } else {
                console.log(`PID ${pid} 종료 완료`);
              }
            });
          });
        }
      } else {
        const pids = stdout.trim().split('\n');
        pids.forEach((pid) => {
          if (pid) {
            exec(`kill -9 ${pid}`, (killError) => {
              if (killError) {
                console.error(`PID ${pid} 종료 실패:`, killError);
              } else {
                console.log(`PID ${pid} 종료 완료`);
              }
            });
          }
        });
      }

      setTimeout(resolve, 1000); // 1초 대기 후 완료
    });
  });
}

const createWindow = () => {
  // 이미 창이 있으면 생성하지 않음
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
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

  if (process.env.NODE_ENV === 'development') {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:4242';
    console.log('dev URL:', devUrl);
    mainWindow.loadURL(devUrl).then((r) => r);
    mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션 모드에서는 빌드된 파일 로드
    mainWindow
      .loadFile(path.join(__dirname, '../dist/index.html'))
      .then((r) => r);
  }

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    (details, callback) => {
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
    }
  );

  // 창 닫기 이벤트 처리
  mainWindow.on('close', async (event) => {
    console.log('Electron 창을 닫는 중...');
    event.preventDefault(); // 기본 닫기 동작 방지

    try {
      // 백엔드 프로세스 종료
      if (backendProcess) {
        console.log('백엔드 프로세스 종료 중...');
        backendProcess.kill('SIGTERM');
        backendProcess = null;
      }

      // 포트 4141에서 실행 중인 모든 프로세스 종료
      await killProcessOnPort(4141);

      console.log('모든 프로세스 종료 완료');

      // 실제 창 닫기
      mainWindow.destroy();
    } catch (error) {
      console.error('프로세스 종료 중 오류:', error);
      mainWindow.destroy(); // 오류가 있어도 창은 닫기
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

function startBackendServer() {
  // 개발 환경에서는 백엔드를 시작하지 않음 (concurrently에서 관리)
  if (process.env.NODE_ENV === 'development') {
    console.log('개발 환경: 백엔드는 concurrently에서 관리됩니다.');
    return;
  }

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

  backendPid = backendProcess.pid;
  console.log(`백엔드 프로세스 시작됨 (PID: ${backendPid})`);

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend Error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
    backendProcess = null;
    backendPid = null;
  });
}

// 단일 인스턴스 보장
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    // 두 번째 인스턴스 실행 시 기존 창을 포커스
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(async () => {
    startBackendServer();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on('window-all-closed', async () => {
  // 모든 창이 닫힐 때 백엔드도 종료
  console.log('모든 창이 닫혔습니다. 백엔드 서버를 종료합니다.');

  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    backendProcess = null;
  }

  await killProcessOnPort(4141);

  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// 창 컨트롤 이벤트 처리
ipcMain.on('minimize-window', () => {
  mainWindow?.minimize();
});

ipcMain.on('maximize-window', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});

ipcMain.on('close-window', () => {
  mainWindow?.close(); // 이제 close 이벤트에서 백엔드도 종료됨
});

// 앱 종료 전 정리
app.on('before-quit', async () => {
  console.log('앱 종료 전 정리 작업 시작...');

  if (backendProcess) {
    console.log('백엔드 프로세스 강제 종료...');
    backendProcess.kill('SIGKILL');
    backendProcess = null;
  }

  // 포트 4141 정리
  await killProcessOnPort(4141);

  console.log('정리 작업 완료');
});

// 앱 종료 시 정리
app.on('will-quit', async (event) => {
  event.preventDefault();

  console.log('앱 종료 중... 백엔드 서버 정리');

  if (backendProcess) {
    backendProcess.kill('SIGKILL');
  }

  await killProcessOnPort(4141);

  // 실제 종료
  app.exit(0);
});
