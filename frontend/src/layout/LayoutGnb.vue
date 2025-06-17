<template>
  <div class="gnb-container">
    <nav class="gnb-nav" :class="{ 'mobile-layout': isMobile }">
      <div class="gnb-menu-wrapper" :class="{ 'mobile-wrapper': isMobile }">
        <!-- 대시보드 메뉴 -->
        <GnbDropdownMenu
          :is-mobile="isMobile"
          :is-active="isActiveMenu('dashboard')"
          :is-open="openMobileMenu === 'dashboard'"
          menu-key="dashboard"
          menu-label="대시보드"
          :dropdown-items="dashboardItems"
          @click="handleMenuClick"
          @close-mobile-menu="closeMobileMenu"
        />

        <div class="gnb-divider" :class="{ 'mobile-divider': isMobile }"></div>

        <!-- 데이터제공자 메뉴 -->
        <GnbSimpleMenu
          :is-mobile="isMobile"
          :is-active="isActiveMenu('data-provider')"
          menu-key="data-provider"
          menu-label="데이터제공자 (건물)"
          @click="handleMenuClick"
        />

        <div class="gnb-divider" :class="{ 'mobile-divider': isMobile }"></div>

        <!-- 신산업 사업자 메뉴 -->
        <GnbSimpleMenu
          :is-mobile="isMobile"
          :is-active="isActiveMenu('new-industry')"
          menu-key="new-industry"
          menu-label="신산업 사업자"
          @click="handleMenuClick"
        />
      </div>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import GnbDropdownMenu from './components/GnbDropdownMenu.vue';
import GnbSimpleMenu from './components/GnbSimpleMenu.vue';

const router = useRouter();
const route = useRoute();

defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true
  },
  userRoles: {
    type: Array,
    required: true
  }
});

const isMobile = ref(false);
const openMobileMenu = ref(null);

const dashboardItems = [
  { path: '/dashboard/data-link', label: '데이터연계 현황' },
  { path: '/dashboard/use-info', label: '이용안내' },
  { path: '/dashboard/notice', label: '공지사항' },
  { path: '/dashboard/policy', label: '정책 자료실' }
];

const menuConfig = {
  dashboard: {
    type: 'dropdown',
    hasSubMenu: true
  },
  'data-provider': {
    type: 'simple',
    redirectPath: '/data-provider'
  },
  'new-industry': {
    type: 'simple',
    redirectPath: '/new-industry'
  }
};

const currentPath = computed(() => route.fullPath);

const checkScreenSize = () => {
  const mobileBreakpoint = 768;
  const newIsMobile = window.innerWidth <= mobileBreakpoint;

  // 모바일 상태가 변경되었을 때만 업데이트
  if (isMobile.value !== newIsMobile) {
    isMobile.value = newIsMobile;

    // 데스크톱으로 변경될 때 모바일 메뉴 닫기
    if (!newIsMobile) {
      openMobileMenu.value = null;
    }
  }
};

const toggleMobileMenu = (menuKey) => {
  openMobileMenu.value = openMobileMenu.value === menuKey ? null : menuKey;
};

const closeMobileMenu = () => {
  openMobileMenu.value = null;
};

const removeFocus = (event) => {
  if (event?.target) {
    event.target.blur();
  }
  // 현재 포커스된 요소가 있다면 포커스 제거
  if (document.activeElement && document.activeElement.blur) {
    document.activeElement.blur();
  }
};

const isActiveMenu = (menuType) => {
  // 모바일 환경에서는 활성 메뉴 포커스 효과 제거
  if (isMobile.value) {
    return false;
  }

  switch (menuType) {
    case 'dashboard':
      return (
        currentPath.value === '/dashboard' ||
        currentPath.value.startsWith('/dashboard/')
      );
    case 'data-provider':
      return currentPath.value.includes('data-provider');
    case 'new-industry':
      return currentPath.value.includes('new-industry');
    default:
      return false;
  }
};

const goToLogin = (targetPath) => {
  if (isMobile.value) {
    openMobileMenu.value = null;
  }

  router.push({
    path: '/user/login',
    query: { redirect: targetPath }
  });
};

const handleMenuClick = (menuKey, event) => {
  removeFocus(event);

  const config = menuConfig[menuKey];

  if (config.type === 'dropdown' && isMobile.value) {
    toggleMobileMenu(menuKey);
  } else if (config.type === 'simple') {
    goToLogin(config.redirectPath);
  }
};

// 디바운싱을 위한 타이머
let resizeTimer = null;

const debouncedCheckScreenSize = () => {
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
  resizeTimer = setTimeout(checkScreenSize, 100);
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', debouncedCheckScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', debouncedCheckScreenSize);
  if (resizeTimer) {
    clearTimeout(resizeTimer);
  }
});
</script>

<style lang="scss" scoped>
.gnb-container {
  background: $standard;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.gnb-nav {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 51px;

  &.mobile-layout {
    padding: 0;
    min-height: auto;
    align-items: stretch;
  }
}

.gnb-menu-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;

  &.mobile-wrapper {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }
}

.gnb-divider {
  width: 1px;
  height: 27px;
  background-color: #c6c6c6;
  margin: 0;

  &.mobile-divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0;
  }
}

@media (max-width: var(--layout-width-sm)) {
  .gnb-nav {
    padding: 0;
    min-height: auto;
    align-items: stretch;
  }

  .gnb-menu-wrapper {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }

  .gnb-divider {
    width: 100%;
    height: 1px;
    background-color: rgba(255, 255, 255, 0.2);
    margin: 0;
  }
}
</style>
