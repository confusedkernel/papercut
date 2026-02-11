+++
title = "Shortcodes Reference"
date = 2026-02-05T10:45:00-08:00
description = "Examples of papercut shortcodes: callout, cards, details, steps, and more."
tags = ["docs", "shortcodes", "reference"]
categories = ["reference"]
+++

This page demonstrates the custom shortcodes bundled with papercut.

## Icon

```markdown
{{</* icon "heart" */>}}
{{</* icon "github" "style='width:1.2rem;height:1.2rem'" */>}}
{{</* icon name="sun" size="xl" */>}}
```

{{< icon "heart" >}} {{< icon "github" "style='width:1.2rem;height:1.2rem'" >}} {{< icon name="sun" size="xl" >}}

## Button

```markdown
{{</* button text="Primary" url="/posts/" target="_self" */>}}
{{</* button text="Outline" url="/projects/" variant="outline" target="_self" */>}}
```

{{< button text="Primary" url="/posts/" target="_self" >}}
{{< button text="Outline" url="/projects/" variant="outline" target="_self" >}}

## Link cards

```markdown
{{</* links cols="2" */>}}
  {{</* link title="Hugo" description="Fast static site generator" url="https://gohugo.io" icon="https://gohugo.io/favicon.ico" */>}}
  {{</* link title="Go" description="Simple, secure, and scalable" url="https://go.dev" icon="https://go.dev/favicon.ico" */>}}
{{</* /links */>}}
```

{{< links cols="2" >}}
  {{< link title="Hugo" description="Fast static site generator" url="https://gohugo.io" icon="https://gohugo.io/favicon.ico" >}}
  {{< link title="Go" description="Simple, secure, and scalable" url="https://go.dev" icon="https://go.dev/favicon.ico" >}}
{{< /links >}}

## Callout

```markdown
{{</* callout type="tip" title="Pro tip" */>}}
Use `theme = "papercut"` in your Hugo config.
{{</* /callout */>}}
```

{{< callout type="tip" title="Pro tip" >}}
Use `theme = "papercut"` in your Hugo config.
{{< /callout >}}

## Notice

```markdown
{{</* notice type="warning" title="Heads up" */>}}
Remember to rebuild your site after changing markup config.
{{</* /notice */>}}
```

{{< notice type="warning" title="Heads up" >}}
Remember to rebuild your site after changing markup config.
{{< /notice >}}

## Cards

```markdown
{{</* cards cols="2" */>}}
  {{</* card link="/posts/" title="Docs" icon="document" */>}}
  {{</* card link="/projects/" title="Projects" subtitle="See project pages." icon="folder" */>}}
  {{</* card link="/" title="Image card" subtitle="Remote image" image="https://images.unsplash.com/photo-1482192597420-48125ceb31b8?auto=format&fit=crop&w=1200&q=80" */>}}
{{</* /cards */>}}

{{</* cards cols="1" */>}}
  {{</* card link="/" title="Processed image card" subtitle="Image from assets with Hugo processing" image="images/space.jpg" method="Resize" options="900x q80 webp" */>}}
{{</* /cards */>}}
```

{{< cards cols="2" >}}
  {{< card link="/posts/" title="Docs" icon="file" >}}
  {{< card link="/projects/" title="Projects" subtitle="See project pages." icon="folder" >}}
  {{< card link="/" title="Image card" subtitle="Remote image" image="https://images.unsplash.com/photo-1482192597420-48125ceb31b8?auto=format&fit=crop&w=1200&q=80" >}}
{{< /cards >}}

## Details

```markdown
{{</* details title="Click to expand" closed="true" */>}}
Markdown content can go inside details.
{{</* /details */>}}
```

{{< details title="Click to expand" closed="true" >}}
Markdown content can go inside details.
{{< /details >}}

## Steps

```markdown
{{</* steps */>}}
### Step 1
Initialize your site.

### Step 2
Add the theme and start writing.
{{</* /steps */>}}
```

{{< steps >}}
### Step 1
Initialize your site.

### Step 2
Add the theme and start writing.
{{< /steps >}}
