import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';

import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const uploadsRoot = resolve(process.cwd(), 'public', 'uploads');
const uploadsRootPrefix = `${uploadsRoot}${sep}`;
const contentTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return null;
  }
}

function isNonNullString(value: string | null): value is string {
  return value !== null;
}

function getSafeUploadFilePath(pathSegments: string[]) {
  if (pathSegments.length === 0) {
    return null;
  }

  const decodedSegments = pathSegments.map(decodeSegment);
  if (!decodedSegments.every(isNonNullString)) {
    return null;
  }

  if (
    decodedSegments.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        segment.includes('/') ||
        segment.includes('\\')
    )
  ) {
    return null;
  }

  const filePath = resolve(uploadsRoot, ...decodedSegments);

  if (filePath !== uploadsRoot && !filePath.startsWith(uploadsRootPrefix)) {
    return null;
  }

  return filePath;
}

function getUploadContentType(filePath: string) {
  return contentTypes[extname(filePath).toLowerCase()] ?? 'application/octet-stream';
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> }
) {
  const { path } = await context.params;
  const filePath = getSafeUploadFilePath(path);

  if (!filePath) {
    return new NextResponse('Not Found', { status: 404 });
  }

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile()) {
      return new NextResponse('Not Found', { status: 404 });
    }

    const fileBuffer = await readFile(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'content-length': String(fileBuffer.byteLength),
        'content-type': getUploadContentType(filePath),
        'cache-control': 'public, max-age=31536000, immutable'
      }
    });
  } catch {
    return new NextResponse('Not Found', { status: 404 });
  }
}
