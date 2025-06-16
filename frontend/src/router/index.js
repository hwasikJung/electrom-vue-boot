import { createRouter, createWebHistory } from 'vue-router';

import routes from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
});

// 네비게이션 가드 설정
/*router.beforeEach((to, from, next) => {
  const commonStore = useCommonStore();

  // store에서 토큰 가져오기
  const token = commonStore.getAccessToken();

  // 인증이 필요한 페이지 체크 (meta.requiresAuth가 true인 경우)
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  if (requiresAuth) {
    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      next({
        path: '/user/login',
        query: { redirect: to.fullPath }, // 로그인 후 원래 가려던 페이지로 이동하기 위해 저장
      });
    } else {
      try {
        // 역할 추출
        const { roles } = getTokenPayload(token);

        // 토큰 유효성 검증 및 사용자 권한 가져오기
        const userRole = roles[0]; // 또는 API 호출로 권한 확인

        // 특정 권한이 필요한 페이지 체크
        const hasPermissionCheck = to.matched.some(
          (record) => record.meta.requiredPermission && record.beforeEnter
        );

        if (hasPermissionCheck) {
          next();
          return;
        }

        if (to.meta.requiresAuth && !to.meta.requiredRoles.includes(userRole)) {
          Dialog.create({
            message: '해당 페이지에 대한 접근 권한이 없습니다.',
            persistent: true,
            ok: {
              label: '확인',
              color: 'primary',
              flat: true,
            },
          }).onOk(() => {
            // Dialog 확인 버튼 클릭 후 이전 페이지로 이동
            // 토큰이 유효하지 않은 경우
            commonStore.clearTokens();
            next('/');
          });
        } else {
          next();
        }
      } catch (error) {
        // 토큰이 유효하지 않은 경우
        commonStore.clearTokens();
        next({
          path: '/user/login',
          query: { redirect: to.fullPath },
        });
      }
    }
  } else {
    // 인증이 필요없는 페이지는 그대로 진행
    next();
  }
});*/

export default router;
