// SalesList.vue
<template>
  <div>
    <h2>매출 목록</h2>
    <div v-if="loading">로딩 중...</div>
    <div v-else-if="error">에러: {{ error }}</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>부서</th>
            <th>금액</th>
            <th>연도</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(sale, index) in salesList" :key="index">
            <td>{{ sale.department }}</td>
            <td>{{ sale.amount }}</td>
            <td>{{ sale.year }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { salesService } from '/services/api.js';
import Sales from '/models/Sales.js';

export default {
  setup() {
    const salesList = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const fetchSalesList = async () => {
      try {
        loading.value = true;
        const response = await salesService.getSalesList();

        console.log(response);
        // Spring Boot 응답 구조에 맞게 데이터 추출
        if (response.data && response.data.status === 'OK') {
          salesList.value = Sales.fromApiResponse(response.data.data);
        } else {
          throw new Error(
            response.data.message || '데이터를 가져오는데 실패했습니다.'
          );
        }
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
      error
    };
  }
};
</script>
