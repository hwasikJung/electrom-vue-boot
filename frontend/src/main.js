import { createApp } from 'vue';
import { Quasar } from 'quasar';
import router from './router/index.js';

// 기본 Quasar CSS
import 'quasar/dist/quasar.css';

// 앱
import App from './App.vue';

const myApp = createApp(App);

myApp.use(Quasar);
myApp.use(router);

myApp.mount('#app');
