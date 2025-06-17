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
      <button @click="toggleView" class="toggle-btn">
        {{ viewType === 'department' ? '연도별 보기' : '부서별 보기' }}
      </button>
      <button @click="changeColorScheme" class="color-btn">색상 변경</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { TreemapChart } from 'echarts/charts';
import {
  LegendComponent,
  TitleComponent,
  TooltipComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

// ECharts 컴포넌트 등록
use([
  CanvasRenderer,
  TreemapChart,
  TooltipComponent,
  TitleComponent,
  LegendComponent
]);

const loading = ref(true);
const error = ref(null);
const retryCount = ref(0);
const maxRetries = 5;
const viewType = ref('department'); // 'department' 또는 'year'
const colorScheme = ref(0);

// 색상 스키마들
const colorSchemes = [
  [
    '#5470c6',
    '#91cc75',
    '#fac858',
    '#ee6666',
    '#73c0de',
    '#3ba272',
    '#fc8452',
    '#9a60b4'
  ],
  [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#ffeaa7',
    '#dda0dd',
    '#98d8c8',
    '#ff9ff3'
  ],
  [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#f5576c',
    '#4facfe',
    '#00f2fe',
    '#43e97b',
    '#38f9d7'
  ],
  [
    '#fa709a',
    '#fee140',
    '#a8edea',
    '#fed6e3',
    '#ffecd2',
    '#fcb69f',
    '#ff9a9e',
    '#fecfef'
  ]
];

const option = ref({
  title: {
    text: '부서별 매출 분포',
    left: 'center',
    textStyle: {
      fontSize: 20,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: function (info) {
      const value = info.value;
      const treePathInfo = info.treePathInfo;
      const treePath = [];

      for (let i = 1; i < treePathInfo.length; i++) {
        treePath.push(treePathInfo[i].name);
      }

      return [
        '<div class="tooltip-title">' + treePath.join(' → ') + '</div>',
        '<div class="tooltip-content">',
        '매출액: <strong>' +
          new Intl.NumberFormat('ko-KR').format(value) +
          '원</strong>',
        '</div>'
      ].join('');
    }
  },
  series: [
    {
      name: '매출 분포',
      type: 'treemap',
      width: '90%',
      height: '80%',
      top: '10%',
      roam: false,
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: true,
        height: 30,
        bottom: 'bottom'
      },
      label: {
        show: true,
        formatter: function (params) {
          const value = params.value;
          if (value > 100000) {
            return (
              params.name +
              '\n' +
              new Intl.NumberFormat('ko-KR', {
                notation: 'compact',
                compactDisplay: 'short'
              }).format(value) +
              '원'
            );
          }
          return params.name;
        },
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowBlur: 2
      },
      upperLabel: {
        show: true,
        height: 30,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: '#000',
        textShadowBlur: 2
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
        gapWidth: 2
      },
      emphasis: {
        itemStyle: {
          borderColor: '#000',
          borderWidth: 3
        },
        label: {
          fontSize: 14
        }
      },
      levels: [
        {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 3,
            gapWidth: 3
          }
        },
        {
          colorSaturation: [0.3, 0.6],
          itemStyle: {
            gapWidth: 1,
            borderColorSaturation: 0.6
          }
        }
      ],
      data: []
    }
  ]
});

// 색상 스키마 변경
const changeColorScheme = () => {
  colorScheme.value = (colorScheme.value + 1) % colorSchemes.length;
  updateChartColors();
};

// 차트 색상 업데이트
const updateChartColors = () => {
  const currentColors = colorSchemes[colorScheme.value];
  option.value.color = currentColors;

  option.value.series[0].levels[1] = {
    ...option.value.series[0].levels[1],
    color: currentColors,
    colorSaturation: [0.3, 0.8]
  };
};

// 보기 타입 토글
const toggleView = () => {
  viewType.value = viewType.value === 'department' ? 'year' : 'department';
  if (option.value.series[0].data.length > 0) {
    processData();
  }
};

