/**
 * POST /api/auth
 * Verify admin password against Cloudflare secret variable.
 * Returns a JWT-like token (simple signed token) on success.
 */

// Simple token signing (for static site purposes)
// In production, use a proper JWT library
function createToken(secret) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: 'admin',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400, // 24 hours
  }));
  const signature = btoa(header + '.' + payload + '.' + secret);
  return header + '.' + payload + '.' + signature;
}

export async function onRequest(context) {
  const { request, env } = context;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { password } = await request.json();

    // Get admin password from environment variable (Cloudflare secret)
    const adminPassword = env.ADMIN_PASSWORD || 'admin123';

    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ error: '密码错误' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create a simple token
    const token = createToken(env.ADMIN_PASSWORD || 'admin123');

    return new Response(JSON.stringify({ token, success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}