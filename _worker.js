const SITE_HOST = "vizeerasmus.com";
const SITE_ORIGIN = `https://${SITE_HOST}`;

function cleanPath(pathname) {
  let path = pathname || "/";
  path = path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  path = path.replace(/\/{2,}/g, "/");
  if (!path.startsWith("/")) path = `/${path}`;
  return path || "/";
}

function canonicalUrl(url) {
  const path = cleanPath(url.pathname);
  return `${SITE_ORIGIN}${path === "/" ? "/" : path}`;
}

function replaceSeoUrl(html, canonical) {
  let body = html;
  const canonicalTag = `<link rel="canonical" href="${canonical}">`;
  const ogUrlTag = `<meta property="og:url" content="${canonical}">`;

  if (/<link\s+[^>]*rel=["']canonical["'][^>]*>/i.test(body)) {
    body = body.replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    body = body.replace(/<head([^>]*)>/i, `<head$1>${canonicalTag}`);
  }

  if (/<meta\s+[^>]*property=["']og:url["'][^>]*>/i.test(body)) {
    body = body.replace(/<meta\s+[^>]*property=["']og:url["'][^>]*>/i, ogUrlTag);
  } else {
    body = body.replace(/<head([^>]*)>/i, `<head$1>${ogUrlTag}`);
  }

  return body;
}


// Cloudflare's SPA asset fallback can return index.html with HTTP 200 for a
// nonexistent URL. Keep the original canonical long enough to detect that case;
// otherwise rewriting it would manufacture an indexable duplicate homepage.
function isHomepageFallback(html, pathname) {
  if (cleanPath(pathname) === "/") return false;
  const tag = html.match(/<link\b[^>]*\brel=["']canonical["'][^>]*>/i);
  const href = tag && tag[0].match(/\bhref=["']([^"']+)["']/i);
  if (!href) return false;
  try { return cleanPath(new URL(href[1], SITE_ORIGIN).pathname) === "/"; }
  catch { return false; }
}
function notFoundResponse(headers) {
  headers.set("Content-Type", "text/html; charset=utf-8");
  headers.set("X-Robots-Tag", "noindex, follow");
  headers.set("Cache-Control", "no-store");
  headers.set("X-SEO-Not-Found", "homepage-fallback");
  headers.delete("content-length");
  headers.delete("etag");
  headers.delete("Link");
  return new Response('<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>Sayfa Bulunamadı</title><main style="max-width:42rem;margin:12vh auto;padding:24px;font-family:system-ui"><h1>Sayfa bulunamadı</h1><p>Aradığınız sayfa taşınmış veya mevcut olmayabilir.</p><a href="/">Ana sayfaya dön</a></main></html>', {status:404,headers});
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isCustomDomain = url.hostname === SITE_HOST || url.hostname === `www.${SITE_HOST}`;
    const path = cleanPath(url.pathname);

    // One public URL form: HTTPS + apex host + extensionless HTML paths.
    if (
      isCustomDomain &&
      (url.protocol !== "https:" || url.hostname !== SITE_HOST || path !== url.pathname)
    ) {
      const target = new URL(`${SITE_ORIGIN}${path}`);
      target.search = url.search;
      return new Response(null, {
        status: 301,
        headers: {
          Location: target.toString(),
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
          "X-VizeErasmus-Canonical-Redirect": "2026-09-17",
        },
      });
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);

    // Preview/project domains must never become competing Google URLs.
    if (url.hostname.endsWith(".pages.dev")) {
      headers.set("X-Robots-Tag", "noindex, nofollow");
    }

    if (response.status >= 400) {
      headers.set("X-Robots-Tag", "noindex, follow");
      return new Response(response.body, {status:response.status,statusText:response.statusText,headers});
    }

    const contentType = headers.get("content-type") || "";
    if (!contentType.includes("text/html")) {
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }

    const canonical = canonicalUrl(url);
    const html = await response.text();
    if (isHomepageFallback(html, url.pathname)) return notFoundResponse(headers);
    const body = replaceSeoUrl(html, canonical).replace(/src=(["'])([^"']*country-data\.js)(?:\?[^"']*)?\1/g, 'src="$2?v=20261025-seo"');
    headers.delete("content-length");
    headers.set("Link", `<${canonical}>; rel="canonical"`);

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

