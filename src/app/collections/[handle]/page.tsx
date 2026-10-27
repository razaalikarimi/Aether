import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getCollectionByHandle, getCollections } from '@/lib/shopify';
import { ProductCard } from '@/components/product/ProductCard';
import { Sparkles } from 'lucide-react';

interface CollectionPageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const collection = await getCollectionByHandle(params.handle);
  if (!collection) {
    return { title: 'Collection Not Found — AETHER' };
  }

  return {
    title: `${collection.title} — AETHER Atelier`,
    description: collection.description,
  };
}

export async function generateStaticParams() {
  const collections = await getCollections();
  return collections.map((c) => ({
    handle: c.handle,
  }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const collection = await getCollectionByHandle(params.handle);

  if (!collection) {
    notFound();
  }

  return (
    <div className="pt-28 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Collection Header */}
      <div className="pb-12 border-b border-white/[0.08] space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" /> Atelier Collection
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-light text-white tracking-tight">
          {collection.title}
        </h1>
        <p className="text-xs md:text-sm text-text-secondary max-w-xl leading-relaxed">
          {collection.description}
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
        {collection.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
