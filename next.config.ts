import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';

function buildSecurityHeaders() {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    isDev ? "'unsafe-eval'" : null, // React requer eval() em dev para debugging
    'challenges.cloudflare.com',
  ]
    .filter(Boolean)
    .join(' ');

  return [
    {
      key: 'Strict-Transport-Security',
      value: 'max-age=63072000; includeSubDomains; preload',
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff',
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin',
    },
    {
      key: 'X-Frame-Options',
      value: 'SAMEORIGIN',
    },
    {
      key: 'Content-Security-Policy',
      value: [
        "default-src 'self'",
        `script-src ${scriptSrc}`,
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
        "font-src 'self'",
        "frame-src challenges.cloudflare.com",
        "connect-src 'self' challenges.cloudflare.com ws://localhost:* wss://localhost:*",
      ].join('; '),
    },
  ];
}

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: buildSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
