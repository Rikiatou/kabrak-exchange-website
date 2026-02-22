import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="40" fill="#0B6E4F"/>
  <rect x="16" y="16" width="160" height="160" rx="28" fill="#071a12"/>
  <text x="96" y="115" font-family="Arial,sans-serif" font-size="80" font-weight="900" text-anchor="middle" fill="#e8a020">💱</text>
  <text x="96" y="155" font-family="Arial,sans-serif" font-size="18" font-weight="800" text-anchor="middle" fill="#ffffff" letter-spacing="2">KABRAK</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
