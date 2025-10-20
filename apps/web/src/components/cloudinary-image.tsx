'use client';

import { CldImage, type CldImageProps } from 'next-cloudinary';

export function CloudinaryImage(props: CldImageProps) {
  return <CldImage {...props} />;
}
