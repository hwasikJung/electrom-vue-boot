import { useQuasar } from 'quasar';

export function useNotify() {
  const $q = useQuasar();

  /**
   * 성공 알림을 표시합니다
   * @param {string} message - 메시지 내용
   * @param {Object} options - 추가 옵션
   */
  const success = (message, options = {}) => {
    $q.notify({
      type: 'positive',
      message,
      position: 'top',
      timeout: 3000,
      ...options
    });
  };

  /**
   * 오류 알림을 표시합니다
   * @param {string} message - 메시지 내용
   * @param {Object} options - 추가 옵션
   */
  const error = (message, options = {}) => {
    $q.notify({
      type: 'negative',
      message,
      position: 'top',
      timeout: 5000,
      ...options
    });
  };

  /**
   * 정보 알림을 표시합니다
   * @param {string} message - 메시지 내용
   * @param {Object} options - 추가 옵션
   */
  const info = (message, options = {}) => {
    $q.notify({
      type: 'info',
      message,
      position: 'top',
      timeout: 3000,
      ...options
    });
  };

  /**
   * 경고 알림을 표시합니다
   * @param {string} message - 메시지 내용
   * @param {Object} options - 추가 옵션
   */
  const warning = (message, options = {}) => {
    $q.notify({
      type: 'warning',
      message,
      position: 'top',
      timeout: 4000,
      ...options
    });
  };

  return {
    success,
    error,
    info,
    warning
  };
}
