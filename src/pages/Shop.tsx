import { SlidersHorizontal, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products } from "../data";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types";

export default function Shop({
  wishlist,
  onWish,
  onCart,
}: {
  wishlist: string[];
  onWish: (id: string) => void;
  onCart: (p: Product) => void;
}) {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "All");
  const [brand, setBrand] = useState("All");
  const [onlyOffers, setOnlyOffers] = useState(params.get("offer") === "true");
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(1500);
  const [sort, setSort] = useState("popular");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize state when URL query parameters change (e.g. clicking Categories / Offers in Header)
  useEffect(() => {
    const searchParam = params.get("search") || "";
    const catParam = params.get("category") || "All";
    const offerParam = params.get("offer") === "true";
    setQuery(searchParam);
    setCategory(catParam);
    setOnlyOffers(offerParam);
  }, [params]);

  const cats = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
  const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))];

  const result = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch = !query || p.name.toLowerCase().includes(query.toLowerCase());
        const matchesCat = category === "All" || p.category.toLowerCase() === category.toLowerCase();
        const matchesBrand = brand === "All" || p.brand.toLowerCase() === brand.toLowerCase();
        const matchesPrice = p.price >= min && p.price <= max;
        const matchesOffer = !onlyOffers || (p.oldPrice && p.oldPrice > p.price);
        return matchesSearch && matchesCat && matchesBrand && matchesPrice && matchesOffer;
      })
      .sort((a, b) =>
        sort === "priceLow"
          ? a.price - b.price
          : sort === "priceHigh"
          ? b.price - a.price
          : sort === "new"
          ? Number(b.id.slice(1)) - Number(a.id.slice(1))
          : b.reviews - a.reviews
      );
  }, [query, category, brand, min, max, sort, onlyOffers]);

  const clear = () => {
    setQuery("");
    setCategory("All");
    setBrand("All");
    setOnlyOffers(false);
    setMin(0);
    setMax(1500);
    setParams({});
    setMobileFilterOpen(false);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">SHOP</span>
            <h1>Find Your Favorites</h1>
            <p>
              {onlyOffers ? "Special Discounts & Promotional Offers" : "Explore our collection of quality products at great prices."}
            </p>
          </div>
          <button
            className="mobile-filter"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            aria-label="Toggle Filters"
          >
            <SlidersHorizontal size={14} /> Filters {onlyOffers ? "(Offers)" : ""}
          </button>
        </div>

        <div className="shop-layout">
          {/* Filters Sidebar */}
          <aside className={mobileFilterOpen ? "filters card open-mobile" : "filters card"}>
            <div className="filter-title">
              <b>Filters</b>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button onClick={clear}>Clear All</button>
                {mobileFilterOpen && (
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    style={{ color: "#ef4444", fontWeight: 700 }}
                  >
                    ✕ Close
                  </button>
                )}
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", margin: "14px 0", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={onlyOffers}
                onChange={(e) => setOnlyOffers(e.target.checked)}
                style={{ width: "16px", height: "16px", margin: 0 }}
              />
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#6246e8" }}>🔥 Discounted Offers Only</span>
            </label>

            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                {cats.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Brand
              <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Price Range ($)
              <div className="range-row">
                <input
                  type="number"
                  value={min}
                  min={0}
                  onChange={(e) => setMin(+e.target.value)}
                />
                <span>—</span>
                <input
                  type="number"
                  value={max}
                  min={0}
                  onChange={(e) => setMax(+e.target.value)}
                />
              </div>
            </label>

            {/* Search Box placed below Price Range */}
            <label>
              Search
              <div style={{ position: "relative", marginTop: "6px" }}>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder=""
                  aria-label="Search products"
                  style={{ paddingRight: "34px", margin: 0 }}
                />
                <button
                  type="button"
                  aria-label="Search"
                  style={{
                    position: "absolute",
                    right: "6px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: 0,
                    padding: "4px",
                    display: "grid",
                    placeItems: "center",
                    color: "#6246e8",
                    cursor: "pointer",
                  }}
                >
                  <Search size={16} />
                </button>
              </div>
            </label>

            {mobileFilterOpen && (
              <button
                className="btn btn-primary"
                style={{ width: "100%", marginTop: "16px" }}
                onClick={() => setMobileFilterOpen(false)}
              >
                Apply Filters ({result.length} items)
              </button>
            )}
          </aside>

          {/* Results Grid */}
          <section className="shop-results">
            <div className="results-head">
              <b>{result.length} products found</b>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="popular">Sort by popularity</option>
                <option value="new">Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

            {result.length ? (
              <div className="products-grid">
                {result.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    wished={wishlist.includes(p.id)}
                    onWish={() => onWish(p.id)}
                    onCart={() => onCart(p)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty card">
                <X size={38} />
                <h2>No products found</h2>
                <p>Try changing your filters or search terms.</p>
                <button className="btn btn-primary" onClick={clear}>
                  Clear Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}