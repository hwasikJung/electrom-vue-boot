const dashboardRoutes = [
  {
    path: '/dashboard/data-link',
    name: 'DashboardDataLink',
    component: () => import('@/modules/dashboard/views/DashboardDataLink.vue')
  },
  {
    path: '/dashboard/use-info',
    name: 'DashboardUseInfo',
    component: () => import('@/modules/dashboard/views/DashboardUseInfo.vue')
  },
  {
    path: '/dashboard/notice',
    name: 'DashboardNotice',
    component: () => import('@/modules/dashboard/views/DashboardNotice.vue')
  },
  {
    path: '/dashboard/policy',
    name: 'DashboardPolicy',
    component: () => import('@/modules/dashboard/views/DashboardPolicy.vue')
  }
];

export default dashboardRoutes;
