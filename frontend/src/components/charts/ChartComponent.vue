<template>
  <div class="chart-widget">
    <div class="chart-container">
      <div v-if="loading" class="loading">데이터 로딩 중...</div>
      <v-chart v-else class="chart" :option="option" autoresize />
    </div>
    <div class="controls">
      <button @click="loadData" class="refresh-btn">데이터 새로고침</button>
      <button @click="insertData" class="insert-btn">테스트 데이터 생성</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { BarChart } from 'echarts/charts';
import {
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// ECharts 컴포넌트 등록
use([
  CanvasRenderer,
  BarChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent
]);

const loading = ref(true);
const option = ref({
  title: {
    text: '부서별 매출 실적',
    textStyle: {
      fontSize: 18
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  legend: {
    data: ['2023년', '2024년'],
    top: 'bottom',
    textStyle: {
      fontSize: 14
    }
  },
  grid: {
    left: '5%',
    right: '5%',
    top: '15%',
    bottom: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      fontSize: 14,
      interval: 0,
      rotate: 0
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 14
    }
  },
  series: [
    {
      name: '2023년',
      type: 'bar',
      data: [],
      barWidth: '30%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    },
    {
      name: '2024년',
      type: 'bar',
      data: [],
      barWidth: '30%',
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
});

// // 창 컨트롤 함수
// const minimize = () => {
//   window.electronAPI.minimize();
// };
//
// const maximize = () => {
//   window.electronAPI.maximize();
// };
//
// const close = () => {
//   window.electronAPI.close();
// };

// 데이터 로드 함수
const loadData = async () => {
  loading.value = true;
  try {
    const data = await window.electronAPI.getSalesData();

    if (data.length > 0) {
      // 데이터 가공
      const departments = [...new Set(data.map((item) => item.department))];
      const years = [...new Set(data.map((item) => item.year))].sort();

      // 각 연도별 데이터 추출
      const seriesData = years.map((year) => {
        return {
          name: `${year}년`,
          type: 'bar',
          data: departments.map((dept) => {
            const item = data.find(
              (d) => d.department === dept && d.year === year
            );
            return item ? item.amount : 0;
          }),
          // barWidth: '30%',
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        };
      });

      // 차트 업데이트
      option.value = {
        ...option.value,
        legend: {
          data: years.map((year) => `${year}년`),
          top: 'bottom',
          textStyle: {
            fontSize: 14
          }
        },
        xAxis: {
          ...option.value.xAxis,
          data: departments
        },
        series: seriesData
      };
    }
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  } finally {
    loading.value = false;
  }
};

// 테스트 데이터 생성 함수
const insertData = async () => {
  const success = await window.electronAPI.insertTestData();
  if (success) {
    await loadData();
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadData();
});
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
  height: 600px; /* 높이 증가 */
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

.refresh-btn,
.insert-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.insert-btn {
  background-color: #2196f3;
}

.refresh-btn:hover,
.insert-btn:hover {
  opacity: 0.8;
}
</style>
