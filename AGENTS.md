# AGENTS.md — VizeErasmus.com

## Mission
Improve this real website, not merely describe a redesign. Deliver differentiated, accessible, mobile-first design and correct implementation. Project brand: VizeErasmus.com.

## Creative Web Intelligence workflow
Use Creative Web Intelligence Library as an optional design research reference when available, after reviewing its license and actual content; do not claim the external library is installed just because this instruction exists. Apply its underlying method: research the audience and page purpose, make explicit typography/color/layout/motion/media decisions, implement and validate them. Never copy third-party copyrighted layouts, fonts or assets.

## Brand-specific art direction
student-first editorial campus design; warm ivory, deep forest, bright lime accents; distinctive country-guide layouts; campus photography with locally hosted verified assets; no broken hero images.

## Mandatory implementation loop
1. Inspect the existing repository and its real routes, components, CSS, assets, deployment config, SEO, content and automations before changing anything.
2. Inventory page archetypes (home, category, article, guide, contact, search and any unique page). Create materially different compositions appropriate to each; do not just recolor a generic hero/cards template.
3. Write a short design rationale: type scale, spacing, palette, imagery, responsive behavior, motion and reduced-motion fallback. Motion/3D only when useful and performant; avoid gratuitous WebGL.
4. Implement production code, not mockups or placeholder screenshots. Use licensed, verified, preferably local images; provide accessible fallbacks and alt text. Check every hero image actually loads.
5. Preserve routes, canonical tags, meta data, structured data, sitemap, robots, internal links, analytics, existing copy accuracy and contact details. Verify legal/visa information against official sources before factual edits.
6. Check mobile 360px and 390px, tablet and desktop; keyboard navigation, contrast, layout shift, loading, broken assets, console errors and build/tests. Record what was and was not tested.
7. Prefer scoped incremental commits/PRs; no bulk destructive rewrite, no fake claims of live deployment. Do not publish to production unless deployment behavior is understood.

## Project-specific safeguards
Static HTML/CSS. Inspect index.html, styles.css, styles-core.css, forest-lime.css, platform.css and country-guide.css before changes. Cloudflare Pages deploys main; protect existing URLs and SEO.

## Definition of done
At least one real page implementation improved, page archetypes reviewed, automated checks passing where available, no broken images, no SEO/contact regression, and an honest change log with preview/deployment status. This file is guidance for coding agents; it does not itself schedule or execute autonomous changes.
