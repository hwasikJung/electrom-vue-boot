const codeRoutes = [
  {
    path: '/code/list',
    name: 'Code',
    component: () => import('../../modules/code/views/CodeGrp.vue'),
    meta: {
      title: '코드 관리',
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
  {
    path: '/code/detail/:cdGrpId',
    name: 'CodeDetail',
    component: () => import('../../modules/code/views/CodeDtl.vue'),
    meta: {
      title: '코드 상세 관리',
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
  // 다른 code 관련 라우트들...
];

export default codeRoutes;
