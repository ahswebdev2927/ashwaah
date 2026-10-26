export function getProductImageUrls(
  imagesJson: string | null | undefined,
  colorsJson: string | null | undefined,
  selectedColor?: string | null
): string[] {
  try {
    if (!imagesJson) return [];
    const parsedImages = JSON.parse(imagesJson);
    
    if (Array.isArray(parsedImages)) {
      return parsedImages; // old format
    }
    
    // It's a Record format (object)
    if (selectedColor && parsedImages[selectedColor] && parsedImages[selectedColor].length > 0) {
      return parsedImages[selectedColor];
    }
    
    // If no selectedColor or not found, try the first color from colors list
    if (colorsJson) {
      const parsedColors = JSON.parse(colorsJson);
      if (Array.isArray(parsedColors) && parsedColors.length > 0) {
        const firstColor = parsedColors[0];
        if (parsedImages[firstColor] && parsedImages[firstColor].length > 0) {
          return parsedImages[firstColor];
        }
      }
    }
    
    // Try Default key
    if (parsedImages["Default"] && parsedImages["Default"].length > 0) {
      return parsedImages["Default"];
    }
    
    // Try any key
    const keys = Object.keys(parsedImages);
    if (keys.length > 0) {
      for (const k of keys) {
        if (parsedImages[k] && parsedImages[k].length > 0) {
          return parsedImages[k];
        }
      }
    }
    
    return [];
  } catch {
    return [];
  }
}

export function getFirstProductImageUrl(
  imagesJson: string | null | undefined,
  colorsJson: string | null | undefined,
  selectedColor?: string | null
): string {
  const urls = getProductImageUrls(imagesJson, colorsJson, selectedColor);
  return urls.length > 0 ? urls[0] : "/images/placeholder.png";
}

/**
 * Creates an SEO-friendly unique slug from a product's name and ID.
 * Example: ("Men's Classic Shirt", 42) => "mens-classic-shirt-42"
 */
export function createProductSlug(name: string | null | undefined, id: number | string): string {
  const cleanId = String(id).trim();
  if (!name) return `product-${cleanId}`;

  const slugifiedName = name
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slugifiedName ? `${slugifiedName}-${cleanId}` : `product-${cleanId}`;
}

/**
 * Extracts the numeric product ID from either a pure ID ("42") or a slug ("mens-classic-shirt-42").
 */
export function parseProductId(slugOrId: string | number | null | undefined): number | null {
  if (slugOrId === null || slugOrId === undefined) return null;
  const str = String(slugOrId).trim();
  if (!str) return null;

  // Pure number check
  if (/^\d+$/.test(str)) {
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }

  // Trailing ID in slug check
  const match = str.match(/-(\d+)$/);
  if (match && match[1]) {
    const num = parseInt(match[1], 10);
    return isNaN(num) ? null : num;
  }

  return null;
}

/**
 * Returns the canonical product URL for navigation.
 */
export function getProductUrl(product: { id: number | string; name?: string | null }): string {
  if (!product || product.id === undefined || product.id === null) return "/";
  if (!product.name) return `/product/${product.id}`;
  return `/product/${createProductSlug(product.name, product.id)}`;
}
