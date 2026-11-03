import React, { useState, useEffect } from 'react';

interface CollegeLogoProps {
  logoUrl?: string | null;
  collegeName?: string;
  collegeCode?: string;
  className?: string;
  fallbackClassName?: string;
}

export const CollegeLogo: React.FC<CollegeLogoProps> = ({
  logoUrl,
  collegeName,
  collegeCode,
  className = 'h-8 w-8 rounded-lg object-contain p-0.5 bg-background border border-border shadow-xs',
  fallbackClassName,
}) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [logoUrl]);

  const displayCode = collegeCode?.trim() || 'COL';
  const displayName = collegeName?.trim() || displayCode;

  if (!logoUrl || hasError) {
    const fallbackClasses =
      fallbackClassName ||
      'h-8 w-8 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold font-mono text-xs flex items-center justify-center shrink-0 shadow-xs';

    return (
      <div className={fallbackClasses} title={displayName}>
        {displayCode}
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={displayName}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
    />
  );
};
