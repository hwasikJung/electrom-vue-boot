<template>
  <header class="layout-header">
    <div class="layout-header">
      <div class="header-container">
        <img
          class="logo-image"
          src="/src/assets/images/logo/logo.png"
          @click="handleTitleClick"
          alt="logo" />

        <div class="header-right">
          <q-tabs align="left">
            <q-route-tab label="로그인" />
            <q-route-tab label="회원가입" />
            <q-route-tab label="로그아웃" />
          </q-tabs>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleTitleClick = () => {
  router.push('/');
};
</script>

<style lang="scss" scoped>
.layout-header {
  background-color: white;
  color: black;
}

.header-container {
  display: flex;
  align-items: center;
  min-height: 86px;
  padding: 0 16px;
  max-width: var(--container-max-width);
  margin: 0 auto;
  width: 100%;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
}

.logo-image {
  cursor: pointer;
  user-select: none;
}

.header-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.header-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

.green-button-text {
  font-size: 1rem;
  font-weight: bold;
  color: #248000;
  margin-bottom: 3px;
}

.marketplace-text {
  font-size: 24px;
  font-weight: 800;
  color: black;
}
</style>
