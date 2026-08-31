/**
 * /api/custom
 * Store and retrieve custom CSS, JS, and HTML code using Cloudflare KV.
 *
 * GET  /api/custom    — Get all custom code
 * POST /api/custom    — Save custom code by type (auth required)
 */

const AUTH_HEADER = 'Authorization';

function verifyToken(authHeader, env) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
  const secret = env.ADMIN_PASSWORD || 'admin123';
  const token = authHeader.slice(7);
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const expectedSig = btoa(parts[0] + '.' + parts[1] + '.' + secret);
  return parts[2] === expectedSig;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // GET — Retrieve all custom code
    if (request.method === 'GET') {
      let css = '', js = '', html = '';

      try {
        css = (await env.PRODUCTS_KV.get('custom_css')) || '';
        js = (await env.PRODUCTS_KV.get('custom_js')) || '';
        html = (await env.PRODUCTS_KV.get('custom_html')) || '';
      } catch {
        // KV not bound
      }

      return new Response(JSON.stringify({ css, js, html }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST — Save custom code (auth required)
    if (request.method === 'POST') {
      if (!verifyToken(request.headers.get(AUTH_HEADER), env)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { type, code } = await request.json();

      if (!type || !['css', 'js', 'html'].includes(type)) {
        return new Response(JSON.stringify({ error: 'Invalid type. Must be css, js, or html' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      try {
        await env.PRODUCTS_KV.put(`custom_${type}`, code || '');
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