import React from 'react';
import Link from 'next/link';
import { getMediaUrl } from './cloudinary-loader';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

export function extractHeadings(body: any): HeadingItem[] {
  if (!body || typeof body === 'string') return [];
  const headings: HeadingItem[] = [];

  const traverse = (node: any) => {
    if (node.type === 'heading' && /^h[2-6]$/.test(node.tag || '') && node.children) {
      const text = node.children
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.text)
        .join('');
      if (text) {
        const level = parseInt(node.tag.substring(1), 10);
        headings.push({ id: slugify(text), text, level });
      }
    }
    // PortableText fallback style
    if (node._type === 'block' && /^h[2-6]$/.test(node.style || '') && node.children) {
      const text = node.children.map((c: any) => c.text).join('');
      if (text) {
        const level = parseInt(node.style.substring(1), 10);
        headings.push({ id: slugify(text), text, level });
      }
    }

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach(traverse);
    }
    if (node.root && node.root.children) {
      node.root.children.forEach(traverse);
    }
  };

  if (Array.isArray(body)) {
    body.forEach(traverse);
  } else {
    traverse(body);
  }
  return headings;
}

export function renderLexical(body: any): React.ReactNode {
  if (!body) return null;
  if (typeof body === 'string') {
    return <p className="my-3 leading-relaxed text-charcoal/85 text-sm md:text-base">{body}</p>;
  }

  // 1. Lexical RichText Format (Payload default)
  if (body.root && body.root.children) {
    return renderLexicalNodes(body.root.children);
  }

  // 2. Sanity/PortableText Fallback (Array of blocks)
  if (Array.isArray(body)) {
    return body.map((block: any, idx: number) => {
      if (block._type === 'block' && block.children) {
        const text = block.children.map((c: any) => c.text).join('');
        if (/^h[2-6]$/.test(block.style || '')) {
          const Tag = block.style as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
          const fontSize = 
            Tag === 'h2' ? 'text-2xl' : 
            Tag === 'h3' ? 'text-xl' : 
            Tag === 'h4' ? 'text-lg' : 
            Tag === 'h5' ? 'text-base' : 'text-sm';
          const borderStyle = Tag === 'h2' ? 'border-b border-secondary/10 pb-2 scroll-mt-28' : 'scroll-mt-28';
          const spacingClass = Tag === 'h2' ? 'mt-8 mb-4' : Tag === 'h3' ? 'mt-6 mb-3' : 'mt-4 mb-2';
          
          return (
            <Tag 
              id={slugify(text)} 
              key={idx} 
              className={`font-serif ${fontSize} font-bold text-primary ${spacingClass} ${borderStyle}`}
            >
              {text}
            </Tag>
          );
        }
        return (
          <p key={idx} className="my-3 leading-relaxed text-charcoal/85 text-sm md:text-base">
            {text}
          </p>
        );
      }
      return null;
    });
  }

  return null;
}

