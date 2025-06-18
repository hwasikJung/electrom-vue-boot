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

import { useDialog } from '@/shared/composables/useDialog.js';
import { useNotify } from '@/shared/composables/useNotify.js';

const salesList = ref([]);
const loading = ref(true);
const error = ref(null);
const formDialog = ref(false);
const currentItem = ref(null);
const isEdit = ref(false);

// Composables
const dialog = useDialog();
const notify = useNotify();

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
    notify.error('데이터를 가져오는데 문제가 발생했습니다.');
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
  console.log('수정할 항목:', item);

  if (!item || !item.id) {
    notify.error('수정할 항목을 찾을 수 없습니다.');
    return;
  }

  currentItem.value = { ...item };
  isEdit.value = true;
  formDialog.value = true;
};

// 매출 데이터 저장
const saveSales = async (salesData) => {
  try {
    if (isEdit.value) {
      // 수정 모드
      if (!salesData.id) {
        throw new Error('수정할 항목의 ID가 없습니다.');
      }

      console.log('수정 데이터:', salesData);
      await window.electronAPI.updateSalesData(salesData);
      notify.success('매출 데이터가 성공적으로 수정되었습니다.');
    } else {
      // 추가 모드
      console.log('추가 데이터:', salesData);
      await window.electronAPI.insertSalesData(salesData);
      notify.success('매출 데이터가 성공적으로 등록되었습니다.');
    }

    formDialog.value = false;
    currentItem.value = null;
    await fetchSalesList();
  } catch (err) {
    error.value = isEdit.value
      ? '수정 중 오류가 발생했습니다.'
      : '저장 중 오류가 발생했습니다.';
    console.error('매출 데이터 저장 실패:', err);
    notify.error(
      err.message ||
        (isEdit.value
          ? '수정 중 오류가 발생했습니다.'
          : '저장 중 오류가 발생했습니다.')
    );
  }
};

// 매출 데이터 삭제
const deleteSales = async (item) => {
  console.log('삭제할 항목:', item);

  if (!item || !item.id) {
    notify.error('삭제할 항목을 찾을 수 없습니다.');
    return;
  }

  const confirmed = await dialog.confirm({
    title: '삭제 확인',
    message: `정말로 ${item.department}의 매출 데이터를 삭제하시겠습니까?`,
    color: 'negative',
    okLabel: '삭제',
    cancelLabel: '취소'
  });

  if (!confirmed) return;

  try {
    const ids = [item.id];

    await window.electronAPI.bulkDeleteSales(ids);
    await fetchSalesList();
    notify.success('매출 데이터가 성공적으로 삭제되었습니다.');
  } catch (err) {
    error.value = '삭제 중 오류가 발생했습니다.';
    console.error('매출 데이터 삭제 실패:', err);
    notify.error('삭제 중 오류가 발생했습니다.');
  }
};

// 대량 삭제
const bulkDeleteSales = async (items) => {
  if (!items || items.length === 0) {
    notify.error('삭제할 항목을 선택해주세요.');
    return;
  }

  const confirmed = await dialog.confirm({
    title: '삭제 확인',
    message: `선택한 ${items.length}개의 매출 데이터를 모두 삭제하시겠습니까?`,
    color: 'negative',
    okLabel: '삭제',
    cancelLabel: '취소'
  });

  if (!confirmed) return;

  try {
    const ids = items.map((item) => item.id).filter((id) => id);
    if (ids.length === 0) {
      throw new Error('유효한 ID가 없습니다.');
    }

    await window.electronAPI.bulkDeleteSales(ids);
    await fetchSalesList();
    notify.success(
      `${ids.length}개의 매출 데이터가 성공적으로 삭제되었습니다.`
    );
  } catch (err) {
    error.value = '대량 삭제 중 오류가 발생했습니다.';
    console.error('매출 데이터 대량 삭제 실패:', err);
    notify.error('대량 삭제 중 오류가 발생했습니다.');
  }
};

// Excel 내보내기
const exportToExcel = async () => {
  const confirmed = await dialog.confirm({
    title: 'Excel 내보내기',
    message: '현재 데이터를 Excel 파일로 내보내시겠습니까?',
    color: 'positive',
    okLabel: '내보내기',
    cancelLabel: '취소'
  });

  if (!confirmed) return;

  try {
    // Excel 내보내기 로직
    console.log('Excel 내보내기', salesList.value);
    notify.success('Excel 파일이 성공적으로 내보내졌습니다.');
  } catch (err) {
    console.error('Excel 내보내기 실패:', err);
    notify.error('Excel 내보내기 중 오류가 발생했습니다.');
  }
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
