import { NotFoundPage } from '@payloadcms/next/views';
import config from '@/payload/payload.config';
import { importMap } from '../importMap.js';

interface NotFoundProps {
  params: Promise<{ segments?: string[] }>;
  searchParams?: Promise<Record<string, string | string[]>>;
}

export default async function NotFound({ params, searchParams }: NotFoundProps) {
  return (
    <NotFoundPage
      params={params as any}
      searchParams={(searchParams || Promise.resolve({})) as any}
      config={config}
      importMap={importMap}
    />
  );
}
