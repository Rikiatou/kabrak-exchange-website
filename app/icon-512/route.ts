import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="100" fill="#0B6E4F"/>
  <rect x="32" y="32" width="448" height="448" rx="72" fill="#071a12"/>
  <text x="256" y="300" font-family="Arial,sans-serif" font-size="220" font-weight="900" text-anchor="middle" fill="#e8a020">💱</text>
  <text x="256" y="410" font-family="Arial,sans-serif" font-size="52" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="6">KABRAK</text>
  <text x="256" y="460" font-family="Arial,sans-serif" font-size="24" font-weight="500" text-anchor="middle" fill="#0B6E4F" letter-spacing="3">EXCHANGE PRO</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
