import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface DishImageProps {
  src: string;
  alt: string;
  className?: string;
  scrimClassName?: string;
}

export function DishImage({
  src,
  alt,
  className = '',
  scrimClassName = 'bg-gradient-to-t from-[#1c1b1b] via-[#1c1b1b]/20 to-transparent',
}: DishImageProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#1a1919] ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#2a2a2a] via-[#1c1b1b] to-[#131313] p-6 text-center"
          role="img"
          aria-label={alt}
        >
          <Utensils className="h-7 w-7 text-[#ff5e36]" aria-hidden="true" />
          <span className="max-w-[22ch] text-xs font-medium text-[#e5e2e1]/80">{alt}</span>
        </div>
      )}
      <div className={`pointer-events-none absolute inset-0 ${scrimClassName}`} aria-hidden="true" />
    </div>
  );
}
