import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const createdPaths: string[] = [];

async function createUploadedFile(relativePath: string, contents: Uint8Array) {
  const filePath = join(process.cwd(), 'public', 'uploads', relativePath);
  const directory = dirname(filePath);

  await mkdir(directory, { recursive: true });
  await writeFile(filePath, contents);
  createdPaths.push(filePath);

  return filePath;
}

describe('uploads route', () => {
  afterEach(async () => {
    await Promise.all(
      createdPaths.splice(0).map((filePath) =>
        rm(filePath, { force: true }).catch(() => undefined)
      )
    );
  });

  it('serves an uploaded product image that appears after the route module is loaded', async () => {
    const { GET } = await import('@/app/uploads/[...path]/route');
    const relativePath = 'products/2099/01/runtime-upload-test.png';
    const contents = new Uint8Array([137, 80, 78, 71]);

    await createUploadedFile(relativePath, contents);

    const response = await GET(new Request('http://localhost/uploads/products/2099/01/runtime-upload-test.png'), {
      params: Promise.resolve({
        path: ['products', '2099', '01', 'runtime-upload-test.png']
      })
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('image/png');
    expect(new Uint8Array(await response.arrayBuffer())).toEqual(contents);
  });

  it('returns 404 for missing uploaded images', async () => {
    const { GET } = await import('@/app/uploads/[...path]/route');

    const response = await GET(new Request('http://localhost/uploads/products/2099/01/missing.png'), {
      params: Promise.resolve({
        path: ['products', '2099', '01', 'missing.png']
      })
    });

    expect(response.status).toBe(404);
  });

  it('rejects path traversal attempts', async () => {
    const { GET } = await import('@/app/uploads/[...path]/route');
    const secretPath = join(process.cwd(), 'public', 'logo.jpg');
    const secretContents = await readFile(secretPath);

    const response = await GET(new Request('http://localhost/uploads/../logo.jpg'), {
      params: Promise.resolve({
        path: ['..', 'logo.jpg']
      })
    });

    expect(response.status).toBe(404);
    expect(secretContents.length).toBeGreaterThan(0);
  });
});
