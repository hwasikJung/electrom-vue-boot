<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ isEdit ? '매출 수정' : '매출 추가' }}
        </div>
        <!-- 수정 모드일 때 ID 표시 -->
        <div v-if="isEdit && form.id" class="text-caption text-grey-6">
          ID: {{ form.id }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md" ref="formRef">
          <q-select
            v-model="form.department"
            :options="departmentOptions"
            label="부서"
            outlined
            :rules="[(val) => !!val || '부서를 선택해주세요']"
          />

          <q-input
            v-model.number="form.amount"
            type="number"
            label="금액"
            outlined
            suffix="원"
            :rules="[
              (val) => !!val || '금액을 입력해주세요',
              (val) => val > 0 || '금액은 0보다 커야 합니다'
            ]"
          />

          <q-input
            v-model.number="form.year"
            type="number"
            label="연도"
            outlined
            :rules="[
              (val) => !!val || '연도를 입력해주세요',
              (val) =>
                (val >= 2020 && val <= 2030) || '유효한 연도를 입력해주세요'
            ]"
          />

          <q-input
            v-model="form.description"
            type="textarea"
            label="설명 (선택사항)"
            outlined
            rows="3"
          />

          <!-- 수정 모드일 때 추가 정보 표시 -->
          <div v-if="isEdit && form.createdAt" class="text-caption text-grey-6">
            생성일: {{ formatDate(form.createdAt) }}
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="취소" @click="closeDialog" />
        <q-btn
          flat
          :label="isEdit ? '수정' : '저장'"
          type="submit"
          @click="onSubmit"
          :loading="loading"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  modelValue: Boolean,
  item: Object,
  isEdit: Boolean
});

const emit = defineEmits(['update:modelValue', 'save']);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const formRef = ref(null);
const loading = ref(false);

const form = ref({
  id: null,
  department: '',
  amount: null,
  year: new Date().getFullYear(),
  description: '',
  createdAt: null
});

const departmentOptions = [
  '영업부',
  '마케팅부',
  '개발부',
  '인사부',
  '재무부',
  '총무부',
  '기획부'
];

// 폼 초기화
const resetForm = () => {
  form.value = {
    id: null,
    department: '',
    amount: null,
    year: new Date().getFullYear(),
    description: '',
    createdAt: null
  };
};

// 아이템 변경 시 폼 업데이트
watch(
  () => props.item,
  (newItem) => {
    if (newItem && props.isEdit) {
      // 수정 모드일 때 모든 데이터 복사
      form.value = {
        ...newItem,
        // 숫자형 필드는 확실히 숫자로 변환
        amount: Number(newItem.amount),
        year: Number(newItem.year)
      };
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

// 다이얼로그 열림/닫힘 감지
watch(dialog, (newVal) => {
  if (!newVal) {
    resetForm();
    loading.value = false;
  }
});

// 폼 제출
const onSubmit = async () => {
  // 폼 유효성 검사
  const isValid = await formRef.value?.validate();
  if (!isValid) return;

  loading.value = true;

  try {
    const formData = { ...form.value };

    // 수정 모드일 때 ID가 있는지 확인
    if (props.isEdit && !formData.id) {
      throw new Error('수정할 항목의 ID가 없습니다.');
    }

    emit('save', formData);
  } catch (error) {
    console.error('폼 제출 오류:', error);
    loading.value = false;
  }
};

// 다이얼로그 닫기
const closeDialog = () => {
  dialog.value = false;
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('ko-KR');
};
</script>
