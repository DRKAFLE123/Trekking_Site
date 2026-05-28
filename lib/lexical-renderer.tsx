import React from 'react';

export interface HeadingItem {
  id: string;
  text: string;
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
    if (node.type === 'heading' && node.tag === 'h2' && node.children) {
      const text = node.children
        .filter((c: any) => c.type === 'text')
        .map((c: any) => c.text)
        .join('');
      if (text) {
        headings.push({ id: slugify(text), text });
      }
    }
    // PortableText fallback style
    if (node._type === 'block' && node.style === 'h2' && node.children) {
      const text = node.children.map((c: any) => c.text).join('');
      if (text) {
        headings.push({ id: slugify(text), text });
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
        if (block.style === 'h2') {
          return (
            <h2 id={slugify(text)} key={idx} className="font-serif text-2xl font-bold text-primary mt-8 mb-4 border-b border-secondary/10 pb-2 scroll-mt-28">
              {text}
            </h2>
          );
        }
        if (block.style === 'h3') {
          return (
            <h3 key={idx} className="font-serif text-xl font-bold text-primary mt-6 mb-3">
              {text}
            </h3>
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
      if (node.tag === 'h2') {
        const textStr = node.children
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join('');
        return (
          <h2 id={slugify(textStr)} key={idx} className="font-serif text-2xl font-bold text-primary mt-8 mb-4 border-b border-secondary/10 pb-2 scroll-mt-28">
            {text}
          </h2>
        );
      }
      if (node.tag === 'h3') {
        return (
          <h3 key={idx} className="font-serif text-xl font-bold text-primary mt-6 mb-3">
            {text}
          </h3>
        );
      }
      return <h4 key={idx} className="font-serif text-lg font-bold text-primary mt-4 mb-2">{text}</h4>;
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
    return null;
  });
}

function renderLexicalChildren(children: any[]): React.ReactNode {
  return children.map((child, idx) => {
    if (child.type === 'text') {
      const text = child.text;
      if (child.format & 1) { // Bold
        return <strong key={idx}>{text}</strong>;
      }
      if (child.format & 2) { // Italic
        return <em key={idx}>{text}</em>;
      }
      return <span key={idx}>{text}</span>;
    }
    if (child.type === 'link' && child.children) {
      return (
        <a key={idx} href={child.fields?.url || '#'} className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
          {renderLexicalChildren(child.children)}
        </a>
      );
    }
    return null;
  });
}
