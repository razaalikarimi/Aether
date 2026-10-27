import { getProducts } from '@/lib/shopify';
import { CinematicStoryScroll } from '@/components/home/CinematicStoryScroll';
import { FeaturedCollection } from '@/components/home/FeaturedCollection';
import { TechSpecsSection } from '@/components/home/TechSpecsSection';

export const revalidate = 60; // ISR revalidation

export default async function HomePage() {
  const products = await getProducts();
  const flagshipProduct = products.find((p) => p.isFlagship3D) || products[0];

  return (
    <div className="relative w-full overflow-hidden bg-[#070709]">
      {/* 1. Cinematic 3D Storytelling Experience (Hero, Orbital, Exploded, Finishes) */}
      <CinematicStoryScroll variants={flagshipProduct.variants} />

      {/* 2. Permanent Collection Discovery */}
      <FeaturedCollection products={products} />

      {/* 3. Engineering Telemetry & Specs */}
      <TechSpecsSection />
    </div>
  );
}
