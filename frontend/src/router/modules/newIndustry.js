const newIndustryRoutes = [
  {
    path: '/new-industry',
    name: 'NewIndustry',
    component: () => import('../../modules/new-industry/views/NewIndustry.vue'),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/new-industry/dashboard',
    name: 'NewIndustryDashboard',
    component: () => import('../../modules/new-industry/views/NewIndustry.vue'),
    meta: {
      requiresAuth: false
    }
  }
];

export default newIndustryRoutes; 