const roleRoutes = [
  {
    path: '/role/list',
    name: 'RoleIndex',
    component: () => import('../../modules/role/views/RoleList.vue'),
    meta: {
      title: '역할 관리',
      requiresAuth: true,
      requiredRoles: ['USER_ROLE_ADM'],
    },
  },
];
export default roleRoutes;
