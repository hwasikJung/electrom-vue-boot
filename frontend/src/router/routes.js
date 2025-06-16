const routes = [
  {
    path: '/',
    name: 'mainPage',
    component: () => import('/src/modules/dashboard/views/DashBoard.vue')
  }
];

export default routes;
