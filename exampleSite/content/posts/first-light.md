+++
title = "Quickstart: Install papercut"
date = 2026-02-10T09:00:00-08:00
description = "Set up papercut in a fresh Hugo project in a few minutes."
tags = ["docs", "setup", "quickstart"]
categories = ["guides"]
+++

This guide walks through the minimal setup for running papercut locally.

## 1) Add the theme directory

Copy the theme folder into your Hugo project under `themes/papercut`.

## 2) Configure `hugo.toml`

Set your theme and optional metadata:

```toml
theme = "papercut"

[params]
  tagline = "Documentation and release notes"
  description = "A clean, paper-like Hugo theme."

[taxonomies]
  tag = "tags"
  category = "categories"
```

## 3) Run the site

```bash
hugo server
```

## 4) Create your first post

```bash
hugo new posts/getting-started.md
```
