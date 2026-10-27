import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-6 text-center space-y-6">
      <div className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-accent-gold uppercase tracking-widest">
        Anomaly 404
      </div>
      <h1 className="text-4xl md:text-6xl font-display font-light text-white">
        Coordinates Unknown
      </h1>
      <p className="max-w-md text-xs md:text-sm text-text-secondary leading-relaxed">
        The requested acoustic instrument or horological complication has been relocated or is
        unrecorded in this archive.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-white text-black text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors shadow-lg"
      >
        Return to Flagship
      </Link>
    </div>
  );
}
