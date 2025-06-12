// index.js - 프론트엔드 초기화 설정
import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';

// FontAwesome 설정 (사용 중인 경우)
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUsers, faChartLine } from '@fortawesome/free-solid-svg-icons';

library.add(faUsers, faChartLine);

const app = createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon);
app.mount('#app');
