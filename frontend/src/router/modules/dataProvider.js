const dataProviderRoutes = [
  {
    path: '/data-provider',
    name: 'DataProvider',
    component: () =>
      import('../../modules/data-provider/views/DataProvider.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/data-provider/current',
    name: 'DataProviderCurrent',
    component: () => import('../../modules/dashboard/views/DashBoard.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/data-provider/usage',
    name: 'DataProviderUsage',
    component: () => import('../../modules/dashboard/views/DashBoard.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/data-provider/notice',
    name: 'DataProviderNotice',
    component: () => import('../../modules/dashboard/views/DashBoard.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/data-provider/materials',
    name: 'DataProviderMaterials',
    component: () => import('../../modules/dashboard/views/DashBoard.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/data-provider/dashboard',
    name: 'DataProviderDashboard',
    component: () =>
      import('../../modules/data-provider/views/DataProvider.vue'),
    meta: {
      requiresAuth: false
    }
  }
];

export default dataProviderRoutes;
