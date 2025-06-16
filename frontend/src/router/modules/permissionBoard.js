// src/router/modules/permissionBoard.js

import { usePermissionStore } from '@/shared/store/permissionStore.js';
import { useCommonStore } from '@/shared/store/commonStore.js';
import { useDialog } from '@/shared/composables/useDialog.js';

// 권한 체크 가드 함수
const permissionCheck = async (to, from, next) => {
  const permissionStore = usePermissionStore();
  const commonStore = useCommonStore();
  const dialog = useDialog();

  console.log(`권한 검사 시작 - 메뉴 ID: ${to.params.menuId}`);

  // 토큰 존재 여부 확인
  if (!commonStore.isTokenPresent()) {
    console.log('토큰이 존재하지 않음');
    next({
      path: '/auth/login',
      query: { redirect: to.fullPath },
    });
    return;
  }

  // 관리자 여부 확인
  const role = commonStore.getUserRole();
  if (role === 'USER_ROLE_ADM') {
    console.log('관리자 권한으로 접근 허용');
    next();
    return;
  }

  // 권한 정보가 로드되지 않은 경우 로드
  if (!permissionStore.isLoaded) {
    try {
      const { success } = await permissionStore.fetchAllPermissions();
      if (!success) {
        console.error('권한 정보 로드 실패');
        dialog
          .alert({
            message: '권한 정보를 확인하는 중 오류가 발생했습니다.',
            title: '오류',
            color: 'negative',
          })
          .onOk(() => {
            next({ path: '/' });
          });
        return;
      }
    } catch (error) {
      console.error('권한 로드 중 오류:', error);
      dialog
        .alert({
          message: '권한 정보를 확인하는 중 오류가 발생했습니다.',
          title: '오류',
          color: 'negative',
        })
        .onOk(() => {
          next({ path: '/' });
        });
      return;
    }
  }

  // 필요한 권한 확인
  const requiredPermission = to.meta.requiredPermission;

  console.log('메뉴 ID:', to.params.menuId);
  console.log('필요 권한:', requiredPermission);
  console.log('권한 정보:', permissionStore.getPermissionsByMenuId(to.params.menuId));

  if (permissionStore.checkMenuPermission(to.params.menuId, requiredPermission)) {
    console.log(`권한 확인 성공: ${requiredPermission}`);
    next();
  } else {
    console.log(`권한 부족: ${requiredPermission}`);
    dialog
      .alert({
        message: '접근 권한이 없습니다.',
        title: '권한 오류',
        color: 'negative',
      })
      .onOk(() => {
        next({ path: '/' });
      });
  }
};

const permissionBoardRoutes = [
  {
    path: '/:menuId/permission-board',
    name: 'PermissionBoardList',
    component: () => import('../../modules/board/views/permission/PermissionBoardList.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'R', // 읽기 권한
    },
    beforeEnter: permissionCheck,
  },
  {
    path: '/:menuId/permission-board/:id',
    name: 'PermissionBoardDetail',
    component: () => import('../../modules/board/views/permission/PermissionBoardDetail.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'R', // 읽기 권한
    },
    beforeEnter: permissionCheck,
  },
  {
    path: '/:menuId/permission-board/create',
    name: 'PermissionBoardCreate',
    component: () => import('../../modules/board/views/permission/PermissionBoardCreate.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'C', // 생성 권한
    },
    beforeEnter: permissionCheck,
  },
  {
    path: '/:menuId/permission-board/modify/:id',
    name: 'PermissionBoardUpdate',
    component: () => import('../../modules/board/views/permission/PermissionBoardUpdate.vue'),
    meta: {
      requiresAuth: true,
      requiredPermission: 'U', // 수정 권한
    },
    beforeEnter: permissionCheck,
  },
];

export default permissionBoardRoutes;
