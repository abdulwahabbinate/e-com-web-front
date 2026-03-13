export const normalizeProduct = (item, index = 0) => {
  const safePrice = Number(item.price || 0);
  const safeComparePrice = Number(item.compare_price || 0);

  const imageArray =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images.filter(Boolean)
      : [];

  const primaryImage = imageArray[0] || "";

  return {
    id: item._id || item.id,
    title: item.title || item.name || "Untitled Product",
    description:
      item.description ||
      item.short_description ||
      item.shortDescription ||
      "No description available",
    shortDescription:
      item.short_description ||
      item.shortDescription ||
      item.description ||
      "",
    category:
      item.category_id?.name ||
      item.category?.name ||
      item.category ||
      "Fashion",
    categorySlug:
      item.category_id?.slug ||
      item.category?.slug ||
      "",
    price: safePrice,
    originalPrice:
      safeComparePrice > safePrice
        ? safeComparePrice
        : Number((safePrice * 1.2).toFixed(2)),
    comparePrice: safeComparePrice,
    discountPercent:
      safeComparePrice > safePrice
        ? Math.round(((safeComparePrice - safePrice) / safeComparePrice) * 100)
        : [15, 20, 25, 30][index % 4],
    image: primaryImage,
    images: imageArray,
    sizes:
      Array.isArray(item.sizes) && item.sizes.length > 0
        ? item.sizes
        : ["S", "M", "L"],
    colors:
      Array.isArray(item.colors) && item.colors.length > 0
        ? item.colors
        : [],
    inStock:
      typeof item.is_active === "boolean"
        ? item.is_active && Number(item.stock || 0) > 0
        : Number(item.stock || 0) > 0,
    stock: Number(item.stock || 0),
    rating: item.rating || { rate: 4.8, count: 120 },
    brand: item.brand || "Premium Brand",
    sku: item.sku || `SKU-${item._id || item.id || index + 1}`,
    slug: item.slug || "",
    isFeatured: Boolean(item.is_featured),
    isActive: typeof item.is_active === "boolean" ? item.is_active : true,
  };
};

export const filterProductsByMenuSlug = (products, slug) => {
  if (!slug) return products;

  return products.filter((item) => {
    const categorySlug = item.categorySlug?.toLowerCase() || "";
    const itemSlug = item.slug?.toLowerCase() || "";
    const title = item.title?.toLowerCase() || "";
    const description = item.description?.toLowerCase() || "";
    const normalizedSlug = slug.toLowerCase();

    return (
      categorySlug === normalizedSlug ||
      itemSlug === normalizedSlug ||
      title.includes(normalizedSlug.replace(/-/g, " ")) ||
      description.includes(normalizedSlug.replace(/-/g, " "))
    );
  });
};

export const filterProductsBySearch = (products, searchTerm) => {
  if (!searchTerm?.trim()) return products;

  const query = searchTerm.toLowerCase().trim();

  return products.filter((item) => {
    const searchableText = [
      item.title,
      item.description,
      item.shortDescription,
      item.category,
      item.brand,
      item.sku,
      ...(item.sizes || []),
      ...(item.colors || []),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });
};

export const filterProductsAdvanced = (products, filters) => {
  let filtered = [...products];

  if (filters.categories.length > 0) {
    filtered = filtered.filter((item) =>
      filters.categories.includes(item.category)
    );
  }

  if (filters.sizes.length > 0) {
    filtered = filtered.filter((item) =>
      (item.sizes || []).some((size) => filters.sizes.includes(size))
    );
  }

  if (filters.stock === "in-stock") {
    filtered = filtered.filter((item) => item.inStock !== false);
  }

  if (filters.stock === "sold-out") {
    filtered = filtered.filter((item) => item.inStock === false);
  }

  filtered = filtered.filter((item) => {
    const price = Number(item.price || 0);
    return price >= filters.priceRange[0] && price <= filters.priceRange[1];
  });

  return filtered;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-low-high":
      return sorted.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));

    case "price-high-low":
      return sorted.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));

    case "name-a-z":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "name-z-a":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
  }
};