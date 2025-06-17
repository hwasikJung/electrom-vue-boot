<template>
  <div class="chart-widget">
    <div class="chart-container">
      <div v-if="loading" class="loading">{{ loadingText }}</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button v-if="showRetryButton" @click="handleRetry" class="retry-btn">
          다시 시도
        </button>
      </div>
      <v-chart
        v-else
        class="chart"
        :option="chartOption"
        :autoresize="autoresize"
        @click="handleChartClick"
      />
    </div>
    <!--    <div v-if="showControls" class="controls">
          <slot name="controls">
            <button
              v-if="showRefreshButton"
              @click="$emit('refresh')"
              class="refresh-btn"
            >
              {{ refreshButtonText }}
            </button>
          </slot>
        </div>-->
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TreemapChart
} from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// ECharts 컴포넌트 등록 (Treemap 추가)
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  TreemapChart, // Treemap 차트 추가
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent
]);

// Props 정의
const props = defineProps({
  // 차트 옵션
  option: {
    type: Object,
    required: true
  },
  // 로딩 상태
  loading: {
    type: Boolean,
    default: false
  },
  // 에러 메시지
  error: {
    type: String,
    default: null
  },
  // 로딩 텍스트
  loadingText: {
    type: String,
    default: '데이터 로딩 중...'
  },
  // 차트 높이
  height: {
    type: String,
    default: '600px'
  },
  // 자동 리사이즈
  autoresize: {
    type: Boolean,
    default: true
  },
  // 컨트롤 영역 표시
  showControls: {
    type: Boolean,
    default: true
  },
  // 새로고침 버튼 표시
  showRefreshButton: {
    type: Boolean,
    default: true
  },
  // 재시도 버튼 표시
  showRetryButton: {
    type: Boolean,
    default: true
  },
  // 새로고침 버튼 텍스트
  refreshButtonText: {
    type: String,
    default: '데이터 새로고침'
  }
});

// 이벤트 정의
const emit = defineEmits(['refresh', 'retry', 'chart-click']);

// 차트 옵션 계산
const chartOption = computed(() => props.option);

// 이벤트 핸들러
const handleRetry = () => {
  emit('retry');
};

const handleChartClick = (params) => {
  emit('chart-click', params);
};
</script>

<style scoped>
.chart-widget {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.chart-container {
  width: 100%;
  height: v-bind(height);
  position: relative;
  padding: 20px;
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
}

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #ff5722;
  font-size: 16px;
}

.retry-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #ff5722;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  opacity: 0.8;
}

.chart {
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  gap: 10px;
  padding: 15px;
  background-color: #f5f5f5;
  border-top: 1px solid #ddd;
}

.refresh-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.refresh-btn:hover {
  opacity: 0.8;
}
</style>
