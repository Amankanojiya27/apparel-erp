// File: components/SampleImageGallery.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { SampleImage } from '@/lib/style-types';

export function SampleImageGallery({ images, designNumber }: { images: SampleImage[]; designNumber: string }) {
  const [selected, setSelected] = useState(0);
  if (!images?.length) return <p className="text-sm text-slate-500">No sample images uploaded.</p>;

  const current = images[selected] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] max-h-80 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
        <Image
          src={current.url}
          alt={current.label}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 400px"
          unoptimized
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
          <p className="font-medium">{current.label}</p>
          <p className="text-xs capitalize opacity-90">{current.type} · {designNumber}</p>
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {images.map((img, i) => (
          <button
            key={img._id}
            type="button"
            onClick={() => setSelected(i)}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 ${
              selected === i ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200'
            }`}
          >
            <Image src={img.url} alt={img.label} fill className="object-cover" sizes="64px" unoptimized />
          </button>
        ))}
      </div>
    </div>
  );
}
