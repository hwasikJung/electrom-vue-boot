const userRoutes = [
  {
    path: '/user/register',
    name: 'Register',
    component: () => import('../../modules/user/views/Register.vue'),
  },
  {
    path: '/user/idInquiry',
    name: 'FindMyId',
    component: () => import('../../modules/user/views/RecoverUsername.vue'),
  },
  {
    path: '/user/pwInquiry',
    name: 'PasswordReset',
    component: () => import('../../modules/user/views/PasswordReset.vue'),
  },
  {
    path: '/user/login',
    name: 'Login',
    component: () => import('../../modules/user/views/Login.vue'),
  },
  {
    path: '/user/terms-agreement',
    name: 'TermsAgreement',
    component: () => import('../../modules/user/views/TermsAgreementView.vue'),
  },
];

export default userRoutes;