let rawData = [];

// 데이터 처리 함수
const processData = () => {
  if (rawData.length === 0) return;

  let processedData = [];
  let title = '';

  if (viewType.value === 'department') {
    title = '부서별 매출 분포';
    // 부서별로 그룹화
    const departmentMap = {};
    rawData.forEach((item) => {
      if (!departmentMap[item.department]) {
        departmentMap[item.department] = [];
      }
      departmentMap[item.department].push(item);
    });

    processedData = Object.keys(departmentMap).map((department) => {
      const items = departmentMap[department];
      const children = items.map((item) => ({
        name: `${item.year}년`,
        value: item.amount,
        itemStyle: {
          color: getColorByDepartment(department)
        }
      }));

      return {
        name: department,
        children: children,
        itemStyle: {
          color: getColorByDepartment(department)
        }
      };
    });
  } else {
    title = '연도별 매출 분포';
    // 연도별로 그룹화
    const yearMap = {};
    rawData.forEach((item) => {
      if (!yearMap[item.year]) {
        yearMap[item.year] = [];
      }
      yearMap[item.year].push(item);
    });

    processedData = Object.keys(yearMap)
      .sort()
      .map((year) => {
        const items = yearMap[year];
        const children = items.map((item) => ({
          name: item.department,
          value: item.amount,
          itemStyle: {
            color: getColorByYear(year)
          }
        }));

        return {
          name: `${year}년`,
          children: children,
          itemStyle: {
            color: getColorByYear(year)
          }
        };
      });
  }

  option.value = {
    ...option.value,
    title: {
      ...option.value.title,
      text: title
    },
    series: [
      {
        ...option.value.series[0],
        data: processedData
      }
    ]
  };

  updateChartColors();
};

// 부서별 색상
const getColorByDepartment = (department) => {
  const colors = colorSchemes[colorScheme.value];
  const departmentColors = {
    영업부: colors[0],
    마케팅부: colors[1],
    개발부: colors[2],
    인사부: colors[3],
    재무부: colors[4],
    총무부: colors[5],
    기획부: colors[6]
  };
  return departmentColors[department] || colors[7];
};

// 연도별 색상
const getColorByYear = (year) => {
  const colors = colorSchemes[colorScheme.value];
  const yearIndex = parseInt(year) % colors.length;
  return colors[yearIndex];
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
      rawData = data;
      processData();
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 100%;
}

.chart-container {
  width: 100%;
  height: 700px;
  position: relative;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
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
  gap: 15px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading::before {
  content: '';
  width: 24px;
  height: 24px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #3498db;
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
  padding: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 2px solid #e74c3c;
}

.retry-btn {
  margin-top: 15px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
}

.chart {
  width: 100%;
  height: 100%;
}

.controls {
  display: flex;
  gap: 15px;
  padding: 25px;
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
  border-top: 1px solid #ddd;
  flex-wrap: wrap;
}

.refresh-btn,
.insert-btn,
.toggle-btn,
.color-btn {
  padding: 12px 20px;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 120px;
}

.refresh-btn {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
}

.insert-btn {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.toggle-btn {
  background: linear-gradient(135deg, #e67e22, #f39c12);
}

.color-btn {
  background: linear-gradient(135deg, #8e44ad, #9b59b6);
}

.refresh-btn:hover,
.insert-btn:hover,
.toggle-btn:hover,
.color-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
}

.refresh-btn:active,
.insert-btn:active,
.toggle-btn:active,
.color-btn:active {
  transform: translateY(0);
}

/* 커스텀 툴팁 스타일 */
:deep(.tooltip-title) {
  font-size: 14px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
  padding-bottom: 5px;
  border-bottom: 1px solid #eee;
}

:deep(.tooltip-content) {
  font-size: 13px;
  color: #666;
}
</style>
