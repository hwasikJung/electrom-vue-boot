<template>
  <div class="gnb-menu-item dropdown-wrapper" :class="{ 'mobile-menu-item': isMobile }">
    <div
      class="menu-block"
      :class="{ 'mobile-block': isMobile, active: isActive || (isMobile && isOpen) }"
    >
      <button
        class="gnb-dropdown-button"
        :class="{ 'mobile-dropdown-button': isMobile, active: isActive }"
        @click="handleClick"
      >
        <span>{{ menuLabel }}</span>
        <q-icon
          v-if="isMobile"
          :name="isOpen ? 'expand_less' : 'expand_more'"
          size="20px"
          color="white"
          class="mobile-arrow"
        />
      </button>
      <div
        class="dropdown-menu"
        :class="{ 'mobile-dropdown': isMobile, 'mobile-open': isMobile && isOpen }"
      >
        <div
          v-for="item in dropdownItems"
          :key="item.path"
          class="dropdown-item"
          @click="handleDropdownItemClick(item)"
        >
          <span>{{ item.label }}</span>
          <q-icon name="chevron_right" size="16px" color="grey-6" />
        </div>
      </div>
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
  isOpen: {
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
  dropdownItems: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

const emit = defineEmits(['click', 'close-mobile-menu']);

const handleClick = (event) => {
  // 클릭 후 포커스 제거
  if (event.target) {
    event.target.blur();
  }
  emit('click', props.menuKey, event);
};

const handleDropdownItemClick = (item) => {
  if (props.isMobile) {
    emit('close-mobile-menu');
  }

  router.push(item.path);
};
</script>

<style lang="scss" scoped>
.gnb-menu-item {
  display: flex;
  align-items: center;

  &.mobile-menu-item {
    width: 100%;
    align-items: stretch;
  }
}

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

.dropdown-wrapper {
  position: relative;

  &:hover .dropdown-menu {
    display: block;
  }
}

.gnb-dropdown-button {
  background: none;
  border: none;
  outline: none;
  cursor: pointer;
  color: white;
  min-height: 51px;
  min-width: 210px;
  padding: 8px 24px;
  font-weight: normal;
  font-size: 1rem;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;

  &.mobile-dropdown-button {
    min-width: auto;
    width: 100%;
    padding: 16px 20px;
    min-height: 60px;
    justify-content: center;

    span {
      flex: 1;
      text-align: center;
    }

    .mobile-arrow {
      position: absolute;
      right: 20px;
    }
  }

  &:not(.mobile-dropdown-button) {
    justify-content: center;

    span {
      text-align: center;
    }
  }

  &.active {
    font-weight: bold;
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

  &.mobile-dropdown-button {
    &:focus,
    &:focus-visible,
    &:active,
    &:hover {
      background-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
  }
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid $standard;
  border-top: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  &.mobile-dropdown {
    position: static !important;
    display: block !important;
    border: none !important;
    box-shadow: none !important;
    background: rgba(255, 255, 255, 0.95) !important;
    border-top: 1px solid rgba(255, 255, 255, 0.3) !important;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition:
      max-height 0.3s ease-in-out,
      opacity 0.3s ease-in-out;

    &.mobile-open {
      max-height: 300px;
      opacity: 1;
    }
  }
}

.dropdown-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease,
    opacity 0.2s ease;
  position: relative;
  min-height: 60px;
  transform: translateY(0);
  opacity: 1;

  .mobile-dropdown & {
    transform: translateY(-10px);
    opacity: 0;
  }

  .mobile-dropdown.mobile-open & {
    transform: translateY(0);
    opacity: 1;

    &:nth-child(1) {
      transition-delay: 0.1s;
    }
    &:nth-child(2) {
      transition-delay: 0.15s;
    }
    &:nth-child(3) {
      transition-delay: 0.2s;
    }
    &:nth-child(4) {
      transition-delay: 0.25s;
    }
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 20px;
    right: 20px;
    height: 1px;
    border-bottom: 1px dashed #999999;
  }

  &:hover {
    background-color: #f5f5f5;

    span {
      color: $standard;
    }
  }

  span {
    font-size: 1rem;
    font-weight: 500;
    color: #999999;
    flex: 1;
    transition: color 0.2s ease;
  }

  .q-icon {
    margin-left: 12px;
    flex: none;
  }
}

@media (min-width: calc(var(--layout-width-sm))) {
  .dropdown-wrapper:hover .dropdown-menu {
    display: block;
  }
}

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

  .gnb-dropdown-button {
    min-width: auto;
    width: 100%;
    padding: 16px 20px;
    min-height: 60px;
    justify-content: center;

    span {
      flex: 1;
      text-align: center;
    }

    .mobile-arrow {
      position: absolute;
      right: 20px;
    }
  }

  .dropdown-wrapper:hover .dropdown-menu {
    display: none;
  }

  .dropdown-menu.mobile-dropdown.mobile-open {
    display: block !important;
    max-height: 300px;
    opacity: 1;
  }
}

@media (max-width: var(--layout-width-mobile-small)) {
  .gnb-dropdown-button {
    padding: 14px 16px;
    min-height: 56px;
    font-size: 0.9rem;

    .mobile-arrow {
      right: 16px;
    }
  }

  .dropdown-item {
    padding: 10px 16px;
    min-height: 50px;

    &:not(:last-child)::after {
      left: 16px;
      right: 16px;
    }

    span {
      font-size: 0.9rem;
    }
  }
}
</style>
