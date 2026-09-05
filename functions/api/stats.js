/**
 * /api/stats
 * Preheat 标签点击 + 产品访问统计（Cloudflare KV）
 *
 * GET  /api/stats              — 获取聚合统计（公开）
 * POST /api/stats              — 计数 +1（公开）
 *      body: { productId }     — 传 productId 时给对应产品访问量 +1，否则 Preheat +1
 *
 * KV keys: preheat_clicks, product_clicks
 */

const KV_PREHEAT = 'preheat_clicks';
const KV_PRODUCTS = 'product_clicks';

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

async function putKV(env, key, value) {
  try {
    await env.PRODUCTS_KV.put(key, JSON.stringify(value));
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
      const preheatClicks = await getKV(env, KV_PREHEAT, 0);
      const productClicks = await getKV(env, KV_PRODUCTS, {});
      return new Response(JSON.stringify({
        preheatClicks: Number.isFinite(preheatClicks) ? preheatClicks : 0,
        productClicks: productClicks && typeof productClicks === 'object' ? productClicks : {},
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method === 'POST') {
      let productId = '';
      try {
        const body = await request.json().catch(() => null);
        productId = (body && body.productId) || '';
      } catch {
        productId = '';
      }
      productId = String(productId || '').trim();

      // 产品访问计数
      if (productId) {
        const map = await getKV(env, KV_PRODUCTS, {});
        const next = (Number(map[productId]) || 0) + 1;
        map[productId] = next;
        await putKV(env, KV_PRODUCTS, map);
        return new Response(JSON.stringify({ productClicks: map, productId, count: next }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Preheat 点击计数
      const current = await getKV(env, KV_PREHEAT, 0);
      const next = (Number.isFinite(current) ? current : 0) + 1;
      await putKV(env, KV_PREHEAT, next);
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
