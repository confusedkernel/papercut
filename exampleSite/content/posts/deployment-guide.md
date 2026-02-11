+++
title = "Deployment Guide"
date = 2026-02-06T15:05:00-08:00
description = "Build, verify, and publish papercut with a predictable release flow."
tags = ["docs", "deployment", "ci"]
categories = ["guides"]
+++

This post outlines a safe deployment loop for Hugo sites using papercut.

## Local verification

```bash
hugo -s exampleSite
```

## Production build

```bash
hugo --minify
```

## Release checklist

- Confirm dark/light theme styles are readable.
- Verify search and taxonomy pages load correctly.
- Check previous/next links on single posts.
