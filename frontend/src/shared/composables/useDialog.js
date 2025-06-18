import { markRaw } from 'vue';
import { useQuasar } from 'quasar';

export function useDialog() {
  const $q = useQuasar();

  /**
   * 확인 다이얼로그를 표시합니다
   * @param {Object} options - 다이얼로그 옵션
   * @param {string} options.title - 제목 (기본값: '확인')
   * @param {string} options.message - 메시지 내용 (기본값: '')
   * @param {string} options.okLabel - 확인 버튼 라벨 (기본값: '확인')
   * @param {string} options.cancelLabel - 취소 버튼 라벨 (기본값: '취소')
   * @param {boolean} options.persistent - 외부 클릭으로 닫히지 않음 (기본값: false)
   * @returns {Promise<boolean>} - 사용자가 확인을 눌렀을 경우 true, 취소를 눌렀을 경우 false
   */
  const confirm = (options = {}) => {
    const {
      title = '확인',
      message = '',
      okLabel = '확인',
      cancelLabel = '취소',
      persistent = false,
      color = 'primary',
      html = false
    } = options;

    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        persistent,
        html,
        ok: {
          color,
          label: okLabel,
          flat: false
        },
        cancel: {
          label: cancelLabel,
          flat: true
        }
      })
        .onOk(() => {
          resolve(true);
        })
        .onCancel(() => {
          resolve(false);
        })
        .onDismiss(() => {
          resolve(false);
        });
    });
  };

  /**
   * 알림 다이얼로그를 표시합니다
   * @param {Object} options - 다이얼로그 옵션
   * @param {string} options.title - 제목 (기본값: '알림')
   * @param {string} options.message - 메시지 내용 (기본값: '')
   * @param {string} options.okLabel - 확인 버튼 라벨 (기본값: '확인')
   * @returns {Promise<boolean>} - 사용자가 확인을 눌렀을 경우 true
   */
  const alert = (options = {}) => {
    const {
      title = '알림',
      message = '',
      okLabel = '확인',
      persistent = false,
      color = 'primary',
      html = false
    } = options;

    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        persistent,
        html,
        ok: {
          color,
          label: okLabel,
          flat: false
        }
      })
        .onOk(() => {
          resolve(true);
        })
        .onDismiss(() => {
          resolve(true);
        });
    });
  };

  /**
   * 커스텀 컴포넌트를 다이얼로그로 표시합니다
   * @param {Object} options - 다이얼로그 옵션
   * @param {Object} options.component - 표시할 Vue 컴포넌트
   * @param {Object} options.componentProps - 컴포넌트에 전달할 props
   * @param {boolean} options.persistent - 외부 클릭으로 닫히지 않음 (기본값: false)
   * @returns {Promise<any>} - 컴포넌트가 반환하는 데이터
   */
  const custom = (options = {}) => {
    const {
      component,
      componentProps = {},
      persistent = false,
      maximized = false,
      fullWidth = false,
      fullHeight = false
    } = options;

    if (!component) {
      console.error('Component is required for custom dialog');
      return Promise.reject('Component is required');
    }

    return new Promise((resolve) => {
      $q.dialog({
        component: markRaw(component),
        componentProps: {
          ...componentProps,
          onDialogOk: (payload) => {
            resolve(payload);
          },
          onDialogCancel: () => {
            resolve(null);
          },
          onDialogHide: () => {
            resolve(null);
          }
        },
        persistent,
        maximized,
        fullWidth,
        fullHeight
      })
        .onOk((data) => {
          resolve(data);
        })
        .onCancel(() => {
          resolve(null);
        })
        .onDismiss(() => {
          resolve(null);
        });
    });
  };

  /**
   * 프롬프트 다이얼로그를 표시합니다
   * @param {Object} options - 다이얼로그 옵션
   * @returns {Promise<string|null>} - 사용자 입력 값 또는 취소시 null
   */
  const prompt = (options = {}) => {
    const {
      title = '입력',
      message = '',
      value = '',
      type = 'text',
      okLabel = '확인',
      cancelLabel = '취소',
      hint = '',
      placeholder = '',
      color = 'primary',
      persistent = false
    } = options;

    return new Promise((resolve) => {
      $q.dialog({
        title,
        message,
        prompt: {
          model: value,
          type,
          isValid: true,
          hint,
          placeholder
        },
        ok: {
          color,
          label: okLabel,
          flat: false
        },
        cancel: {
          label: cancelLabel,
          flat: true
        }
      })
        .onOk((data) => {
          resolve(data);
        })
        .onCancel(() => {
          resolve(null);
        })
        .onDismiss(() => {
          resolve(null);
        });
    });
  };

  return {
    confirm,
    alert,
    custom,
    prompt
  };
}
