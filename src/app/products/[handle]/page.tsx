import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductByHandle, getProducts } from '@/lib/shopify';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

interface ProductPageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await getProductByHandle(params.handle);
  if (!product) {
    return { title: 'Product Not Found — AETHER' };
  }

  return {
    title: `${product.title} — AETHER Atelier`,
    description: product.description,
    openGraph: {
      title: `${product.title} — AETHER`,
      description: product.description,
      images: [{ url: product.featuredImage.url }],
    },
  };
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    handle: product.handle,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}
