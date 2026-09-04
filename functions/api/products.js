/**
 * /api/products
 * CRUD for products using Cloudflare KV (PRODUCTS_KV).
 *
 * GET    /api/products          — List all products
 * POST   /api/products          — Add a new product (auth required)
 * PUT    /api/products?id=xxx   — Update a product (auth required)
 * DELETE /api/products?id=xxx   — Delete a product (auth required)
 */

import { verifyToken } from './_lib/auth.js';

const AUTH_HEADER = 'Authorization';

function getSecret(env) {
  return env.ADMIN_PASSWORD || 'admin123';
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

async function getProducts(env) {
  // Try KV first, fallback to empty array
  try {
    const data = await env.PRODUCTS_KV.get('products', 'json');
    return data || [];
  } catch {
    // KV not bound, return empty
    return [];
  }
}

async function saveProducts(env, products) {
  try {
    await env.PRODUCTS_KV.put('products', JSON.stringify(products));
  } catch {
    // KV not bound, silently fail
  }
}

export async function onRequest(context) {
  const { request, env } = context;

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  try {
    // GET — List all products
    if (request.method === 'GET') {
      const products = await getProducts(env);
      return new Response(JSON.stringify({ products }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST, PUT, DELETE — require auth
    if (!(await verifyToken(request.headers.get(AUTH_HEADER), getSecret(env)))) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // POST — Add a new product
    if (request.method === 'POST') {
      const { product } = await request.json();
      if (!product || !product.name) {
        return new Response(JSON.stringify({ error: 'Product name is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const products = await getProducts(env);
      products.push(product);
      await saveProducts(env, products);

      return new Response(JSON.stringify({ product, success: true }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // PUT — Update a product
    if (request.method === 'PUT') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'Product ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { product } = await request.json();
      const products = await getProducts(env);
      const idx = products.findIndex(p => p.id === id);

      if (idx === -1) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      products[idx] = { ...products[idx], ...product };
      await saveProducts(env, products);

      return new Response(JSON.stringify({ product: products[idx], success: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // DELETE — Delete a product
    if (request.method === 'DELETE') {
      if (!id) {
        return new Response(JSON.stringify({ error: 'Product ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let products = await getProducts(env);
      const filtered = products.filter(p => p.id !== id);

      if (filtered.length === products.length) {
        return new Response(JSON.stringify({ error: 'Product not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      await saveProducts(env, filtered);

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