# ToGatherSG — Landing Page

Marketing landing page for **ToGatherSG**, Singapore's first marketplace for home-based experiences.
Built with **Vite + React 18 + Tailwind CSS v4**, extracted from the Figma Make design
"Responsive Landing Page Design".

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
npm run preview  # serve the production build locally
```

## Project structure

```
index.html                     # Vite entry
src/main.tsx                   # React mount
src/styles/                    # index.css → fonts.css, tailwind.css, theme.css
src/app/App.tsx                # page composition
src/app/content.ts             # ⭐ all copy, links & remote image URLs live here
src/app/components/            # Header, Home, FeaturedIn, HostWithUs,
                               # MeetTheTeam, Contact, DownloadNow, Footer
src/app/components/ui/         # button, card, input, textarea (shadcn/ui)
src/imports/                   # local brand image assets (see below)
```

### Editing content
Most text, links, contact details, team members and remote (Unsplash) images are in
`src/app/content.ts` — edit that file, no component changes needed.

## Brand images

The Figma Make API only exposes flattened frame renders, not the original uploaded image
files. Status of each `src/imports/` asset:

| File | Used in | Status |
|------|---------|--------|
| `image__22_.jpg` | Home hero | ✅ real photo (extracted from the Figma mockup) |
| `Half_Logo.png` | Header logo | ⚠️ placeholder — replace with the real ToGatherSG logo |
| `Logo.png` | Footer logo | ⚠️ placeholder — replace with the real ToGatherSG logo |
| `ZaoBao_Without_face.png` | Featured In | ⚠️ placeholder — replace with the real Lianhe Zaobao article |
| `ToGatherSG_avail_on_ios__1_.png` | Download Now | ⚠️ placeholder — replace with real App Store / iOS screenshot |
| `Countdown_to_ios_launch.jpg` | (imported, unused) | placeholder |

The Host With Us benefit cards use inline [lucide](https://lucide.dev) icons (Compass, Wallet,
Trending-up, Life-buoy) — no image files needed there.

## Deploy (Vercel)

Vercel auto-detects the Vite preset:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

No environment variables required.
