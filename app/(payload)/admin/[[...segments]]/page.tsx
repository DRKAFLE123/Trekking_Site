import { RootPage } from '@payloadcms/next/views';
import config from '@/payload/payload.config';
import { importMap } from '../importMap.js';

interface Props {
  params: Promise<{ segments?: string[] }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function Page({ params, searchParams }: Props) {
  return <RootPage params={params as any} searchParams={searchParams as any} config={config} importMap={importMap} />;
}
