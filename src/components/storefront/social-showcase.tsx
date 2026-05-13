/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

const tabs = [
  { key: 'windowRobots' },
  { key: 'drones' },
  { key: 'humanoidRobots' },
  { key: 'vacuumRobots' },
  { key: 'scenes' }
] as const;

type SocialTabKey = (typeof tabs)[number]['key'];

type FeedPost = {
  imageUrl: string;
  platform: 'Instagram' | 'YouTube' | 'LinkedIn' | 'Facebook';
  publishedAt: string;
  title: string;
};

const feedPosts: Record<SocialTabKey, FeedPost[]> = {
  windowRobots: [
    {
      imageUrl: '/show/local-unsplash/photo-1581091226825-a6a2a5aee158.jpg',
      platform: 'Instagram',
      publishedAt: 'May 08',
      title: '高层玻璃连续清洁演示'
    },
    {
      imageUrl: '/show/robot_window_cleaner.png',
      platform: 'YouTube',
      publishedAt: 'May 06',
      title: '家用擦窗机器人安装短片'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1581092160562-40aa08e78837.jpg',
      platform: 'LinkedIn',
      publishedAt: 'May 03',
      title: '酒店项目交付案例回顾'
    },
    {
      imageUrl: '/show/robot_window_cleaner.png',
      platform: 'Facebook',
      publishedAt: 'Apr 29',
      title: '售后维护与日常保养建议'
    }
  ],
  drones: [
    {
      imageUrl: '/show/local-unsplash/photo-1473968512647-3e447244af8f.jpg',
      platform: 'Instagram',
      publishedAt: 'May 10',
      title: '航拍无人机城市穿越镜头'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1507582020474-9a35b7d455d9.jpg',
      platform: 'YouTube',
      publishedAt: 'May 05',
      title: '工业巡检飞行任务实录'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1527977966376-1c8408f9f108.jpg',
      platform: 'LinkedIn',
      publishedAt: 'May 01',
      title: '物流无人机测试站点更新'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1579829366248-204fe8413f31.jpg',
      platform: 'Facebook',
      publishedAt: 'Apr 26',
      title: '展会现场试飞精彩片段'
    }
  ],
  humanoidRobots: [
    {
      imageUrl: '/show/local-unsplash/photo-1485827404703-89b55fcc595e.jpg',
      platform: 'Instagram',
      publishedAt: 'May 11',
      title: '人形机器人步态训练日志'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1531746790731-6c087fecd65a.jpg',
      platform: 'YouTube',
      publishedAt: 'May 07',
      title: '展厅接待场景交互演示'
    },
    {
      imageUrl: '/show/robot_humanoid.png',
      platform: 'LinkedIn',
      publishedAt: 'May 04',
      title: '科研合作项目阶段成果'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1581092160562-40aa08e78837.jpg',
      platform: 'Facebook',
      publishedAt: 'Apr 30',
      title: '新版本动作控制片段发布'
    }
  ],
  vacuumRobots: [
    {
      imageUrl: '/show/local-unsplash/photo-1518640467707-6811f4a6ab73.jpg',
      platform: 'Instagram',
      publishedAt: 'May 09',
      title: '地毯与硬地双场景清扫实拍'
    },
    {
      imageUrl: '/show/robot_floor_cleaner.png',
      platform: 'YouTube',
      publishedAt: 'May 06',
      title: '新一代吸尘路径规划展示'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1581091226825-a6a2a5aee158.jpg',
      platform: 'LinkedIn',
      publishedAt: 'May 02',
      title: '家居渠道用户反馈摘录'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1600585154340-be6161a56a0c.jpg',
      platform: 'Facebook',
      publishedAt: 'Apr 28',
      title: '安静模式夜间清扫片段'
    }
  ],
  scenes: [
    {
      imageUrl: '/show/local-unsplash/photo-1550751827-4bd374c3f58b.jpg',
      platform: 'Instagram',
      publishedAt: 'May 12',
      title: '机器人应用场景精选图集'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1518770660439-4636190af475.jpg',
      platform: 'YouTube',
      publishedAt: 'May 08',
      title: '工程现场自动化部署剪影'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1526374965328-7f61d4dc18c5.jpg',
      platform: 'LinkedIn',
      publishedAt: 'May 05',
      title: '海外客户拜访纪要节选'
    },
    {
      imageUrl: '/show/local-unsplash/photo-1451187580459-43490279c0fa.jpg',
      platform: 'Facebook',
      publishedAt: 'Apr 27',
      title: '团队幕后与展台搭建记录'
    }
  ]
};

export function SocialShowcase({
  copy
}: {
  copy: {
    title: string;
    handle: string;
    tabs: Record<(typeof tabs)[number]['key'], string>;
  };
}) {
  const [activeTab, setActiveTab] = useState<SocialTabKey>('windowRobots');
  const activeFeedPosts = feedPosts[activeTab] ?? feedPosts.windowRobots;

  return (
    <section className="bg-[var(--mk-bg)] py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--mk-highlight)]">
              SOCIAL MEDIA
            </p>
            <h2 className="mk-display-font mt-2 text-3xl font-semibold text-[var(--mk-accent)]">
              {copy.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--mk-text-muted)]">{copy.handle}</p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              aria-pressed={activeTab === tab.key}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
                activeTab === tab.key
                  ? 'bg-[var(--mk-accent)] text-white'
                  : 'border border-[var(--mk-border)] bg-white/60 text-[var(--mk-text)] hover:bg-white'
              }`}
            >
              {copy.tabs[tab.key]}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto pb-2">
          <div className="grid min-w-[940px] gap-5 md:grid-cols-4">
            {activeFeedPosts.map((post, index) => (
              <article
                key={`${activeTab}-${index}`}
                className="group relative aspect-[9/16] overflow-hidden rounded-[22px] border border-[var(--mk-border)] bg-[var(--mk-bg-muted)] shadow-[0_20px_48px_rgba(112,89,81,0.12)] transition duration-500 hover:-translate-y-1"
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/88 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--mk-accent)] backdrop-blur">
                  {post.platform}
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#201a19]/88 via-[#705951]/35 to-transparent p-4 pt-16 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ffe088]">
                    {post.publishedAt} · {copy.handle}
                  </p>
                  <h3 className="mk-display-font mt-2 text-lg font-semibold leading-tight">
                    {post.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
