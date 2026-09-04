/**
 * /api/config
 * 站点全局配置 + 分类管理（Cloudflare KV）
 *
 * GET  /api/config — 获取站点配置与分类（公开）
 * POST /api/config — 保存站点配置与分类（需 auth）
 *
 * KV keys: site_config, categories
 */

import { verifyToken } from './_lib/auth.js';

const AUTH_HEADER = 'Authorization';
const KV_KEYS = {
  config: 'site_config',
  categories: 'categories',
};

function getSecret(env) {
  return env.ADMIN_PASSWORD || 'admin123';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function getKV(env, key, fallback) {
  try {
    const data = await env.PRODUCTS_KV.get(key, 'json');
    return data === null ? fallback : data;
  } catch {
    // KV not bound
    return fallback;
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      const config = await getKV(env, KV_KEYS.config, {});
      const categories = await getKV(env, KV_KEYS.categories, []);
      return new Response(JSON.stringify({ config, categories }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      if (!(await verifyToken(request.headers.get(AUTH_HEADER), getSecret(env)))) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { config, categories } = await request.json();
      try {
        await env.PRODUCTS_KV.put(KV_KEYS.config, JSON.stringify(config || {}));
        await env.PRODUCTS_KV.put(KV_KEYS.categories, JSON.stringify(Array.isArray(categories) ? categories : []));
      } catch {
        // KV not bound
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
