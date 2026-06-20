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

## ⚠️ Brand images — replace the placeholders

The Figma Make API only exposes flattened frame renders, not the original uploaded image
files, so the brand assets below are currently **generated placeholders**. Replace each file
in `src/imports/` with the real asset, keeping the **same filename**:

| File | Used in | Should be |
|------|---------|-----------|
| `Half_Logo.png` | Header logo | ToGatherSG header logo mark |
| `Logo.png` | Footer logo | ToGatherSG footer logo |
| `image__22_.jpg` | Home hero | Hero lifestyle photo (square) |
| `ZaoBao_Without_face.png` | Featured In | Lianhe Zaobao / press coverage image |
| `vxBcf.jpg` | Host benefit cards | Small icon shown on each host benefit card |
| `ToGatherSG_avail_on_ios__1_.png` | Download Now | App Store / iOS app screenshot |
| `a2DUq.jpg` | (imported, unused) | optional |
| `Countdown_to_ios_launch.jpg` | (imported, unused) | optional |

## Deploy (Vercel)

Vercel auto-detects the Vite preset:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Install command:** `npm install`

No environment variables required.
