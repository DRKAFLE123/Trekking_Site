'use client';
import { useRowLabel } from '@payloadcms/ui';

// Shows each Page SEO row by its address ("/trips") instead of "Page 01".
export const PageSeoRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ path?: string }>();
  return <span>{data?.path || `Page ${String((rowNumber ?? 0) + 1).padStart(2, '0')}`}</span>;
};

export default PageSeoRowLabel;
