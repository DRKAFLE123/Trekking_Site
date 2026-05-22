"use server";

import { handleServerFunctions as payloadHandleServerFunctions } from '@payloadcms/next/layouts';

export async function handleServerFunctions(args: any) {
  return (payloadHandleServerFunctions as any)(args);
}
