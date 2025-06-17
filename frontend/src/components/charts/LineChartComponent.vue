<template>
  <div class="chart-widget">
    <div class="chart-container">
      <div v-if="loading" class="loading">데이터 로딩 중...</div>
      <div v-else-if="error" class="error">
        {{ error }}
        <button @click="retryLoad" class="retry-btn">다시 시도</button>
      </div>
      <v-chart v-else class="chart" :option="option" autoresize />
    </div>
    <div class="controls">
      <button @click="loadData" class="refresh-btn">데이터 새로고침</button>
      <button @click="insertData" class="insert-btn">테스트 데이터 생성</button>
      <button @click="toggleChartType" class="toggle-btn">
        {{ chartType === 'line' ? '영역 차트' : '라인 차트' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  MarkPointComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// ECharts 컴포넌트 등록
use([
  CanvasRenderer,
  LineChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  TitleComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkPointComponent
]);

const loading = ref(true);
const error = ref(null);
const retryCount = ref(0);
const maxRetries = 5;
const chartType = ref('line'); // 'line' 또는 'area'

const option = ref({
  title: {
    text: '부서별 매출 추이',
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    },
    formatter: function (params) {
      let tooltip = `<div style="margin-bottom: 5px; font-weight: bold;">${params[0].axisValue}</div>`;
      params.forEach((param) => {
        tooltip += `
          <div style="display: flex; align-items: center; margin-bottom: 3px;">
            <span style="display: inline-block; width: 10px; height: 10px; background-color: ${param.color}; border-radius: 50%; margin-right: 8px;"></span>
            <span style="margin-right: 10px;">${param.seriesName}:</span>
            <span style="font-weight: bold;">${new Intl.NumberFormat('ko-KR').format(param.value)}원</span>
          </div>
        `;
      });
      return tooltip;
    }
  },
  legend: {
    data: [],
    top: '40px',
    textStyle: {
      fontSize: 14
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '80px',
    bottom: '80px',
    containLabel: true
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100
    },
    {
      start: 0,
      end: 100,
      height: 20,
      bottom: 20
    }
  ],
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLabel: {
      fontSize: 12,
      rotate: 45
    },
    axisLine: {
      lineStyle: {
        color: '#8392A5'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
      formatter: function (value) {
        return (
          new Intl.NumberFormat('ko-KR', {
            notation: 'compact',
            compactDisplay: 'short'
          }).format(value) + '원'
        );
      }
    },
    axisLine: {
      lineStyle: {
        color: '#8392A5'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#E6E8EB'
      }
    }
  },
  series: []
});

// 차트 타입 토글
const toggleChartType = () => {
  chartType.value = chartType.value === 'line' ? 'area' : 'line';
  updateChartType();
};

const updateChartType = () => {
  const newSeries = option.value.series.map((series) => ({
    ...series,
    areaStyle:
      chartType.value === 'area'
        ? {
            opacity: 0.3
          }
        : undefined
  }));

  option.value = {
    ...option.value,
    series: newSeries
  };
};

// 부서별 색상 매핑
const getDepartmentColor = (department) => {
  const colorMap = {
    영업부: '#FF6B6B',
    마케팅부: '#4ECDC4',
    개발부: '#45B7D1',
    인사부: '#96CEB4',
    재무부: '#FFEAA7',
    총무부: '#DDA0DD',
    기획부: '#98D8C8'
  };
  return colorMap[department] || '#74B9FF';
};

// 데이터 로드 함수
const loadData = async (isRetry = false) => {
  if (!isRetry) {
    loading.value = true;
    error.value = null;
  }

  try {
    const data = await window.electronAPI.getSalesData();

    if (data.length > 0) {
      // 연도별로 정렬된 데이터 생성
      const years = [...new Set(data.map((item) => item.year))].sort();
      const departments = [...new Set(data.map((item) => item.department))];

      // 각 부서별 시리즈 생성
      const seriesData = departments.map((department) => {
        const departmentData = years.map((year) => {
          const item = data.find(
            (d) => d.department === department && d.year === year
          );
          return item ? item.amount : 0;
        });

        return {
          name: department,
          type: 'line',
          data: departmentData,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 3,
            color: getDepartmentColor(department)
          },
          itemStyle: {
            color: getDepartmentColor(department),
            borderWidth: 2,
            borderColor: '#fff'
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          markPoint: {
            data: [
              { type: 'max', name: '최대값' },
              { type: 'min', name: '최소값' }
            ],
            itemStyle: {
              color: getDepartmentColor(department)
            }
          },
          areaStyle:
            chartType.value === 'area'
              ? {
                  opacity: 0.3,
                  color: getDepartmentColor(department)
                }
              : undefined
        };
      });

      // 차트 옵션 업데이트
      option.value = {
        ...option.value,
        legend: {
          ...option.value.legend,
          data: departments
        },
        xAxis: {
          ...option.value.xAxis,
          data: years.map((year) => `${year}년`)
        },
        series: seriesData
      };

      retryCount.value = 0;
    }
  } catch (err) {
    console.error('데이터 로드 오류:', err);

    if (retryCount.value < maxRetries) {
      retryCount.value++;
      console.log(
        `재시도 ${retryCount.value}/${maxRetries} 후 3초 후 다시 시도...`
      );
      setTimeout(() => loadData(true), 3000);
      return;
    } else {
      error.value =
        '백엔드 서버 연결에 실패했습니다. 서버가 실행 중인지 확인해주세요.';
    }
  } finally {
    loading.value = false;
  }
};

// 재시도 함수
const retryLoad = () => {
  retryCount.value = 0;
  loadData();
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
  border-radius: 12px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.chart-container {
  width: 100%;
  height: 600px;
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #666;
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading::before {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #e74c3c;
  font-size: 16px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.retry-btn {
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background-color: #c0392b;
  transform: translateY(-2px);
}

.chart {
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-top: 1px solid #ddd;
}

.refresh-btn,
.insert-btn,
.toggle-btn {
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.refresh-btn {
  background: linear-gradient(135deg, #4caf50, #45a049);
}

.insert-btn {
  background: linear-gradient(135deg, #2196f3, #1976d2);
}

.toggle-btn {
  background: linear-gradient(135deg, #ff9800, #f57c00);
}

.refresh-btn:hover,
.insert-btn:hover,
.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.refresh-btn:active,
.insert-btn:active,
.toggle-btn:active {
  transform: translateY(0);
}
</style>
