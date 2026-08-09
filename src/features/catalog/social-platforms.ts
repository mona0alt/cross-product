// 社媒平台注册表:新建社媒卡片时写入 platform 列的默认值从这里取(卡片本身已不再区分平台)。
// 新增平台只需在这里加一项。
export const socialPlatforms = [
  { key: 'facebook', label: 'Facebook' },
  { key: 'instagram', label: 'Instagram' }
] as const;

export type SocialPlatformKey = (typeof socialPlatforms)[number]['key'];
