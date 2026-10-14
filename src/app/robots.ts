import type { MetadataRoute } from 'next'

// must match siteUrl in src/app/layout.tsx and SITE_URL in
// src/app/sitemap.ts
const SITE_URL = 'https://whiteout-survival-data.chiefpansancolt.dev'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
