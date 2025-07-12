import { NSkeleton } from 'naive-ui'

import AppCard from '../app-card/index.vue'

export default function AppSkeleton() {
  return (
    <AppCard>
      {/* 模拟标题 */}
      <NSkeleton style='width: 40%; height: 24px; margin-bottom: 12px;' sharp />

      {/* 模拟副标题 */}
      <NSkeleton style='width: 60%; height: 16px; margin-bottom: 20px;' />

      {/* 模拟图文布局 */}
      <div style='display: flex; gap: 16px; align-items: flex-start; margin-bottom: 20px;'>
        <NSkeleton circle style='width: 64px; height: 64px;' />
        <div style='flex: 1;'>
          <NSkeleton text style='width: 80%; margin-bottom: 8px;' />
          <NSkeleton text style='width: 100%; margin-bottom: 8px;' />
          <NSkeleton text style='width: 60%;' />
        </div>
      </div>

      {/* 模拟正文段落 */}
      <NSkeleton text style='width: 100%; margin-bottom: 8px;' />
      <NSkeleton text style='width: 95%; margin-bottom: 8px;' />
      <NSkeleton text style='width: 90%; margin-bottom: 8px;' />
      <NSkeleton text style='width: 60%; margin-bottom: 20px;' />

      {/* 模拟按钮区域 */}
      <div style='display: flex; gap: 12px;'>
        <NSkeleton style='width: 80px; height: 32px; border-radius: 4px;' />
        <NSkeleton style='width: 80px; height: 32px; border-radius: 4px;' />
      </div>
    </AppCard>
  )
}
