"use server";

import { handleServerFunctions as payloadHandleServerFunctions } from '@payloadcms/next/layouts';
import config from '@/payload/payload.config';
import { importMap } from './admin/importMap.js';

export async function handleServerFunctions(args: any) {
  return (payloadHandleServerFunctions as any)({ ...args, config, importMap });
}
