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
          icon="link"
          label="데이터 연계 현황"
          class="text-weight-medium"
        />
      </q-breadcrumbs>

      <!-- 페이지 타이틀 -->
      <!--      <div class="page-title">
              <q-icon name="link" size="md" class="q-mr-sm text-primary" />
              <span class="text-h5 text-weight-medium">데이터 연계 현황</span>
            </div>-->
    </div>

    <chart-component
      :option="chartOption"
      :loading="loading"
      :error="error"
      :show-controls="true"
      @refresh="loadData"
      @retry="retryLoad"
      @chart-click="handleChartClick"
    >
      <template #controls>
        <q-btn
          color="positive"
          icon="refresh"
          label="데이터 새로고침"
          @click="loadData"
          class="q-mr-sm"
        />
        <q-btn
          color="primary"
          icon="add_circle"
          label="테스트 데이터 생성"
          @click="insertData"
        />
      </template>
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

const chartOption = ref({
  title: {
    text: '데이터 연계 현황',
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
  series: []
});

// 데이터 로드 함수
const loadData = async (isRetry = false) => {
  if (!isRetry) {
    loading.value = true;
    error.value = null;
  }

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
      chartOption.value = {
        ...chartOption.value,
        legend: {
          data: years.map((year) => `${year}년`),
          top: 'bottom',
          textStyle: {
            fontSize: 14
          }
        },
        xAxis: {
          ...chartOption.value.xAxis,
          data: departments
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

// 차트 클릭 핸들러
const handleChartClick = (params) => {
  console.log('차트 클릭:', params);
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
/*.page-header {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.page-title {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

!* Quasar 버튼 스타일 확장 *!
:deep(.q-btn) {
  font-weight: 500;
  text-transform: none;
}*/
</style>
