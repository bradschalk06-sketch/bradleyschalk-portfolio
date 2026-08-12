# Bradley Schalk — Engineering Portfolio

A static site. Plain HTML, CSS, and vanilla JavaScript — no build step, no framework,
no dependencies to install. Everything here is yours to edit directly.

Seven projects across aerospace, automation, manufacturing, and mechanical design.

---

## 1. Status

Everything is wired up. The site is ready to deploy as-is:

- **Domain set** to `bradleyschalk.com` — canonical and Open Graph URLs are filled in on
  all 12 pages, and a `CNAME` file is in the root for GitHub Pages.
- **Resume installed** at `assets/docs/Bradley_Schalk_Resume.pdf`. The View and Download
  buttons on `resume.html` point at it, and it previews inline on that page.
- **No placeholders left.** Name, email, phone, and LinkedIn are live everywhere.

To change the domain later, re-run `./set-domain.sh <new-domain>`; it swaps the old one
out and rewrites `CNAME`. To swap in an updated resume, drop the new PDF at the same path
and filename — nothing else needs touching.

---

## 1a. Picking the domain

I can't check availability from here — registrars are the only reliable source, and
availability changes by the hour. Check the exact spellings at
[Porkbun](https://porkbun.com), [Cloudflare Registrar](https://www.cloudflare.com/products/registrar/),
or [Namecheap](https://www.namecheap.com); all three show live results as you type.

In rough order of what I would try:

| Domain | Why | Notes |
|---|---|---|
| `bradleyschalk.com` | The default. Easiest to say out loud, easiest to put on a resume, and nobody has to be told the extension. | `.com` is the one people type by reflex. If it's free, take it. |
| `bradleyschalk.me` | Short, clearly personal, widely used for portfolios. | Good fallback if the `.com` is gone. |
| `bradleyschalk.engineer` | Says what you are in the URL itself. | Registration is cheap but **renewal runs roughly $30–40/yr**, versus about $10–15 for `.com`. Budget for the renewal, not the first-year promo. |
| `bradleyschalk.dev` / `.xyz` | Only if the above are taken. | `.dev` reads software-y, which undersells aerospace and hardware. |

A few practical points:

- **Put it on your resume**, so favour the version that survives being read aloud in a
  phone screen. `bradleyschalk.com` needs no explanation; `bradleyschalk.engineer` will
  occasionally be heard as `.engineering`.
- **Watch the renewal price, not the sale price.** Novelty extensions are cheap for the
  first year and several times the price of a `.com` every year after.
- **If the exact name is taken**, `bradleyschalkengineering.com` or
  `schalkengineering.com` beat adding hyphens or numbers.
- You can register more than one and redirect the spares at the main site — most
  registrars do this for free.

Once you own it, run `./set-domain.sh <domain>` and follow section 6.

---

## 2. Run it locally

No server strictly required — you can open `index.html` in a browser. But a local
server behaves like the real thing (correct paths, video seeking, no `file://` quirks):

```bash
python3 -m http.server 8000     # then open http://localhost:8000
npx serve                       # or, if you have Node
```

---

## 3. File layout

```
/
  index.html                 Homepage — hero, 5 featured projects, skills, about, contact
  about.html                 Background, involvement/leadership, full skills
  resume.html                PDF viewer + download buttons + summary
  contact.html               Contact links
  favicon.svg                Browser tab icon
  robots.txt
  set-domain.sh              One-shot script to set your domain + write CNAME

  projects/
    index.html               All 7 projects + additional hands-on experience
    robot-cell.html          FANUC R-1000iA/100F + Yama Seiki VMC cell   (flagship)
    b36-peacemaker.html      B-36 Peacemaker — Siemens NX aircraft model
    conveyor.html            Furnace conveyor belt system
    glider.html              Hand-launched glider — design, build, flight test
    furnace-part.html        Reverse-engineered furnace replacement component
    cleaning-machine.html    Pipe-cleaning agitation machine CAD reconstruction
    paint-holder.html        Paint robot nozzle holder

  assets/
    images/
      robot-cell/            10 images
      conveyor/              22 images
      b36-peacemaker/         2 renders
      glider/                 7 images (2 photos, 4 CAD views, 1 card cover)
      furnace-part/           3 images
      cleaning-machine/       4 images
      paint-holder/           1 image
      og-image.jpg           Social share card (1200×630)
    videos/                  4 clips + 4 poster frames
    docs/                    ← put your resume PDF here

  css/styles.css             All styling. Design tokens at the top.
  js/script.js               Mobile nav, lightbox, video handling
```

Every image exists at two sizes:

- `<name>-thumb.webp` — max 820 px, used in grids and cards
- `<name>-full.webp` — max 1800 px, loaded only when the lightbox opens

---

## 4. Changing how it looks

Open `css/styles.css`. The `:root` block at the top holds every colour, font, and
layout value. Change it there and the whole site follows.

**Switching the accent to UIUC orange** — change three values in `:root`:

```css
--accent:      #E84A27;
--accent-soft: rgba(232, 74, 39, .13);
--accent-line: rgba(232, 74, 39, .42);
```

The current accent is a restrained cyan-blue (`#4FA3D9`). Type is IBM Plex Sans for
text and IBM Plex Mono for labels, captions, spec rows, and metric numbers.

---

## 5. Adding a new project

Built to make this easy — for your rocketry work or future aerospace projects.

1. **Add images.** Create `assets/images/<project-slug>/` and drop them in. Generate the
   two sizes with the script in section 7, or name your files `<name>-thumb.webp` and
   `<name>-full.webp` yourself.

2. **Create the page.** Copy an existing project page as your starting point:
   - `paint-holder.html` — shortest, good for a small project
   - `glider.html` — process rail + metric callouts + CAD and photo galleries
   - `b36-peacemaker.html` — CAD-and-video project, clean and compact
   - `conveyor.html` — large galleries and a component library
   - `robot-cell.html` — the full treatment, with three videos

3. **Add the card.** In `projects/index.html` there is a commented
   `PROJECT CARD TEMPLATE` block. Duplicate one `<article class="pcard">`, then swap the
   image, eyebrow, title, link, description, and tags.

4. **Optionally feature it on the homepage** by copying that card into the `.pgrid` in
   `index.html`. The homepage shows five; the projects page shows all seven.

Useful classes when building a page:

| Class | Does |
|---|---|
| `pcard--flagship` | Full-width card, image beside text |
| `pcard__media--fit` | Dark `contain` — whole subject on the dark card background. For photos and renders that carry their own background (sky, benchtop) |
| `pcard__media--cad` | White `contain` — for CAD renders. Keeps the exported white canvas (see the rule below) |
| `pcard__media--cine` | 16/9 frame, for wide subjects like the aircraft |
| `pcard__media--wide` | 3/2 frame, for squarer subjects like the glider |
| `shot--cad` | Gallery tile for a CAD/CAM screenshot (light backing, no crop) |
| `shot--tall` | Gallery tile for a portrait image (3:4 instead of 4:3) |
| `gallery--wide` | Fewer, larger tiles |
| `gallery--parts` | Many small tiles, for component libraries |
| `rail` | Numbered process strip (Design → Fabricate → Test → …) |
| `metrics` / `metric` | Big measured-result callouts. Only use with real numbers |
| `specs` | Mono key/value data block |
| `note` | Accent-bordered callout, for scope and status notes |
| `phero--natural` | Hero image at its own aspect ratio instead of 16:9 — use for portrait photos, or when cropping would cut the subject |
| `vfig--portrait` | Caps a portrait video's width so it isn't upscaled |

**Lightbox wiring.** Any gallery needs `data-gallery` on the container, and each tile a
`<button data-lightbox data-full="...">`. Add `data-cad` for CAD screenshots. The
lightbox markup block must be present near the bottom of the page — copy it from any
project page. Prev/next only cycles within one `data-gallery`.

---

## 5a. Two layout rules worth keeping

**CAD images keep their original background.** If a render or screenshot was exported on
a white (or light grey) canvas, display it on that canvas — use `pcard__media--cad` on
cards and `shot--cad` in galleries, both of which put the image on a white panel. Do not
key the white out, and do not use blend modes, filters, or masks to make it match the
dark site. A white rectangle inside a dark card is intentional: it separates engineering
documentation from photography, and it guarantees the geometry is shown exactly as
exported. An earlier version of this site removed those backgrounds automatically; that
was reverted, and the assets it produced were deleted.

**Card heights follow their content.** `.pgrid` uses `align-items: start`. Without it,
grid items stretch to the tallest card in the row, and because `.pcard__foot` uses
`margin-top: auto`, a short card's tags get pushed to the bottom of the row leaving a
dead band in the middle. If you ever see a card with a big empty lower half, that rule is
the first thing to check.

Pick the media frame closest to the image's own aspect ratio. `contain` inside a
badly-matched frame is what makes a subject look small and marooned — the fix is almost
always a better frame, not more padding.

---

## 6. Deploying

Fully static, so any of these work with no configuration.

### GitHub Pages

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

Then: repository → **Settings → Pages → Source: Deploy from a branch → main / (root)**.
Live in a minute or two at `https://YOUR_USERNAME.github.io/YOUR_REPO/`. Naming the repo
`YOUR_USERNAME.github.io` instead serves it from the root with no path prefix.

**Attaching your custom domain.** After running `./set-domain.sh`, go to
**Settings → Pages → Custom domain**, enter the domain, and save. Then add these records
at your registrar — an apex domain (`bradleyschalk.com`) needs the four A records; a
`www` subdomain needs the CNAME:

```
Type   Name   Value
A      @      185.199.108.153
A      @      185.199.109.153
A      @      185.199.110.153
A      @      185.199.111.153
CNAME  www    YOUR_USERNAME.github.io.
```

DNS usually propagates within an hour. Once GitHub verifies it, tick **Enforce HTTPS**
— the certificate is issued free and automatically. Cloudflare Pages and Netlify handle
the same thing through their own dashboards and often just need one CNAME.

### Netlify / Cloudflare Pages / Vercel

Connect the repository, then:

- **Build command:** leave empty
- **Publish / output directory:** `.` (the root)

Or drag the folder onto <https://app.netlify.com/drop> for an instant deploy with no Git.

---

## 7. Regenerating images and video

### Images

Requires Python with Pillow (`pip install pillow`):

```python
from PIL import Image, ImageOps
import sys, os

src, out_dir, slug = sys.argv[1], sys.argv[2], sys.argv[3]
im = ImageOps.exif_transpose(Image.open(src))

if im.mode in ('RGBA', 'LA', 'P'):          # flatten CAD screenshots onto white
    bg = Image.new('RGB', im.size, (255, 255, 255))
    rgba = im.convert('RGBA')
    bg.paste(rgba, mask=rgba.split()[-1])
    im = bg
else:
    im = im.convert('RGB')

for suffix, maxdim, q in (('-full', 1800, 82), ('-thumb', 820, 76)):
    c = im.copy()
    c.thumbnail((maxdim, maxdim), Image.LANCZOS)
    c.save(os.path.join(out_dir, slug + suffix + '.webp'), 'WEBP', quality=q, method=5)
```

```bash
python resize.py photo.jpg assets/images/rocket/ engine-mount
```

### Video

```bash
# landscape
ffmpeg -i input.mp4 -vf "scale=1280:-2" -c:v libx264 -preset veryfast -crf 26 \
  -profile:v high -pix_fmt yuv420p -an -movflags +faststart output.mp4

# portrait (phone footage) — cap the height instead
ffmpeg -i input.mov -vf "scale=-2:1280" -c:v libx264 -preset veryfast -crf 26 \
  -profile:v high -pix_fmt yuv420p -an -movflags +faststart output.mp4

# poster frame, grabbed at 6 seconds
ffmpeg -ss 6 -i output.mp4 -frames:v 1 poster.png
```

`-an` strips audio. Drop it if you want sound — but check the recording first for
background conversation.

### Three video gotchas that have already bitten this project

**1. Rotation metadata.** Phone video often stores a rotation *flag* rather than rotated
pixels, and browsers honour that flag. A file can look landscape in a frame grab and
still play sideways on the site. Always check:

```bash
ffprobe -show_entries stream_side_data=rotation -of default=nw=1 clip.mp4
```

If a rotation shows up and the pixels are already correct, strip it losslessly — no
re-encode, no quality loss:

```bash
ffmpeg -display_rotation 0 -i in.mp4 -c copy -movflags +faststart out.mp4
```

That is exactly what was done to `testing-placements.mp4`.

**2. Letterboxing.** Portrait footage exported inside a landscape frame wastes half the
bitrate on black bars. Find the real content area, then crop:

```bash
ffmpeg -i in.mp4 -vf cropdetect -f null -      # read the crop=W:H:X:Y it prints
ffmpeg -i in.mp4 -vf "crop=608:1072:656:4" ... # then use it
```

**3. Photo orientation.** Same idea for stills. `ImageOps.exif_transpose` handles the
EXIF flag, but a photo can still be wrong afterwards if the camera recorded the flag
incorrectly. Look at the result before shipping it — for the cleaning-machine back
view, the giveaway was where the photographer's shoes ended up in frame.

---

## 8. Before you publish — a checklist

- [x] Resume PDF added at `assets/docs/Bradley_Schalk_Resume.pdf`
- [x] Domain set to bradleyschalk.com (canonical, Open Graph, CNAME)
- [ ] Read every project page for anything an employer would consider proprietary
- [ ] Check `robot-cell/control-cabinet-robot` — there is a wiring schedule taped to the
      cabinet door. Illegible at web size, but confirm you're comfortable with it
- [ ] Open the site on a phone and check the nav, galleries, and videos
- [ ] Play all four videos — confirm none render sideways or stretched
- [ ] Tab through a gallery with the keyboard: Enter opens the lightbox, arrows move,
      Escape closes

---

## 9. Accessibility and performance notes

Already handled, worth preserving as you edit:

- Semantic HTML, one `<h1>` per page, skip link to main content
- Alt text on every image; captions describe what is being shown
- Lightbox is keyboard operable, traps focus while open, and returns focus to the tile
  it was opened from
- Visible focus outlines on every interactive element
- `prefers-reduced-motion` respected
- Images lazy-load below the fold; heroes use `srcset` so phones fetch the smaller file
- Video uses `preload="none"` with poster frames, so nothing downloads until played
- Only one video plays at a time

Roughly 6 MB of images across the whole site, plus 13 MB of video that only loads on
demand.
