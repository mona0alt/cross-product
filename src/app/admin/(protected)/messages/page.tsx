import React from 'react';

import { AdminSectionHeader } from '@/components/admin/admin-section-header';
import { MessageTable } from '@/components/admin/message-table';

const mockMessages = [
  {
    id: '1',
    name: '张明远',
    email: 'zhang.my@example.com',
    content: '您好，我对贵公司的智能照明系统很感兴趣，想了解是否可以支持 HomeKit 集成？我们办公室大概有 200 平米，需要定制方案。',
    status: '待处理',
    createdAt: new Date('2026-05-04T09:23:00'),
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah.c@design.co',
    content: '我们的设计团队非常喜欢 Lumina 的产品线，想询问批量采购的折扣政策。预计首批订单 50 套。',
    status: '已处理',
    createdAt: new Date('2026-05-03T16:45:00'),
  },
  {
    id: '3',
    name: '李建国',
    email: 'li.jianguo@tech.cn',
    content: '昨天收到的灯具有一个不亮，订单号是 #LD-2026-0442，请协助处理退换货事宜。',
    status: '待处理',
    createdAt: new Date('2026-05-03T11:20:00'),
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.w@studio.uk',
    content: '请问你们的新款吊灯是否支持调光？我需要用在摄影工作室，对色温稳定性要求比较高。',
    status: '已处理',
    createdAt: new Date('2026-05-02T14:10:00'),
  },
  {
    id: '5',
    name: '王芳',
    email: 'wang.fang@home.com',
    content: '客服回复很及时，问题已经解决。产品质感超出预期，会继续回购。',
    status: '已处理',
    createdAt: new Date('2026-05-01T20:33:00'),
  },
  {
    id: '6',
    name: 'Marcus Johnson',
    email: 'marcus.j@arch.de',
    content: '作为建筑事务所，我们正在为一家精品酒店选择照明方案。能否安排一次产品演示？',
    status: '待处理',
    createdAt: new Date('2026-05-01T08:15:00'),
  },
  {
    id: '7',
    name: '陈思琪',
    email: 'chen.siqi@student.edu',
    content: '学生党预算有限，想问问有没有适合宿舍使用的小台灯推荐？希望能护眼。',
    status: '已处理',
    createdAt: new Date('2026-04-30T19:50:00'),
  },
  {
    id: '8',
    name: 'Roberto Silva',
    email: 'roberto.s@light.br',
    content: '我们是巴西的经销商，有兴趣代理贵司产品在拉美市场的销售，请发送合作资料包。',
    status: '待处理',
    createdAt: new Date('2026-04-30T10:05:00'),
  },
];

export default function AdminMessagesPage() {
  return (
    <section className="space-y-6">
      <AdminSectionHeader
        label="Support"
        title="支持中心"
        description="管理客户查询与留言工单。"
      />
      <MessageTable messages={mockMessages} />
    </section>
  );
}
