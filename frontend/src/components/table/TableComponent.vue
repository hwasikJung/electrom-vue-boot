<template>
  <div>
    <!-- 상단 액션 버튼 -->
    <div v-if="showActions" class="q-mb-md">
      <q-btn
        v-if="showAddButton"
        color="primary"
        icon="add"
        :label="addButtonText"
        @click="$emit('add')"
        class="q-mr-sm"
      />
      <q-btn
        v-if="showRefreshButton"
        color="secondary"
        icon="refresh"
        :label="refreshButtonText"
        @click="$emit('refresh')"
        class="q-mr-sm"
      />
      <slot name="extra-actions"></slot>
    </div>

    <q-table
      :rows="rows"
      :columns="columns"
      :loading="loading"
      :row-key="rowKey"
      flat
      bordered
      separator="horizontal"
      :rows-per-page-options="rowsPerPageOptions"
      :pagination="pagination"
      @request="$emit('request', $event)"
      selection="multiple"
      v-model:selected="selectedRows"
    >
      <!-- 로딩 슬롯 -->
      <template v-slot:loading>
        <q-inner-loading showing color="primary" />
      </template>

      <!-- 데이터가 없을 때 -->
      <template v-slot:no-data="{ message }">
        <div class="full-width row flex-center text-accent q-gutter-sm">
          <q-icon size="2em" name="sentiment_dissatisfied" />
          <span>{{ message || noDataText }}</span>
        </div>
      </template>

      <!-- 액션 컬럼 -->
      <template v-slot:body-cell-actions="props" v-if="showRowActions">
        <q-td :props="props">
          <q-btn
            flat
            round
            color="blue"
            icon="edit"
            size="sm"
            @click="$emit('edit', props.row)"
            class="q-mr-xs"
          >
            <q-tooltip>수정</q-tooltip>
          </q-btn>
          <q-btn
            flat
            round
            color="red"
            icon="delete"
            size="sm"
            @click="confirmDelete(props.row)"
          >
            <q-tooltip>삭제</q-tooltip>
          </q-btn>
        </q-td>
      </template>

      <!-- 동적 슬롯 -->
      <template
        v-for="(_, slotName) in $slots"
        :key="slotName"
        v-slot:[slotName]="slotProps"
      >
        <slot :name="slotName" v-bind="slotProps"></slot>
      </template>
    </q-table>

    <!-- 선택된 행 액션 -->
    <div v-if="selectedRows.length > 0" class="q-mt-md">
      <q-btn
        color="negative"
        icon="delete"
        :label="`선택된 ${selectedRows.length}개 항목 삭제`"
        @click="confirmBulkDelete"
      />
    </div>

    <!-- 에러 표시 -->
    <q-banner v-if="error" class="text-white bg-red q-mt-md" rounded>
      <template v-slot:avatar>
        <q-icon name="error" color="white" />
      </template>
      {{ error }}
      <template v-slot:action>
        <q-btn flat color="white" label="다시 시도" @click="$emit('retry')" />
      </template>
    </q-banner>
  </div>

  <!-- 삭제 확인 다이얼로그 -->
  <q-dialog v-model="deleteDialog">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="orange" text-color="white" />
        <span class="q-ml-sm">정말로 삭제하시겠습니까?</span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" v-close-popup />
        <q-btn
          flat
          label="삭제"
          color="negative"
          @click="handleDelete"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <!-- 대량 삭제 확인 다이얼로그 -->
  <q-dialog v-model="bulkDeleteDialog">
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="warning" color="orange" text-color="white" />
        <span class="q-ml-sm">
          선택된 {{ selectedRows.length }}개 항목을 삭제하시겠습니까?
        </span>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat label="취소" color="primary" v-close-popup />
        <q-btn
          flat
          label="모두 삭제"
          color="negative"
          @click="handleBulkDelete"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';

// Props 정의
const props = defineProps({
  // 테이블 데이터
  rows: {
    type: Array,
    default: () => []
  },
  // 컬럼 정의
  columns: {
    type: Array,
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
  // 제목
  title: {
    type: String,
    default: '데이터 목록'
  },
  // 제목 아이콘
  titleIcon: {
    type: String,
    default: 'table_view'
  },
  // 행 키
  rowKey: {
    type: String,
    default: 'id'
  },
  // 페이지당 행 수 옵션
  rowsPerPageOptions: {
    type: Array,
    default: () => [10, 25, 50, 100]
  },
  // 페이지네이션
  pagination: {
    type: Object,
    default: () => ({
      sortBy: 'id',
      descending: false,
      page: 1,
      rowsPerPage: 10
    })
  },
  // 액션 버튼 표시
  showActions: {
    type: Boolean,
    default: true
  },
  // 추가 버튼 표시
  showAddButton: {
    type: Boolean,
    default: true
  },
  // 새로고침 버튼 표시
  showRefreshButton: {
    type: Boolean,
    default: true
  },
  // 행 액션 표시
  showRowActions: {
    type: Boolean,
    default: true
  },
  // 추가 버튼 텍스트
  addButtonText: {
    type: String,
    default: '추가'
  },
  // 새로고침 버튼 텍스트
  refreshButtonText: {
    type: String,
    default: '새로고침'
  },
  // 데이터 없음 텍스트
  noDataText: {
    type: String,
    default: '데이터가 없습니다.'
  }
});

// 이벤트 정의
const emit = defineEmits([
  'add',
  'edit',
  'delete',
  'bulk-delete',
  'refresh',
  'retry',
  'request'
]);

// 반응형 데이터
const selectedRows = ref([]);
const deleteDialog = ref(false);
const bulkDeleteDialog = ref(false);
const itemToDelete = ref(null);

// 삭제 확인
const confirmDelete = (row) => {
  itemToDelete.value = row;
  deleteDialog.value = true;
};

// 삭제 처리
const handleDelete = () => {
  emit('delete', itemToDelete.value);
  itemToDelete.value = null;
};

// 대량 삭제 확인
const confirmBulkDelete = () => {
  bulkDeleteDialog.value = true;
};

// 대량 삭제 처리
const handleBulkDelete = () => {
  emit('bulk-delete', selectedRows.value);
  selectedRows.value = [];
};

// 컬럼에 액션 컬럼 추가
const columnsWithActions = computed(() => {
  if (!props.showRowActions) return props.columns;

  const hasActionsColumn = props.columns.some((col) => col.name === 'actions');
  if (hasActionsColumn) return props.columns;

  return [
    ...props.columns,
    {
      name: 'actions',
      label: '작업',
      align: 'center',
      sortable: false
    }
  ];
});
</script>

<style scoped>
.my-card {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}
</style>
