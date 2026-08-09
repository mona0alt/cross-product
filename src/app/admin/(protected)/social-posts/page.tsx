import React from 'react';

import { SocialPostCenter } from '@/components/admin/social-post-center';
import { getAdminDictionary } from '@/lib/admin-i18n';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminSocialPostsPage() {
  const [posts, { Admin }] = await Promise.all([
    db.socialPost.findMany({
      orderBy: { createdAt: 'asc' }
    }),
    getAdminDictionary()
  ]);

  return (
    <SocialPostCenter
      posts={posts}
      copy={Admin.socialPosts}
      uploadLabel={Admin.common.upload}
    />
  );
}
