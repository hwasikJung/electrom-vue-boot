import dashboardRoutes from '@/router/modules/dashboard.js';

const routes = [
  {
    path: '/',
    name: 'mainPage',
    component: () => import('@/modules/main/mainView.vue')
  },

  ...dashboardRoutes
];

export default routes;
