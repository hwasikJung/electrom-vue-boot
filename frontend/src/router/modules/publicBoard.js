const boardRoutes = [
  {
    path: '/:menuId/public-board/create',
    name: 'PublicBoardCreate',
    component: () => import('../../modules/board/views/public/PublicBoardCreate.vue'),
    meta: {
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
  {
    path: '/:menuId/public-board/modify/:id',
    name: 'PublicBoardUpdate',
    component: () => import('../../modules/board/views/public/PublicBoardUpdate.vue'),
    meta: {
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
  {
    path: '/:menuId/public-board/:id',
    name: 'PublicBoardDetail',
    component: () => import('../../modules/board/views/public/PublicBoardDetail.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/:menuId/public-board',
    name: 'PublicBoardList',
    component: () => import('../../modules/board/views/public/PublicBoardList.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/faq/public-board',
    name: 'FaqList',
    component: () => import('../../modules/board/views/faq/FaqList.vue'),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: '/faq/public-board/create',
    name: 'FaqCreate',
    component: () => import('../../modules/board/views/faq/FaqCreate.vue'),
    meta: {
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
  {
    path: '/faq/public-board/modify/:id',
    name: 'FaqUpdate',
    component: () => import('../../modules/board/views/faq/FaqUpdate.vue'),
    meta: {
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
];

export default boardRoutes;
