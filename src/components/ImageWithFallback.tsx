import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 p-3 text-center select-none ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || 'Photography frame'}
      >
        <Camera className="w-6 h-6 mb-1.5 opacity-60" />
        {fallbackTitle && (
          <span className="text-xs font-medium line-clamp-1 max-w-full">{fallbackTitle}</span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || ''}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
      {...props}
    />
  );
};
