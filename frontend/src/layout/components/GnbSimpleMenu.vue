<template>
  <div class="gnb-menu-item" :class="{ 'mobile-menu-item': isMobile }">
    <div class="menu-block" :class="{ 'mobile-block': isMobile, active: isActive }">
      <q-btn
        class="gnb-button"
        :class="{ 'mobile-gnb-button': isMobile, active: isActive }"
        flat
        no-caps
        no-ripple
        :label="menuLabel"
        @click="handleClick"
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isMobile: {
    type: Boolean,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: true,
  },
  menuKey: {
    type: String,
    required: true,
  },
  menuLabel: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['click']);

const handleClick = (event) => {
  // 클릭 후 포커스 제거
  if (event.target) {
    event.target.blur();
  }
  emit('click', props.menuKey, event);
};
</script>

<style lang="scss" scoped>
// 메뉴 아이템 스타일
.gnb-menu-item {
  display: flex;
  align-items: center;

  &.mobile-menu-item {
    width: 100%;
    align-items: stretch;
  }
}

// 메뉴 블록 스타일
.menu-block {
  position: relative;
  width: 100%;

  &.mobile-block {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    &:last-child {
      border-bottom: none;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

// 일반 버튼 스타일
.gnb-button {
  color: white;
  min-height: 51px;
  min-width: 210px;
  padding: 8px 24px;
  font-weight: normal;
  font-size: 1rem;

  &.mobile-gnb-button {
    min-width: auto;
    width: 100%;
    min-height: 60px;
    padding: 16px 20px;
    justify-content: center;
  }

  &.active {
    font-weight: bold;

    :deep(.q-btn__content) {
      font-weight: bold;
    }
  }

  :deep(.q-btn__content) {
    color: white;
    font-weight: normal;
    font-size: 1rem;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &:focus,
  &:focus-visible,
  &:active {
    outline: none;
    background-color: transparent !important;
    box-shadow: none !important;
  }

  // 모바일에서 클릭 효과 완전 제거
  &.mobile-gnb-button {
    &:focus,
    &:focus-visible,
    &:active,
    &:hover {
      background-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  }

  // Quasar 버튼의 기본 클릭 효과 제거
  :deep(.q-btn) {
    &:focus,
    &:focus-visible,
    &:active {
      background-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  }

  :deep(.q-btn__wrapper) {
    &:focus,
    &:focus-visible,
    &:active {
      background-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  }
}

// 모바일 반응형
@media (max-width: var(--layout-width-sm)) {
  .gnb-menu-item {
    width: 100%;
    align-items: stretch;
  }

  .menu-block {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    &:last-child {
      border-bottom: none;
    }

    &.active {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }

  .gnb-button {
    min-width: auto;
    width: 100%;
    min-height: 60px;
    padding: 16px 20px;
    justify-content: center;
  }
}

@media (max-width: var(--layout-width-mobile-small)) {
  .gnb-button {
    padding: 14px 16px;
    min-height: 56px;
    font-size: 0.9rem;
  }
}
</style>
