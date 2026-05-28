import { RootPage } from '@payloadcms/next/views';
import config from '@/payload/payload.config';
import { importMap } from '../importMap.js';

interface Props {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function Page({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  return <RootPage params={resolvedParams as any} searchParams={resolvedSearchParams as any} config={config} importMap={importMap} />;
}
