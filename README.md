# papercut

papercut is a monochrome Hugo theme with editorial typography and a clean, card-based layout.

## Quick start

1. Add the theme folder to your Hugo project:

```bash
themes/papercut
```

2. Update `hugo.toml`:

```toml
theme = "papercut"

[params]
  tagline = "This is an example tagline"
  author = "papercut"

[menu]
  [[menu.main]]
    name = "About"
    url = "/about/"
    weight = 1
  [[menu.main]]
    name = "Projects"
    url = "/projects/"
    weight = 2
  [[menu.main]]
    name = "Blog"
    url = "/posts/"
    weight = 3

[taxonomies]
  tag = "tags"
  category = "categories"

[markup]
  [markup.highlight]
    codeFences = true
    guessSyntax = true
    lineNos = false
    lineNumbersInTable = false
    noClasses = false
    style = "catppuccin-latte"
```

3. Create content with front matter:

```bash
hugo new posts/hello-world.md
```

## Optional params

- `params.tagline`: short line under the site title on the home page
- `params.author`: used in the footer
- `params.avatar`: path to a square avatar image
- `params.announcement`: optional announcement block on the home page
- `params.social`: list of social links (name, url)
- `params.copyright`: custom footer copyright text

About page avatar (optional): add this to `content/about/index.md` front matter:

```toml
avatar = "/images/avatar.svg"
avatar_alt = "Portrait of the author"
```

Project cover framing (optional): add these to `content/projects/*.md` front matter:

```toml
cover = "/images/project-cover.jpg"
coverScale = 1.12
coverOffsetY = "12px"
coverOffsetX = "50%"
```

- `coverScale`: zoom amount (default `1`)
- `coverOffsetY`: vertical focal offset (accepts CSS lengths/percentages, e.g. `"12px"`, `"55%"`)
- `coverOffsetX`: horizontal focal offset (default `"50%"`)
- Snake case variants are also supported: `cover_scale`, `cover_offset_y`, `cover_offset_x`

## Code blocks and syntax highlighting

papercut uses Hugo's built-in Chroma highlighter for fenced code blocks. If your site config already defines `[markup.highlight]`, keep your existing values.

## Frontend build (Tailwind + PostCSS)

papercut uses a compiled Tailwind CSS pipeline through PostCSS (no CDN runtime script).

```bash
npm install
npm run build:css
```

Useful commands:

- `npm run build:css`: production build (Tailwind + Autoprefixer + cssnano) to `static/css/tailwind.css`
- `npm run watch:css`: development watch build while editing layouts/templates

When working on theme markup/classes, run Tailwind build before `hugo -s exampleSite`.

## Theme shortcodes

papercut includes a few custom shortcodes inspired by Hugo Narrow:

- `icon`
- `button`
- `links` + `link`
- `callout`
- `notice`
- `cards` + `card`
- `details`
- `steps`

Examples:

```markdown
{{< icon "heart" >}}
{{< icon "github" "class='h-5 w-5' style='color: var(--fg);'" >}}

{{< button text="Read docs" url="/posts/" variant="outline" target="_self" >}}

{{< links cols="2" >}}
  {{< link
    title="Hugo"
    description="The world’s fastest framework for building websites."
    url="https://gohugo.io"
    icon="favicon"
  >}}
  {{< link
    title="Go"
    description="Build simple, secure, and scalable systems."
    url="https://go.dev"
    icon="sparkles"
  >}}
{{< /links >}}

{{< callout type="tip" title="Pro tip" >}}
Use `theme = "papercut"` in your Hugo config.
{{< /callout >}}

{{< notice type="warning" title="Heads up" >}}
Remember to rebuild your site after changing markup config.
{{< /notice >}}

{{< cards cols="2" >}}
  {{< card link="/posts/" title="Docs" icon="file" >}}
  {{< card link="https://github.com/gohugoio/hugo" title="Hugo repo" subtitle="Auto favicon icon" icon="favicon" >}}
  {{< card link="/" title="Image card" subtitle="Remote image" image="https://images.unsplash.com/photo-1482192597420-48125ceb31b8?auto=format&fit=crop&w=1200&q=80" >}}
{{< /cards >}}

{{< cards cols="2" >}}
  {{< card
    link="/"
    title="Processed image card"
    subtitle="Image from assets with Hugo processing"
    image="images/space.jpg"
    method="Resize"
    options="900x q80 webp"
  >}}
{{< /cards >}}

{{< details title="Click to expand" closed="true" >}}
Markdown content can go inside details.
{{< /details >}}

{{< steps >}}
### Step 1
Initialize your site.

### Step 2
Add the theme and start writing.
{{< /steps >}}

{{< steps exclude="true" >}}
### Hidden from ToC
Use this when you want step headings but do not want them listed in the table of contents.
{{< /steps >}}
```

Notes:

- Hugo built-in shortcodes such as `youtube`, `gist`, and `figure` remain available.
- Provider-specific shortcodes like bilibili/tencent are not included in papercut.
- `card` supports `image`, `imageAlt`, `imageStyle`, `method`, and `options` for Hextra-style image cards.
- `card` and `link` support `icon="favicon"` to auto-fetch a favicon from external URLs (with fallback to `<site>/favicon.ico`), built-in icons (for example `icon="folder"`), and direct icon image URLs/paths.
- `steps` headings are included in the on-page ToC by default; set `exclude="true"` to skip a specific steps block.

## Built-in layouts

- Home page with recent posts
- Section list pages
- Single post pages
- Taxonomy list and term pages
- 404 page

## Deploy the demo to GitHub Pages

This repo includes a Pages workflow at `.github/workflows/example-site-pages.yml` that builds Tailwind CSS, then builds and publishes `exampleSite`.

1. Push this repository to GitHub.
2. In GitHub, go to `Settings -> Pages` and set the source to `GitHub Actions`.
3. Push to `main` (or run the workflow manually) to deploy.

The workflow builds with:

```bash
hugo --minify -s exampleSite --baseURL "https://<user>.github.io/<repo>/"
```

The deploy URL will be shown in the workflow run under the `deploy` job.
