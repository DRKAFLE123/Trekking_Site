import React from 'react';
import config from '@/payload/payload.config';
import '@payloadcms/next/css';
import './admin.css';
import '../../payload/custom-admin.css';
import { RootLayout } from '@payloadcms/next/layouts';
import { handleServerFunctions } from './server-actions';
import { importMap } from './admin/importMap.js';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={handleServerFunctions as any}>
      {children}
    </RootLayout>
  );
}
