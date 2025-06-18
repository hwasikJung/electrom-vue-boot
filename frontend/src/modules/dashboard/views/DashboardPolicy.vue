<template>
  <div class="q-pa-md">
    <!-- 페이지 헤더 -->
    <div class="page-header q-mb-lg">
      <!-- 브레드크럼 -->
      <q-breadcrumbs
        separator=">"
        class="text-grey-8 q-mb-sm"
        active-color="primary"
      >
        <q-breadcrumbs-el icon="dashboard" label="대시보드" />
        <q-breadcrumbs-el
          icon="folder"
          label="정책 자료실"
          class="text-weight-medium"
        />
      </q-breadcrumbs>

      <!-- 페이지 타이틀 -->
      <!--      <div class="page-title">
              <q-icon name="assessment" size="md" class="q-mr-sm text-primary" />
              <span class="text-h5 text-weight-medium">공지사항</span>
            </div>-->
    </div>
    <chart-component
      :option="chartOption"
      :loading="loading"
      :error="error"
      :height="'700px'"
      :show-controls="true"
      :loading-text="'정책 데이터 로딩 중...'"
      @refresh="loadData"
      @retry="retryLoad"
      @chart-click="handleChartClick"
    >
      <!--      <template #controls>
        <button @click="loadData" class="refresh-btn">데이터 새로고침</button>
        <button @click="insertData" class="insert-btn">
          테스트 데이터 생성
        </button>
        <button @click="toggleView" class="toggle-btn">
          {{ viewType === 'department' ? '연도별 보기' : '부서별 보기' }}
        </button>
        <button @click="changeColorScheme" class="color-btn">색상 변경</button>
      </template>-->
    </chart-component>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import ChartComponent from '@/components/charts/ChartComponent.vue';

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

const chartOption = ref({
  title: {
    text: '정책 자료실',
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
      height: '85%',
      top: '10%',
      roam: false,
      nodeClick: 'zoomToNode',
      breadcrumb: {
        show: false,
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

let rawData = [];

// 색상 스키마 변경
const changeColorScheme = () => {
  colorScheme.value = (colorScheme.value + 1) % colorSchemes.length;
  updateChartColors();
};

// 차트 색상 업데이트
const updateChartColors = () => {
  const currentColors = colorSchemes[colorScheme.value];
  chartOption.value.color = currentColors;

  chartOption.value.series[0].levels[1] = {
    ...chartOption.value.series[0].levels[1],
    color: currentColors,
    colorSaturation: [0.3, 0.8]
  };
};

// 보기 타입 토글
const toggleView = () => {
  viewType.value = viewType.value === 'department' ? 'year' : 'department';
  if (chartOption.value.series[0].data.length > 0) {
    processData();
  }
};

// 데이터 처리 함수
const processData = () => {
  if (rawData.length === 0) return;

  let processedData = [];
  let title = '';

  if (viewType.value === 'department') {
    title = '정책 자료실';
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
    title = '정책 자료실';
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

  chartOption.value = {
    ...chartOption.value,
    title: {
      ...chartOption.value.title,
      text: title
    },
    series: [
      {
        ...chartOption.value.series[0],
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
// const insertData = async () => {
//   const success = await window.electronAPI.insertSalesData();
//   if (success) {
//     await loadData();
//   }
// };

// 차트 클릭 핸들러
const handleChartClick = (params) => {
  console.log('Treemap 차트 클릭:', params);
  // 특정 영역 클릭 시 상세 정보 표시 등의 기능 구현 가능
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
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
