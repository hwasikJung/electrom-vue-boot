import { computed } from 'vue';

// 이미지 경로를 한 곳에서 관리
const imageModules = import.meta.glob(
  '@/assets/images/**/*.{png,jpg,jpeg,gif,svg,webp}',
  {
    eager: true
  }
);

export function useImages() {
  // 이미지 경로를 키로 하는 맵 생성
  const images = computed(() => {
    const imageMap = {};

    for (const path in imageModules) {
      // '/src/assets/images/logo/logo.png' -> 'logo/logo.png'
      const imagePath = path
        .replace('/src/assets/images/', '')
        .replace(/^\//, '');
      imageMap[imagePath] = imageModules[path].default;
    }

    return imageMap;
  });

  // 특정 이미지 가져오기
  const getImage = (imagePath) => {
    return computed(() => {
      const img = images.value[imagePath];
      if (!img) {
        console.warn(`이미지를 찾을 수 없습니다: ${imagePath}`);
        return '';
      }
      return img;
    });
  };

  // 자주 사용하는 이미지들을 미리 정의
  const commonImages = computed(() => ({
    logo: images.value['logo/logo.png']
    // 다른 공통 이미지들도 여기에 추가
    // favicon: images.value['icons/favicon.ico'],
    // banner: images.value['banners/main-banner.jpg'],
  }));

  return {
    images,
    getImage,
    commonImages
  };
}
