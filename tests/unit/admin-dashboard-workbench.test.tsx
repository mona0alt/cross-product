import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DashboardWorkbench } from '@/components/admin/dashboard-workbench';
describe('DashboardWorkbench', () => {
  it('renders the workbench hero and todo counts', () => {
    const html = renderToStaticMarkup(
      <DashboardWorkbench
        data={{
          pendingProducts: 26,
          todayCandidates: 11,
          weeklyPace: '保持稳定',
          hotCategories: ['清洁机器人', '巡检无人机', '工业机械臂']
        }}
      />
    );

    expect(html).toContain('先处理待审核商品');
    expect(html).toContain('待审核商品');
    expect(html).toContain('今日新增候选商品');
    expect(html).toContain('新建商品');
    expect(html).toContain('发起抓取');
    expect(html).toContain('本周上新节奏');
    expect(html).toContain('热门分类');
  });
});
