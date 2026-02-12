+++
title = "Customization Reference: Colors, Type, and Layout"
date = 2026-02-08T11:10:00-08:00
description = "A quick map of the main theme tokens and where to tweak them."
tags = ["docs", "customization", "css"]
categories = ["reference"]
+++

Most visual customization lives in `assets/css/theme/*.css`.

## Core design tokens

Look for variables under `:root` and `html[data-theme="dark"]`:

```css
--bg: #f9f9f9;
--bg-alt: #ffffff;
--fg: #000000;
--muted: #111111;
--border: #000000;
```

## Card interactions

Card hover and focus styles are defined in `.interactive-card`.

## Typography

Main text uses Space Mono while code blocks use Iosevka NFM.
