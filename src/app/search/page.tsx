'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '@/types/commerce';
import { getProducts } from '@/lib/shopify';
import { ProductCard } from '@/components/product/ProductCard';
import { Search as SearchIcon, X } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      try {
        const all = await getProducts();
        setProducts(all);
        setFiltered(all);
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered(products);
      return;
    }
    const q = query.toLowerCase();
    const matches = products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.productType.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
    setFiltered(matches);
  }, [query, products]);

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto space-y-12">
      {/* Search Header */}
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-display font-light text-white tracking-tight">
          Catalog Search
        </h1>
        <p className="text-xs text-text-secondary leading-relaxed">
          Locate acoustic instruments, horological calibres, and titanium security hardware.
        </p>

        {/* Input box */}
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by model, material, or complication (e.g. Titanium, Planar, Tourbillon)..."
            className="w-full px-5 py-4 pl-12 pr-12 rounded-2xl bg-surface-card border border-white/10 text-white placeholder-text-muted focus:outline-none focus:border-accent-gold text-sm font-mono transition-all shadow-xl"
            autoFocus
          />
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Results grid */}
      <div>
        <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] text-xs font-mono text-text-secondary">
          <span>{filtered.length} Artifacts Indexed</span>
          {query && <span>Filter: &quot;{query}&quot;</span>}
        </div>

        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-accent-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <p className="text-white text-base">No matching masterworks found</p>
            <p className="text-xs text-text-muted">
              Try searching for &quot;Titanium&quot;, &quot;Planar&quot;, or &quot;Speaker&quot;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
