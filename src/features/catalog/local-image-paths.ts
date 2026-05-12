export function getLocalImagePath(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue.startsWith('/') || trimmedValue.startsWith('//')) {
    return null;
  }

  return trimmedValue;
}

export function requireLocalImagePath(value: string, key: string) {
  const localImagePath = getLocalImagePath(value);

  if (!localImagePath) {
    throw new Error(`INVALID_LOCAL_${key}`);
  }

  return localImagePath;
}
