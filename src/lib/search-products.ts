import { supabase } from "./supabase";

const KEYWORD_MAP: Record<string, string> = {
  "tee": "t-shirt",
  "tshirt": "t-shirt",
  "t shirt": "t-shirt",
  "jog": "joggers",
  "hood": "hoodie",
  "hooded": "hoodie",
  "active wear": "activewear",
  "gym wear": "gym outfit",
  "workout": "workout clothes",
  "upperwear": "upper wear",
  "bottomwear": "bottom wear",
  "lower": "bottom wear",
  "lower wear": "bottom wear",
  "lowerwear": "bottom wear",
};

const CATEGORY_SYNONYMS: Record<string, string> = {
  "upper": "upper",
  "upper wear": "upper",
  "upperwear": "upper",
  "top": "upper",
  "tops": "upper",
  "bottom": "bottom",
  "bottoms": "bottom",
  "bottom wear": "bottom",
  "bottomwear": "bottom",
  "lower": "bottom",
  "lower wear": "bottom",
  "active": "active",
  "activewear": "active",
  "active wear": "active",
  "casual": "casual",
  "casual wear": "casual",
};

const SEARCH_LIMIT = 60;
const FALLBACK_IMAGE = "/product/fallback.png";

export interface ProductSearchResult {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
  category: string;
  tags: string[];
  colors: string[];
  image: string;
  created_at: string;
  is_best_selling: boolean;
}

interface ProductImageRow {
  image_url: string;
  is_primary: boolean;
  sort_order: number | null;
}

interface ProductColorRow {
  color_name: string;
}

interface ProductRow {
  id: string;
  name: string;
  base_price: number;
  sale_price: number | null;
  short_description: string | null;
  description: string | null;
  tags: string[] | null;
  created_at: string;
  is_best_selling: boolean;
  categories: { name: string; slug: string } | null;
  product_images: ProductImageRow[] | null;
  product_colors: ProductColorRow[] | null;
}

export async function searchProducts(rawQuery: string): Promise<ProductSearchResult[]> {
  const normalizedQuery = normalizeQuery(rawQuery);
  if (!normalizedQuery) return [];

  const tokens = extractTokens(normalizedQuery);
  const orClause = buildOrClause(normalizedQuery, tokens);
  const categorySlug = detectCategorySlug(normalizedQuery);

  let query = supabase
    .from("products")
    .select(
      `id,name,base_price,sale_price,short_description,description,tags,created_at,is_best_selling,
       categories(name,slug),
       product_images(image_url,is_primary,sort_order),
       product_colors(color_name)`
    )
    .eq("is_active", true)
    .limit(SEARCH_LIMIT);

  if (categorySlug) {
    query = query.eq("categories.slug", categorySlug);
  }

  if (!categorySlug && orClause) {
    query = query.or(orClause);
  }

  const { data, error } = await query;
  if (error) {
    console.error("searchProducts failed", error.message);
    return [];
  }

  return ((data as ProductRow[]) ?? []).map(mapRowToResult);
}

function normalizeQuery(raw: string): string {
  if (!raw) return "";
  let value = raw.trim().toLowerCase();
  if (!value) return "";
  value = value.replace(/\s+/g, " ");

  for (const [variant, canonical] of Object.entries(KEYWORD_MAP)) {
    const pattern = new RegExp(`\\b${escapeRegExp(variant)}\\b`, "g");
    value = value.replace(pattern, canonical);
  }

  return value.trim();
}

function extractTokens(normalized: string): string[] {
  const baseTokens = normalized.split(" ").filter(Boolean);
  return Array.from(new Set(baseTokens));
}

function buildOrClause(normalized: string, tokens: string[]): string {
  const fragments = new Set<string>();
  const wildcard = `%${escapeForLike(normalized)}%`;
  addTextColumns(fragments, wildcard, ["name", "short_description", "description"]);

  tokens.forEach((token) => {
    const tokenWildcard = `%${escapeForLike(token)}%`;
    addTextColumns(fragments, tokenWildcard, ["name", "short_description", "description"]);
    fragments.add(`categories.name.ilike.${tokenWildcard}`);
    fragments.add(`product_colors.color_name.ilike.${tokenWildcard}`);
  });

  buildTagFilters(tokens).forEach((tagFilter) => fragments.add(tagFilter));

  return Array.from(fragments).join(",");
}

function addTextColumns(set: Set<string>, wildcard: string, columns: string[]) {
  columns.forEach((column) => set.add(`${column}.ilike.${wildcard}`));
}

function buildTagFilters(tokens: string[]): string[] {
  const filters: string[] = [];
  tokens.forEach((token) => {
    const sanitized = token.replace(/[{}]/g, "").replace(/,/g, "").trim();
    if (!sanitized) return;
    const needsQuotes = /\s/.test(sanitized);
    const value = needsQuotes ? `"${sanitized}"` : sanitized;
    filters.push(`tags.cs.{${value}}`);
  });
  return filters;
}

function escapeForLike(value: string): string {
  return value.replace(/[%_,]/g, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pickPrimaryImage(images: ProductImageRow[] | null): string {
  if (!images || images.length === 0) return FALLBACK_IMAGE;
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary !== b.is_primary) return a.is_primary ? -1 : 1;
    const orderA = a.sort_order ?? Number.MAX_SAFE_INTEGER;
    const orderB = b.sort_order ?? Number.MAX_SAFE_INTEGER;
    return orderA - orderB;
  });
  return sorted[0]?.image_url ?? FALLBACK_IMAGE;
}

function mapRowToResult(row: ProductRow): ProductSearchResult {
  return {
    id: row.id,
    name: row.name,
    base_price: row.base_price,
    sale_price: row.sale_price,
    short_description: row.short_description,
    category: row.categories?.name ?? "",
    tags: row.tags ?? [],
    colors: (row.product_colors ?? []).map((color) => color.color_name),
    image: pickPrimaryImage(row.product_images ?? null),
    created_at: row.created_at,
    is_best_selling: row.is_best_selling,
  };
}

function detectCategorySlug(normalized: string): string | null {
  return CATEGORY_SYNONYMS[normalized] ?? null;
}
