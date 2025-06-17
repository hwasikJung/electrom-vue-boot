<template>
  <q-page padding>
    <!-- 헤더 섹션 -->
    <div class="q-mb-lg">
      <div class="text-h4 q-mb-md">대시보드</div>
      <div class="text-subtitle1 text-grey-8">오늘의 통계 및 활동 요약</div>
    </div>

    <!-- 통계 카드 섹션 -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">총 방문자</div>
            <div class="text-h4 q-mt-sm q-mb-xs">1,248</div>
            <div class="text-caption text-green">
              <q-icon name="arrow_upward" size="xs" />
              <span>전주 대비 8% 증가</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">신규 사용자</div>
            <div class="text-h4 q-mt-sm q-mb-xs">385</div>
            <div class="text-caption text-green">
              <q-icon name="arrow_upward" size="xs" />
              <span>전주 대비 12% 증가</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">완료된 작업</div>
            <div class="text-h4 q-mt-sm q-mb-xs">42</div>
            <div class="text-caption text-red">
              <q-icon name="arrow_downward" size="xs" />
              <span>전주 대비 5% 감소</span>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card">
          <q-card-section>
            <div class="text-subtitle2 text-grey-7">대기중인 작업</div>
            <div class="text-h4 q-mt-sm q-mb-xs">18</div>
            <div class="text-caption text-orange">
              <q-icon name="warning" size="xs" />
              <span>3개 긴급 작업</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 차트 및 활동 섹션 -->
    <div class="row q-col-gutter-md">
      <!-- 차트 섹션 -->
      <div class="col-12 col-md-8">
        <q-card>
          <q-card-section>
            <div class="text-h6">사용자 활동 추이</div>
            <div class="text-subtitle2 text-grey-7">최근 7일간의 활동 추이</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="q-pa-none">
            <div
              class="chart-container"
              style="height: 300px; position: relative"
            >
              <!-- 실제 프로젝트에서는 Chart.js 또는 다른 차트 라이브러리를 사용하세요 -->
              <div class="text-center q-pa-xl text-grey">
                <q-icon name="bar_chart" size="56px" />
                <div class="q-mt-sm">차트 데이터 렌더링 영역</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="right">
            <q-btn flat color="primary" label="상세 보기" />
            <q-btn flat color="secondary" label="보고서 다운로드" />
          </q-card-actions>
        </q-card>

        <!-- 두 번째 차트 섹션 -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">프로젝트 진행 상황</div>
            <div class="text-subtitle2 text-grey-7">진행중인 프로젝트 상태</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-item v-for="(project, index) in projects" :key="index">
              <q-item-section>
                <q-item-label>{{ project.name }}</q-item-label>
                <q-item-label caption>{{ project.description }}</q-item-label>
                <q-linear-progress
                  :value="project.progress"
                  class="q-mt-sm"
                  :color="getProgressColor(project.progress)"
                  size="10px"
                />
                <div class="row justify-between q-mt-xs">
                  <div class="text-caption">
                    완료율: {{ project.progress * 100 }}%
                  </div>
                  <div class="text-caption">기한: {{ project.dueDate }}</div>
                </div>
              </q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <!-- 활동 및 알림 섹션 -->
      <div class="col-12 col-md-4">
        <!-- 최근 활동 -->
        <q-card>
          <q-card-section>
            <div class="text-h6">최근 활동</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-avatar :color="activity.color" text-color="white">
                  <q-icon :name="activity.icon" />
                </q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ activity.title }}</q-item-label>
                <q-item-label caption>{{ activity.description }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label caption>{{ activity.time }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-card-actions align="center">
            <q-btn flat color="primary" label="모든 활동 보기" />
          </q-card-actions>
        </q-card>

        <!-- 알림 섹션 -->
        <q-card class="q-mt-md">
          <q-card-section>
            <div class="text-h6">알림</div>
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item
              v-for="(notification, index) in notifications"
              :key="index"
              clickable
              v-ripple
            >
              <q-item-section avatar>
                <q-icon :name="notification.icon" :color="notification.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ notification.message }}</q-item-label>
                <q-item-label caption>{{ notification.time }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="more_vert" color="grey">
                  <q-menu anchor="bottom right" self="top right">
                    <q-list style="min-width: 150px">
                      <q-item clickable v-close-popup>
                        <q-item-section>읽음으로 표시</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>모두 삭제</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>설정</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <q-separator />
          <q-card-actions align="center">
            <q-btn flat color="primary" label="모든 알림 보기" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';

// 프로젝트 데이터
const projects = ref([
  {
    name: '웹사이트 리뉴얼',
    description: 'Vue 및 Quasar 프레임워크를 사용한 메인 웹사이트 리뉴얼',
    progress: 0.75,
    dueDate: '2023-08-15'
  },
  {
    name: '모바일 앱 개발',
    description: '안드로이드/iOS 호환 모바일 앱 개발',
    progress: 0.45,
    dueDate: '2023-09-30'
  },
  {
    name: '데이터 마이그레이션',
    description: '레거시 시스템에서 새 데이터베이스로 마이그레이션',
    progress: 0.9,
    dueDate: '2023-07-20'
  }
]);

// 최근 활동 데이터
const recentActivities = ref([
  {
    icon: 'person_add',
    color: 'primary',
    title: '새로운 사용자 등록',
    description: '훈이님이 새로 가입했습니다.',
    time: '1시간 전'
  },
  {
    icon: 'task',
    color: 'green',
    title: '작업 완료',
    description: '홍길동님이 "UI 디자인" 작업을 완료했습니다.',
    time: '3시간 전'
  },
  {
    icon: 'comment',
    color: 'blue',
    title: '새 댓글',
    description: '이영희님이 "API 문서화" 작업에 댓글을 남겼습니다.',
    time: '5시간 전'
  },
  {
    icon: 'warning',
    color: 'orange',
    title: '긴급 작업2',
    description: '서버 접속 오류 확인 필요',
    time: '7시간 전'
  }
]);

// 알림 데이터
const notifications = ref([
  {
    icon: 'warning',
    color: 'red',
    message: '디스크 공간 부족 경고',
    time: '15분 전'
  },
  {
    icon: 'email',
    color: 'blue',
    message: '새로운 이메일 5건이 도착했습니다.',
    time: '30분 전'
  },
  {
    icon: 'event',
    color: 'green',
    message: '오후 3시 회의 일정이 추가되었습니다.',
    time: '1시간 전'
  },
  {
    icon: 'update',
    color: 'purple',
    message: '시스템 업데이트 필요',
    time: '1일 전'
  }
]);

// 프로그레스 바 색상 계산 함수
const getProgressColor = (progress) => {
  if (progress < 0.3) return 'red';
  if (progress < 0.7) return 'orange';
  return 'green';
};
</script>

<style scoped>
.dashboard-card {
  transition: all 0.3s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}
</style>
