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
          icon="book"
          label="이용안내"
          class="text-weight-medium"
        />
      </q-breadcrumbs>

      <!-- 페이지 타이틀 -->
      <!--      <div class="page-title">
              <q-icon name="assessment" size="md" class="q-mr-sm text-primary" />
              <span class="text-h5 text-weight-medium">이용안내</span>
            </div>-->
    </div>

    <table-component
      :rows="salesList"
      :columns="columns"
      :loading="loading"
      :error="error"
      title="이용안내"
      title-icon="book"
      row-key="id"
      @add="openAddDialog"
      @edit="openEditDialog"
      @delete="deleteSales"
      @bulk-delete="bulkDeleteSales"
      @refresh="fetchSalesList"
      @retry="fetchSalesList"
    >
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
          <q-badge :color="getYearColor(props.value)" :label="props.value" />
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

      <!-- 추가 액션 버튼 -->
      <template v-slot:extra-actions>
        <q-btn
          color="green"
          icon="file_download"
          label="Excel 내보내기"
          @click="exportToExcel"
          class="q-mr-sm"
        />
      </template>
    </table-component>

    <use-info-component
      v-model="formDialog"
      :item="currentItem"
      :is-edit="isEdit"
      @save="saveSales"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import TableComponent from '@/components/table/TableComponent.vue';
import UseInfoComponent from '@/modules/dashboard/views/component/UseInfoComponent.vue';

const salesList = ref([]);
const loading = ref(true);
const error = ref(null);
const formDialog = ref(false);
const currentItem = ref(null);
const isEdit = ref(false);

// 테이블 컬럼 정의
const columns = [
  {
    name: 'id',
    required: true,
    label: 'ID',
    align: 'left',
    field: 'id',
    sortable: true
  },
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

// 데이터 로드
const fetchSalesList = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await window.electronAPI.getSalesData();
    salesList.value = response.map((item, index) => ({
      ...item,
      id: item.id || index + 1
    }));
  } catch (err) {
    error.value = err.message || '데이터를 가져오는데 문제가 발생했습니다.';
    console.error('매출 데이터 로딩 실패:', err);
  } finally {
    loading.value = false;
  }
};

// 추가 다이얼로그 열기
const openAddDialog = () => {
  currentItem.value = null;
  isEdit.value = false;
  formDialog.value = true;
};

// 수정 다이얼로그 열기
const openEditDialog = (item) => {
  currentItem.value = { ...item };
  isEdit.value = true;
  formDialog.value = true;
};

// 매출 데이터 저장
const saveSales = async (salesData) => {
  try {
    if (isEdit.value) {
      await window.electronAPI.updateSales(salesData);
    } else {
      await window.electronAPI.createSales(salesData);
    }
    formDialog.value = false;
    await fetchSalesList();
  } catch (err) {
    error.value = '저장 중 오류가 발생했습니다.';
    console.error('매출 데이터 저장 실패:', err);
  }
};

// 매출 데이터 삭제
const deleteSales = async (item) => {
  try {
    await window.electronAPI.deleteSales(item.id);
    await fetchSalesList();
  } catch (err) {
    error.value = '삭제 중 오류가 발생했습니다.';
    console.error('매출 데이터 삭제 실패:', err);
  }
};

// 대량 삭제
const bulkDeleteSales = async (items) => {
  try {
    const ids = items.map((item) => item.id);
    await window.electronAPI.bulkDeleteSales(ids);
    await fetchSalesList();
  } catch (err) {
    error.value = '대량 삭제 중 오류가 발생했습니다.';
    console.error('매출 데이터 대량 삭제 실패:', err);
  }
};

// Excel 내보내기
const exportToExcel = () => {
  // Excel 내보내기 로직
  console.log('Excel 내보내기');
};

// 유틸리티 함수들
const formatAmount = (amount) => {
  return new Intl.NumberFormat('ko-KR').format(amount) + '원';
};

const getAmountColor = (amount) => {
  if (amount >= 1000000) return 'green';
  if (amount >= 500000) return 'orange';
  return 'blue';
};

const getYearColor = (year) => {
  const currentYear = new Date().getFullYear();
  if (year === currentYear) return 'primary';
  if (year === currentYear - 1) return 'secondary';
  return 'grey';
};

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

onMounted(fetchSalesList);
</script>
<style scoped></style>
