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
          icon="campaign"
          label="공지사항"
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
      :height="'500px'"
      :show-controls="true"
      :loading-text="'공지사항 데이터 로딩 중...'"
      @refresh="loadData"
      @retry="retryLoad"
      @chart-click="handleChartClick"
    >
      <template #controls>
        <button @click="loadData" class="refresh-btn">데이터 새로고침</button>
        <button @click="exportChart" class="export-btn">차트 내보내기</button>
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
const maxRetries = 3;

const chartOption = ref({
  title: {
    text: '월별 공지사항 등록 현황',
    textStyle: {
      fontSize: 18,
      fontWeight: 'bold'
    },
    left: 'center',
    top: 20
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
      let result = `${params[0].axisValue}<br/>`;
      params.forEach((param) => {
        result += `${param.seriesName}: ${param.value}건<br/>`;
      });
      return result;
    }
  },
  legend: {
    data: ['일반공지', '중요공지', '긴급공지'],
    top: 60,
    textStyle: {
      fontSize: 14
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    top: '20%',
    bottom: '10%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {
        title: '이미지로 저장'
      },
      dataZoom: {
        title: {
          zoom: '영역 확대',
          back: '확대 복원'
        }
      }
    },
    right: 20,
    top: 20
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [],
    axisLabel: {
      fontSize: 12,
      rotate: 45
    }
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
      formatter: '{value}건'
    }
  },
  series: [
    {
      name: '일반공지',
      type: 'line',
      stack: 'total',
      smooth: true,
      lineStyle: {
        width: 3
      },
      symbol: 'circle',
      symbolSize: 6,
      data: [],
      itemStyle: {
        color: '#4CAF50'
      }
    },
    {
      name: '중요공지',
      type: 'line',
      stack: 'total',
      smooth: true,
      lineStyle: {
        width: 3
      },
      symbol: 'circle',
      symbolSize: 6,
      data: [],
      itemStyle: {
        color: '#FF9800'
      }
    },
    {
      name: '긴급공지',
      type: 'line',
      stack: 'total',
      smooth: true,
      lineStyle: {
        width: 3
      },
      symbol: 'circle',
      symbolSize: 6,
      data: [],
      itemStyle: {
        color: '#F44336'
      }
    }
  ]
});

// 데이터 로드 함수
const loadData = async (isRetry = false) => {
  if (!isRetry) {
    loading.value = true;
    error.value = null;
  }

  try {
    // 실제 API 호출 예시 (현재는 더미 데이터)
    const data = await fetchNoticeData();

    if (data) {
      updateChartData(data);
      retryCount.value = 0;
    }
  } catch (err) {
    console.error('공지사항 데이터 로드 오류:', err);

    if (retryCount.value < maxRetries) {
      retryCount.value++;
      console.log(
        `재시도 ${retryCount.value}/${maxRetries} 후 2초 후 다시 시도...`
      );
      setTimeout(() => loadData(true), 2000);
      return;
    } else {
      error.value =
        '공지사항 데이터를 불러올 수 없습니다. 네트워크를 확인해주세요.';
    }
  } finally {
    loading.value = false;
  }
};

// 더미 데이터 생성 함수 (실제 API 대체)
const fetchNoticeData = async () => {
  // 실제로는 await window.electronAPI.getNoticeData() 같은 형태
  return new Promise((resolve) => {
    setTimeout(() => {
      const months = [
        '1월',
        '2월',
        '3월',
        '4월',
        '5월',
        '6월',
        '7월',
        '8월',
        '9월',
        '10월',
        '11월',
        '12월'
      ];
      const generalNotices = [12, 8, 15, 22, 18, 25, 30, 28, 20, 16, 14, 18];
      const importantNotices = [3, 2, 5, 8, 6, 10, 12, 9, 7, 4, 3, 5];
      const urgentNotices = [1, 0, 2, 3, 2, 4, 5, 3, 2, 1, 1, 2];

      resolve({
        months,
        generalNotices,
        importantNotices,
        urgentNotices
      });
    }, 1000);
  });
};

// 차트 데이터 업데이트
const updateChartData = (data) => {
  chartOption.value = {
    ...chartOption.value,
    xAxis: {
      ...chartOption.value.xAxis,
      data: data.months
    },
    series: [
      {
        ...chartOption.value.series[0],
        data: data.generalNotices
      },
      {
        ...chartOption.value.series[1],
        data: data.importantNotices
      },
      {
        ...chartOption.value.series[2],
        data: data.urgentNotices
      }
    ]
  };
};

// 재시도 함수
const retryLoad = () => {
  retryCount.value = 0;
  loadData();
};

// 차트 클릭 핸들러
const handleChartClick = (params) => {
  console.log('공지사항 차트 클릭:', params);
  // 특정 월의 공지사항 상세보기 등의 기능 구현 가능
};

// 차트 내보내기
const exportChart = () => {
  // 차트 내보내기 로직
  console.log('차트 내보내기 기능');
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(async () => {
  await loadData();
});
</script>

<style scoped>
.refresh-btn {
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
}

.refresh-btn:hover {
  background-color: #45a049;
}

.export-btn {
  padding: 10px 20px;
  background-color: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.export-btn:hover {
  background-color: #1976d2;
}
</style>
