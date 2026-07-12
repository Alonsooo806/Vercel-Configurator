---
name: Color mockups for product configurator
description: How to handle color swatches that instantly recolor a product image in a React/Vite storefront.
---

When a product base image has no transparent background (e.g., a white-shirt PNG on a white background), CSS `mix-blend-mode: multiply` or hue filters will tint the entire image, including the background, which breaks the "only change the garment color" requirement.

**Rule:** generate pre-masked color variants as static assets and swap them on hover/selection.

**Why:** the base image and its colored version must share identical dimensions and cropping so the swap is instant and pixel-perfect. A mask derived from a dark/shape variant lets you colorize only the garment while preserving the original white background.

**How to apply:**
1. Use a dark/shape variant of the product to create a binary mask.
2. Colorize the light/white base image.
3. Composite the colorized version through the mask onto the original base image.
4. In the app, keep the generated images in `public/generated_images/` and switch `src` on hover/selection for instant preview.
