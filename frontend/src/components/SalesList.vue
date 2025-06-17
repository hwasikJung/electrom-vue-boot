<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6 q-mb-md">
          <q-icon name="assessment" class="q-mr-sm" />
          매출 목록
        </div>

        <q-table
          :rows="salesList"
          :columns="columns"
          :loading="loading"
          row-key="index"
          flat
          bordered
          separator="horizontal"
          :rows-per-page-options="[10, 25, 50]"
          :pagination="pagination"
        >
          <!-- 로딩 슬롯 -->
          <template v-slot:loading>
            <q-inner-loading showing color="primary" />
          </template>

          <!-- 데이터가 없을 때 -->
          <template v-slot:no-data="{ message }">
            <div class="full-width row flex-center text-accent q-gutter-sm">
              <q-icon size="2em" name="sentiment_dissatisfied" />
              <span>{{ message || '데이터가 없습니다.' }}</span>
            </div>
          </template>

          <!-- 금액 컬럼 커스텀 -->
          <template v-slot:body-cell-amount="props">
            <q-td :props="props">
              <q-chip
                :color="getAmountColor(props.value)"
                text-color="white"
                :label="formatAmount(props.value)"
                icon="attach_money"
              />
            </q-td>
          </template>

          <!-- 연도 컬럼 커스텀 -->
          <template v-slot:body-cell-year="props">
            <q-td :props="props">
              <q-badge
                :color="getYearColor(props.value)"
                :label="props.value"
              />
            </q-td>
          </template>

          <!-- 부서 컬럼 커스텀 -->
          <template v-slot:body-cell-department="props">
            <q-td :props="props">
              <div class="row items-center q-gutter-sm">
                <q-icon :name="getDepartmentIcon(props.value)" />
                <span class="text-weight-medium">{{ props.value }}</span>
              </div>
            </q-td>
          </template>
        </q-table>

        <!-- 에러 표시 -->
        <q-banner v-if="error" class="text-white bg-red q-mt-md" rounded>
          <template v-slot:avatar>
            <q-icon name="error" color="white" />
          </template>
          {{ error }}
          <template v-slot:action>
            <q-btn
              flat
              color="white"
              label="다시 시도"
              @click="fetchSalesList"
            />
          </template>
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const salesList = ref([]);
    const loading = ref(true);
    const error = ref(null);

    // 테이블 컬럼 정의
    const columns = [
      {
        name: 'department',
        required: true,
        label: '부서',
        align: 'left',
        field: 'department',
        sortable: true
      },
      {
        name: 'amount',
        align: 'center',
        label: '금액',
        field: 'amount',
        sortable: true,
        sort: (a, b) => parseInt(a) - parseInt(b)
      },
      {
        name: 'year',
        align: 'center',
        label: '연도',
        field: 'year',
        sortable: true
      }
    ];

    // 페이지네이션 설정
    const pagination = ref({
      sortBy: 'year',
      descending: true,
      page: 1,
      rowsPerPage: 10
    });

    // 금액 포맷팅
    const formatAmount = (amount) => {
      return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    };

    // 금액에 따른 색상
    const getAmountColor = (amount) => {
      if (amount >= 1000000) return 'green';
      if (amount >= 500000) return 'orange';
      return 'blue';
    };

    // 연도에 따른 색상
    const getYearColor = (year) => {
      const currentYear = new Date().getFullYear();
      if (year === currentYear) return 'primary';
      if (year === currentYear - 1) return 'secondary';
      return 'grey';
    };

    // 부서별 아이콘
    const getDepartmentIcon = (department) => {
      const icons = {
        영업부: 'trending_up',
        마케팅부: 'campaign',
        개발부: 'code',
        인사부: 'people',
        재무부: 'account_balance'
      };
      return icons[department] || 'business';
    };

    const fetchSalesList = async () => {
      try {
        loading.value = true;
        error.value = null;
        const response = await window.electronAPI.getSalesData();
        salesList.value = response;
      } catch (err) {
        error.value = err.message || '데이터를 가져오는데 문제가 발생했습니다.';
        console.error('매출 데이터 로딩 실패:', err);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchSalesList);

    return {
      salesList,
      loading,
      error,
      columns,
      pagination,
      fetchSalesList,
      formatAmount,
      getAmountColor,
      getYearColor,
      getDepartmentIcon
    };
  }
};
</script>

<style scoped>
.my-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
