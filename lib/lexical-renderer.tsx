import React from 'react';

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
            <h2 key={idx} className="font-serif text-2xl font-bold text-primary mt-8 mb-4 border-b border-secondary/10 pb-2">
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

function renderLexicalNodes(nodes: any[]): React.ReactNode {
  return nodes.map((node, idx) => {
    if (node.type === 'paragraph' && node.children) {
      return (
        <p key={idx} className="my-3 leading-relaxed text-charcoal/85 text-sm md:text-base">
          {renderLexicalChildren(node.children)}
        </p>
      );
    }
    if (node.type === 'heading' && node.children) {
      const text = renderLexicalChildren(node.children);
      if (node.tag === 'h2') {
        return (
          <h2 key={idx} className="font-serif text-2xl font-bold text-primary mt-8 mb-4 border-b border-secondary/10 pb-2">
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
