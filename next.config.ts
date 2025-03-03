import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ["ko", "en", "ja", "zh", "es"], // 지원할 언어 목록
    defaultLocale: "ko", // 기본 언어
  },
};

export default nextConfig;
