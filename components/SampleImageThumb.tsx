'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { SampleImage } from '@/lib/style-types';

interface Props {
  images?: SampleImage[];
  styleId?: string;
  designNumber?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'h-10 w-10', md: 'h-14 w-14', lg: 'h-24 w-24' };

export function SampleImageThumb({ images, styleId, designNumber, size = 'sm' }: Props) {
  const img = images?.[0];
  if (!img) {
    return (
      <div className={`${sizes[size]} shrink-0 rounded-lg bg-slate-200 flex items-center justify-center text-xs text-slate-500`}>
        N/A
      </div>
    );
  }

  const inner = (
    <div className={`relative ${sizes[size]} shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100`}>
      <Image src={img.url} alt={img.label || designNumber || 'Sample'} fill className="object-cover" sizes="96px" unoptimized />
    </div>
  );

  if (styleId) {
    return (
      <Link href={`/styles/${styleId}`} title={`${designNumber} — ${img.label}`} className="block hover:ring-2 hover:ring-blue-400 rounded-lg">
        {inner}
      </Link>
    );
  }
  return inner;
}
