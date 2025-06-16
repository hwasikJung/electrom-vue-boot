import { createApp } from 'vue';
import { Quasar } from 'quasar';

// Quasar CSS 파일들 import
import 'quasar/src/css/index.sass';

// 아이콘 라이브러리 import (Material Icons)
import '@quasar/extras/material-icons/material-icons.css';

// 앱 컴포넌트
import App from './App.vue';

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: {} // 필요한 플러그인들 (Notify, Dialog 등)
});

myApp.mount('#app');
