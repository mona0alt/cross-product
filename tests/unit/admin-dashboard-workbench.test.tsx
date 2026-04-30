import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { DashboardWorkbench } from '@/components/admin/dashboard-workbench';
import { mockBackoffice } from '@/features/admin/mock-backoffice';

describe('DashboardWorkbench', () => {
  it('renders the workbench hero and todo counts', () => {
    const html = renderToStaticMarkup(
      <DashboardWorkbench data={mockBackoffice.dashboard} />
    );

    expect(html).toContain('先处理待审核商品');
    expect(html).toContain('待审核商品');
    expect(html).toContain('今日新增候选商品');
  });
});
