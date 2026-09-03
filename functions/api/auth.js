/**
 * POST /api/auth
 * 管理员登录：前端传入 SHA-256 哈希后的密码，服务端对 ADMIN_PASSWORD 哈希后比对。
 * 通过后签发 HS256 JWT（默认 24 小时有效）。
 * 内置暴力破解防护：同一 IP 连续失败 MAX_ATTEMPTS 次后锁定 LOCK_MINUTES 分钟（基于 KV 计数）。
 */

import { sha256, createToken } from './_lib/auth.js';

const MAX_ATTEMPTS = 5;   // 允许的连续失败次数
const LOCK_MINUTES = 15;  // 达到上限后的锁定分钟数
const LOCK_MS = LOCK_MINUTES * 60 * 1000;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function getClientIp(request) {
  return request.headers.get('CF-Connecting-IP') || 'unknown';
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const ip = getClientIp(request);
  const failKey = `login_fail_${ip}`;
  const kv = env.PRODUCTS_KV;

  try {
    const { password } = await request.json();
    if (!password) {
      return json({ error: '密码不能为空' }, 400);
    }

    // —— 暴力破解防护：读取当前失败记录，判断是否处于锁定期 ——
    let fail = null;
    try {
      fail = (await kv.get(failKey, 'json')) || null;
    } catch {
      /* KV 未绑定（本地开发），跳过限流 */
    }

    if (fail && fail.lockUntil && fail.lockUntil > Date.now()) {
      const remainMin = Math.ceil((fail.lockUntil - Date.now()) / 60000);
      return json({ error: `尝试次数过多，请 ${remainMin} 分钟后再试` }, 429);
    }
    // 锁定已过期则清空记录重新计数
    if (fail && fail.lockUntil && fail.lockUntil <= Date.now()) {
      fail = null;
    }

    // —— 密码比对（对 ADMIN_PASSWORD 哈希后与前端哈希比较）——
    const adminPassword = env.ADMIN_PASSWORD || 'admin123';
    const adminPasswordHash = await sha256(adminPassword);

    if (password !== adminPasswordHash) {
      const count = (fail ? fail.count : 0) + 1;
      if (count >= MAX_ATTEMPTS) {
        try {
          await kv.put(failKey, JSON.stringify({ count, lockUntil: Date.now() + LOCK_MS }));
        } catch { /* ignore */ }
        return json({ error: `密码错误，连续失败 ${MAX_ATTEMPTS} 次已锁定 ${LOCK_MINUTES} 分钟` }, 429);
      }
      try {
        await kv.put(failKey, JSON.stringify({ count, lockUntil: null }));
      } catch { /* ignore */ }
      return json({ error: `密码错误，还剩 ${MAX_ATTEMPTS - count} 次尝试机会` }, 401);
    }

    // —— 登录成功：清除失败记录并签发令牌 ——
    try {
      await kv.delete(failKey);
    } catch { /* ignore */ }

    const token = await createToken(adminPassword);
    return json({ token, success: true }, 200);
  } catch (err) {
    return json({ error: 'Internal server error' }, 500);
  }
}
