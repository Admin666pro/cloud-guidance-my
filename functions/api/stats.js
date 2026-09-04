/**
 * /api/stats
 * Preheat 标签点击计数（Cloudflare KV）
 *
 * GET  /api/stats  — 获取累计点击次数（公开）
 * POST /api/stats  — 点击次数 +1（公开）
 *
 * KV key: preheat_clicks
 */

const KV_KEY = 'preheat_clicks';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function getClicks(env) {
  try {
    const n = await env.PRODUCTS_KV.get(KV_KEY, 'json');
    return Number.isFinite(n) ? n : 0;
  } catch {
    // KV not bound
    return 0;
  }
}

async function saveClicks(env, n) {
  try {
    await env.PRODUCTS_KV.put(KV_KEY, JSON.stringify(n));
  } catch {
    // KV not bound, silently fail
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    if (request.method === 'GET') {
      const preheatClicks = await getClicks(env);
      return new Response(JSON.stringify({ preheatClicks }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      const current = await getClicks(env);
      const next = current + 1;
      await saveClicks(env, next);
      return new Response(JSON.stringify({ preheatClicks: next }), {
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
