/**
 * 共享认证工具：真正的 HS256 JWT（HMAC-SHA256）签发、验签与过期校验。
 * 目录以 `_` 开头，不会被 Pages Functions 当作路由，仅作为模块被导入。
 */

const enc = new TextEncoder();

/** SHA-256 十六进制哈希 */
export async function sha256(str) {
  const data = enc.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** HMAC-SHA256 十六进制签名 */
export async function hmacSha256(secret, data) {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Base64URL 编码（JWT 标准） */
export function base64UrlEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Base64URL 解码（JWT 标准） */
export function base64UrlDecode(str) {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const b64 = padded + '='.repeat((4 - (padded.length % 4)) % 4);
  return atob(b64);
}

/** 签发管理员令牌（HS256 JWT，默认 24 小时有效） */
export async function createToken(secret, ttlSeconds = 86400) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    sub: 'admin',
    iat: now,
    exp: now + ttlSeconds,
  }));
  const signature = await hmacSha256(secret, `${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

/**
 * 校验 Bearer 令牌：
 * 1. 格式必须为三段 base64url
 * 2. 签名必须与 HMAC-SHA256(secret, header.payload) 一致
 * 3. exp 必须存在且未过期
 */
export async function verifyToken(authHeader, secret) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const token = authHeader.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [header, payload, signature] = parts;

  let expected;
  try {
    expected = await hmacSha256(secret, `${header}.${payload}`);
  } catch {
    return false;
  }
  if (signature !== expected) return false;

  try {
    const decoded = JSON.parse(base64UrlDecode(payload));
    if (!decoded.exp || decoded.exp * 1000 <= Date.now()) return false;
  } catch {
    return false;
  }
  return true;
}
