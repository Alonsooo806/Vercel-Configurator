---
name: Image generation fallback
description: What to do when a user-provided image URL returns content that doesn't match their description.
---

If a user provides an image URL together with a descriptive prompt, the URL may not match the described result (e.g., it returns an older or wrong image).

**Rule:** always verify the downloaded image with basic metadata or a quick visual check, and fall back to generating the image from the user's prompt when they disagree.

**Why:** using a mismatched image silently breaks the design intent; the prompt is usually the authoritative description of what the user actually wants.

**How to apply:**
1. Download the URL and inspect dimensions, corner colors, or mean brightness.
2. If the image doesn't match the description, use `generateImage` with the user's exact prompt.
3. Save the generated image in the same `public/generated_images/` directory and reference it in the code.
