import React, { useState } from 'react';
import { getStudentPhotoUrl } from '@/lib/riskEngine';

interface StudentAvatarProps {
  name: string;
  photoUrl?: string | null;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const StudentAvatar: React.FC<StudentAvatarProps> = ({
  name,
  photoUrl,
  size = 'sm',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);
  const resolvedUrl = getStudentPhotoUrl(photoUrl || undefined);

  const sizeClasses =
    size === 'xs'
      ? 'h-6 w-6 text-[9px]'
      : size === 'md'
      ? 'h-9 w-9 text-xs'
      : 'h-7 w-7 text-[10px]';

  const initials = (name || 'S')
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (resolvedUrl && !imgError) {
    return (
      <img
        src={resolvedUrl}
        alt={name}
        onError={() => setImgError(true)}
        className={`${sizeClasses} rounded-full object-cover border border-border shrink-0 bg-muted ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses} rounded-full bg-primary/10 border border-primary/20 text-primary font-bold font-mono flex items-center justify-center shrink-0 ${className}`}
    >
      {initials || 'ST'}
    </div>
  );
};
