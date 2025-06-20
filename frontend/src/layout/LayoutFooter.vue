<template>
  <div class="layout-footer">
    <div class="footer-content">
      <div class="footer-logo">
        <img :src="logoImage" alt="한국에너지공단" />
      </div>
      <div class="footer-info">
        <p>
          52852 경상남도 진주시 에나로 128번길 24(충무공동 289-3),
          국토안전관리원 그린리모델링 창조센터 6층
        </p>
        <p>©Green Remodeling Center. All Rights Reserved.</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { useImages } from '@/shared/composables/useImages.js';

const { commonImages } = useImages();

const logoImage = commonImages.value.logo;
</script>
<style lang="scss" scoped>
.layout-footer {
  width: 100%;
  min-height: 84px;
  padding: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-top: 1px solid #eeeeee;
  background-color: white;
  /* margin-top: auto; 제거 - q-footer에서 자동으로 처리 */
}

.footer-content {
  max-width: var(--container-max-width, 1200px);
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.footer-logo {
  flex-shrink: 0;

  img {
    height: 40px;
    width: auto;
    min-width: 120px;
  }
}

.footer-info {
  p {
    margin: 0;
    color: #444444;
    font-size: 12px;
    font-family: 'Noto Sans KR', 'Malgun Gothic', '맑은 고딕', sans-serif;
    font-weight: 400;
    line-height: 1.4;

    &:first-child {
      margin-bottom: 4px;
    }
  }
}
</style>

<script setup lang="ts"></script>
