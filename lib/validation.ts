export const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

export function looksLikeUrl(value: string) {
  if (!value.trim()) return false;
  if (/^https?:\/\//i.test(value.trim())) return true;
  return /\./.test(value);
}

