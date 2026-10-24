'use client';

import React from 'react';

export type CustomIconName =
  | 'home'
  | 'cursor'
  | 'cloud'
  | 'pen'
  | 'cool_cat'
  | 'sparkles'
  | 'broom'
  | 'wand'
  | 'piggy'
  | 'shop'
  | 'tag'
  | 'target'
  | 'trophy'
  | 'note_smile'
  | 'heart'
  | 'venn'
  | 'layers'
  | 'leaf'
  | 'crown'
  | 'water'
  | 'eye_slash'
  | 'chat_lock'
  | 'cards'
  | 'bell'
  | 'bucket_smile'
  | 'text_tool'
  | 'briefcase'
  | 'flame'
  | 'network'
  | 'easel';

interface CustomIconProps {
  name: CustomIconName;
  className?: string;
  white?: boolean;
  alt?: string;
}

export const CustomIcon: React.FC<CustomIconProps> = ({
  name,
  className = 'w-5 h-5',
  white = false,
  alt = '',
}) => {
  const iconSrc = white
    ? `/custom-icons/${name}-white.png`
    : `/custom-icons/${name}.png`;

  return (
    <img
      src={iconSrc}
      alt={alt || name}
      className={`inline-block object-contain shrink-0 select-none ${className}`}
      loading="eager"
      draggable={false}
    />
  );
};
