+++
title = "Authoring Guide: Writing Posts in papercut"
date = 2026-02-09T08:30:00-08:00
description = "How to structure front matter, summaries, and headings for this theme."
tags = ["docs", "authoring", "content"]
categories = ["guides"]
+++

papercut works best when each post has clear front matter and a short description.

## Recommended front matter

```toml
+++
title = "My Post"
date = 2026-02-09T08:30:00-08:00
description = "One-line summary used in cards and lists."
tags = ["docs"]
categories = ["guides"]
+++
```

## Heading structure

- Use `h2` for major sections (it gets a divider line).
- Use `h3` and lower for nested details.
- Keep section titles short for better ToC readability.

## Card summaries

List pages show `description` first. If it's missing, Hugo falls back to `.Summary`.
