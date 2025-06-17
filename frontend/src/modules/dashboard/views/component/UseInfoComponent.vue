<template>
  <q-dialog v-model="dialog" persistent>
    <q-card style="min-width: 400px">
      <q-card-section>
        <div class="text-h6">
          {{ isEdit ? '매출 수정' : '매출 추가' }}
        </div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit="onSubmit" class="q-gutter-md">
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
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="취소" @click="closeDialog" />
        <q-btn
          flat
          :label="isEdit ? '수정' : '저장'"
          type="submit"
          @click="onSubmit"
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

const form = ref({
  department: '',
  amount: null,
  year: new Date().getFullYear(),
  description: ''
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
    department: '',
    amount: null,
    year: new Date().getFullYear(),
    description: ''
  };
};

// 아이템 변경 시 폼 업데이트
watch(
  () => props.item,
  (newItem) => {
    if (newItem) {
      form.value = { ...newItem };
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
  }
});

// 폼 제출
const onSubmit = () => {
  const formData = { ...form.value };
  if (props.isEdit && props.item?.id) {
    formData.id = props.item.id;
  }
  emit('save', formData);
};

// 다이얼로그 닫기
const closeDialog = () => {
  dialog.value = false;
};
</script>
