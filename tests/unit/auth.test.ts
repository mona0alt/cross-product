import { describe, expect, it } from 'vitest';

import { hashPassword, isValidAdminPassword } from '@/lib/auth';

describe('admin auth', () => {
  it('hashes passwords and validates matching credentials', async () => {
    const hash = await hashPassword('ChangeMe123!');

    await expect(isValidAdminPassword('ChangeMe123!', hash)).resolves.toBe(true);
    await expect(isValidAdminPassword('WrongPassword!', hash)).resolves.toBe(false);
  });
});