function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function getVimeoId(url: string): string | null {
  const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/posts\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

function renderLexicalNodes(nodes: any[]): React.ReactNode {
  return nodes.map((node, idx) => {
    if (node.type === 'paragraph' && node.children) {
      if (node.children.length === 1 && node.children[0].type === 'link' && node.children[0].fields?.url) {
        const linkUrl = node.children[0].fields.url;
        const ytId = getYouTubeId(linkUrl);
        if (ytId) {
          return (
            <div key={idx} className="my-6 rounded-xl overflow-hidden shadow-md aspect-video w-full bg-black">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${ytId}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          );
        }
        const vimeoId = getVimeoId(linkUrl);
        if (vimeoId) {
          return (
            <div key={idx} className="my-6 rounded-xl overflow-hidden shadow-md aspect-video w-full bg-black">
              <iframe
                src={`https://player.vimeo.com/video/${vimeoId}`}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          );
        }
      }

      return (
        <p key={idx} className="my-3 leading-relaxed text-charcoal/85 text-sm md:text-base">
          {renderLexicalChildren(node.children)}
        </p>
      );
    }
    if (node.type === 'upload' && node.value) {
      const media = node.value;
      const url = media.url || '';
      const alt = media.alt || '';
      const mimeType = media.mimeType || '';

      if (mimeType.startsWith('video/')) {
        return (
          <div key={idx} className="my-6 rounded-xl overflow-hidden border border-secondary/10 shadow-md bg-black max-w-full">
            <video
              src={url}
              controls
              className="w-full h-auto aspect-video object-contain"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
            {alt && <div className="p-3 text-xs text-charcoal/60 bg-white italic border-t border-secondary/5 text-center">{alt}</div>}
          </div>
        );
      }

      return (
        <div key={idx} className="my-6 flex flex-col items-center gap-2">
          <img
            src={url}
            alt={alt}
            className="rounded-xl object-cover shadow-md w-full max-h-[500px]"
          />
          {alt && <span className="text-xs text-charcoal/60 italic text-center">{alt}</span>}
        </div>
      );
    }
    if (node.type === 'heading' && node.children) {
      const text = renderLexicalChildren(node.children);
      const textStr = node.children
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.text)
        .join('');
      const headingId = slugify(textStr);

      if (node.tag === 'h2') {
        return (
          <h2 id={headingId} key={idx} className="font-serif text-2xl font-bold text-primary mt-8 mb-4 border-b border-secondary/10 pb-2 scroll-mt-28">
            {text}
          </h2>
        );
      }
      if (node.tag === 'h3') {
        return (
          <h3 id={headingId} key={idx} className="font-serif text-xl font-bold text-primary mt-6 mb-3 scroll-mt-28">
            {text}
          </h3>
        );
      }
      if (node.tag === 'h4') {
        return (
          <h4 id={headingId} key={idx} className="font-serif text-lg font-bold text-primary mt-4 mb-2 scroll-mt-28">
            {text}
          </h4>
        );
      }
      if (node.tag === 'h5') {
        return (
          <h5 id={headingId} key={idx} className="font-serif text-base font-bold text-primary mt-4 mb-2 scroll-mt-28">
            {text}
          </h5>
        );
      }
      if (node.tag === 'h6') {
        return (
          <h6 id={headingId} key={idx} className="font-serif text-sm font-bold text-primary mt-4 mb-2 scroll-mt-28">
            {text}
          </h6>
        );
      }
      return <h4 id={headingId} key={idx} className="font-serif text-lg font-bold text-primary mt-4 mb-2 scroll-mt-28">{text}</h4>;
    }
    if (node.type === 'list' && node.children) {
      const listItems = node.children.map((li: any, liIdx: number) => (
        <li key={liIdx} className="my-1 text-sm md:text-base text-charcoal/85">
          {renderLexicalChildren(li.children)}
        </li>
      ));
      if (node.listType === 'number') {
        return <ol key={idx} className="list-decimal list-inside my-4 flex flex-col gap-1">{listItems}</ol>;
      }
      return <ul key={idx} className="list-disc list-inside my-4 flex flex-col gap-1">{listItems}</ul>;
    }
    if (node.type === 'quote' && node.children) {
      return (
        <blockquote key={idx} className="border-l-4 border-secondary bg-primary/5 pl-4 py-2.5 my-4 italic text-charcoal/80 rounded-r-lg">
          {renderLexicalNodes(node.children)}
        </blockquote>
      );
    }
    if (node.type === 'code' && node.children) {
      return (
        <pre key={idx} className="bg-slate-100 border border-slate-200/60 rounded-xl p-4 my-4 overflow-x-auto text-xs md:text-sm font-mono text-slate-800 leading-normal">
          <code>{renderLexicalChildren(node.children)}</code>
        </pre>
      );
    }
    if (node.type === 'table' && node.children) {
      return (
        <div key={idx} className="overflow-x-auto w-full my-6 rounded-xl border border-secondary/15 shadow-sm">
          <table className="min-w-full divide-y divide-secondary/15 text-sm">
            <tbody className="divide-y divide-secondary/10 bg-white">
              {renderLexicalNodes(node.children)}
            </tbody>
          </table>
        </div>
      );
    }
    if (node.type === 'tablerow' && node.children) {
      return (
        <tr key={idx} className="hover:bg-primary/[0.02] transition">
          {renderLexicalNodes(node.children)}
        </tr>
      );
    }
    if (node.type === 'tablecell' && node.children) {
      const isHeader = node.headerState && node.headerState > 0;
      const CellTag = isHeader ? 'th' : 'td';
      return (
        <CellTag
          key={idx}
          className={`px-4 py-3 text-left ${
            isHeader
              ? 'bg-primary/5 font-bold text-primary border-b border-secondary/20'
              : 'text-charcoal/80'
          }`}
          style={node.width ? { width: `${node.width}px` } : undefined}
        >
          {renderLexicalNodes(node.children)}
        </CellTag>
      );
    }
    if (node.type === 'block' && node.fields) {
      const blockType = node.fields.blockType;
      
      if (blockType === 'trekCardBlock') {
        const trek = node.fields.trek;
        if (trek) {
          const trekTitle = trek.title || 'Trek Details';
          const duration = trek.duration ? `${trek.duration} Days` : '';
          const difficulty = trek.difficulty
            ? trek.difficulty.charAt(0).toUpperCase() + trek.difficulty.slice(1)
            : '';
          const price = trek.discountedPrice || trek.price || 0;
          const oneLiner = node.fields.customOneLiner || trek.metaDescription || '';
          const imageSrc =
            getMediaUrl(trek.heroImage) ||
            'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=400';

          return (
            <a
              key={idx}
              href={`/trips/${trek.slug}`}
              className="trek-card-link"
              style={{
                display: 'flex',
                alignItems: 'stretch',
                margin: '20px 0',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #334155',
                boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                backgroundColor: '#1E2D3D',
                textDecoration: 'none',
                transition: 'box-shadow 0.25s, transform 0.25s',
              }}
            >
              {/* Left: compact photo */}
              <div style={{ width: '120px', minWidth: '120px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#0f1f2e' }}>
                <img
                  src={imageSrc}
                  alt={trekTitle}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '90px', display: 'block' }}
                />
              </div>

              {/* Middle: info */}
              <div style={{ flex: 1, padding: '10px 14px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '4px' }}>
                <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#ffffff', lineHeight: '1.3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {trekTitle}
                </h3>
                {oneLiner && (
                  <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {oneLiner}
                  </p>
                )}
                {(duration || difficulty) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                    {duration && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
                        🗓 {duration}
                      </span>
                    )}
                    {difficulty && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, color: '#94a3b8' }}>
                        📈 {difficulty}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Right: price badge */}
              <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, padding: '0 14px' }}>
                <span style={{ backgroundColor: '#E67E22', color: '#ffffff', fontSize: '13px', fontWeight: 700, padding: '8px 14px', borderRadius: '8px', whiteSpace: 'nowrap' }}>
                  US$ {price}
                </span>
              </div>
            </a>
          );
        }
      }

      if (blockType === 'ctaBlock') {
        const { headline, buttonText, whatsappNumber } = node.fields;
        return (
          <div
            key={idx}
            style={{
              margin: '24px 0',
              padding: '28px 24px',
              backgroundColor: '#D9EAF5',
              borderRadius: '12px',
              border: '1px solid #B8D4E8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: '12px',
            }}
          >
            <p style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#1A3F5E', lineHeight: '1.4' }}>
              {headline}
            </p>
            <Link
              href="/plan-a-trip"
              className="blog-cta-btn"
              style={{
                display: 'inline-block',
                backgroundColor: '#1B7047',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: 700,
                padding: '10px 28px',
                borderRadius: '8px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                transition: 'background-color 0.2s',
              }}
            >
              {buttonText}
            </Link>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '13px', fontWeight: 600, color: '#1B5FA8', textDecoration: 'none' }}
              >
                Or Call on Whatsapp {whatsappNumber}
              </a>
            )}
          </div>
        );
      }
    }
    return null;
  });
}

function formatText(text: string, format: number, key: any) {
  let element: React.ReactNode = <span>{text}</span>;
  if (format & 1) { // Bold
    element = <strong>{element}</strong>;
  }
  if (format & 2) { // Italic
    element = <em>{element}</em>;
  }
  if (format & 4) { // Strikethrough
    element = <del>{element}</del>;
  }
  if (format & 8) { // Underline
    element = <u>{element}</u>;
  }
  if (format & 16) { // Code
    element = <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono text-xs md:text-sm">{element}</code>;
  }
  if (format & 32) { // Subscript
    element = <sub>{element}</sub>;
  }
  if (format & 64) { // Superscript
    element = <sup>{element}</sup>;
  }
  return <React.Fragment key={key}>{element}</React.Fragment>;
}

function renderLexicalChildren(children: any[]): React.ReactNode {
  return children.map((child, idx) => {
    if (child.type === 'text') {
      return formatText(child.text, child.format || 0, idx);
    }
    if (child.type === 'link' && child.children) {
      return (
        <a key={idx} href={child.fields?.url || '#'} className="text-secondary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
          {renderLexicalChildren(child.children)}
        </a>
      );
    }
    return null;
  });
}
