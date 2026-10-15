'use client';
import React, { useState } from 'react';
import { useFormFields } from '@payloadcms/ui';

// Sidebar box on blog posts: the public address of this post on the website.
// The admin URL itself (/admin/collections/blogPosts/89) is Payload's ID routing;
// this shows the address visitors and Google use.
const SITE = 'https://natureheaventreks.com';

export const PublicUrlField = () => {
  const slug = useFormFields(([fields]) => fields?.slug?.value as string | undefined);
  const status = useFormFields(([fields]) => (fields?._status?.value ?? fields?.status?.value) as string | undefined);
  const [copied, setCopied] = useState(false);

  const path = slug ? `/blogs/${slug}` : '';
  const url = `${SITE}${path}`;
  const isPublished = status === 'published';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const box: React.CSSProperties = { border: '1px solid var(--theme-elevation-150)', borderRadius: 6, padding: '10px 12px', marginBottom: 24, fontSize: 13 };
  const btn: React.CSSProperties = { border: '1px solid var(--theme-elevation-200)', background: 'var(--theme-elevation-0)', borderRadius: 4, padding: '4px 10px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: 'var(--theme-text)', textDecoration: 'none' };

  return (
    <div style={box}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Page address</div>
      {!slug ? (
        <div style={{ color: 'var(--theme-elevation-500)' }}>Appears once the post has a slug.</div>
      ) : (
        <>
          <div style={{ wordBreak: 'break-all', color: 'var(--theme-elevation-800)', marginBottom: 8 }}>
            natureheaventreks.com{path}
          </div>
          {isPublished ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <a href={url} target="_blank" rel="noopener noreferrer" style={btn}>Open ↗</a>
              <button type="button" onClick={copy} style={btn}>{copied ? 'Copied' : 'Copy link'}</button>
            </div>
          ) : (
            <div style={{ color: 'var(--theme-elevation-500)', lineHeight: 1.4 }}>
              Not public yet: this address works after you publish. Use <strong>Preview</strong> at the top to see the draft.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PublicUrlField;
