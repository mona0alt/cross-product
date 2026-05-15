'use server';

import { db } from '@/lib/db';

export async function getAdminMessages() {
  return db.message.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      content: true,
      status: true,
      createdAt: true
    }
  });
}

export async function markMessageRead(id: string) {
  return db.message.update({
    where: { id },
    data: {
      status: 'processed',
      processedAt: new Date()
    }
  });
}

export async function deleteAdminMessage(id: string) {
  return db.message.delete({
    where: { id }
  });
}
