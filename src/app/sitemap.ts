import type { MetadataRoute } from 'next'

import { navigation } from '@/lib/navigation'

// must match siteUrl in src/app/layout.tsx and SITE_URL in
// src/app/robots.ts
const SITE_URL = 'https://whiteout-survival-data.chiefpansancolt.dev'

function getDocRoutes(): string[] {
  const routes = new Set<string>(['/'])

  for (const section of navigation) {
    for (const link of section.links) {
      if (link.href.startsWith('/')) {
        routes.add(link.href)
      }
    }
  }

  return Array.from(routes)
}

// Generated from src/lib/navigation.ts so new doc pages are picked up
// automatically instead of drifting out of sync with a hand-maintained list.
export default function sitemap(): MetadataRoute.Sitemap {
  return getDocRoutes().map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }))
}
