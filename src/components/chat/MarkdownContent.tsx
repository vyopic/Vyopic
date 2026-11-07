import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownContentProps {
  content: string;
  isDark?: boolean;
}

export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, isDark = false }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = async (codeText: string, index: number) => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Parse code blocks with ```lang ... ```
  const parts: Array<{ type: 'text' | 'code'; content: string; language?: string }> = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex, match.index)
      });
    }
    parts.push({
      type: 'code',
      language: match[1] || 'text',
      content: match[2].trimEnd()
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push({
      type: 'text',
      content: content.substring(lastIndex)
    });
  }

  const renderInlineFormatted = (rawText: string) => {
    // Process inline bold **text**, inline code `code`, italic *text*
    const segments = rawText.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

    return segments.map((seg, idx) => {
      if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 2) {
        return (
          <code
            key={idx}
            className={`px-1.5 py-0.5 rounded text-[12px] font-mono font-medium ${
              isDark
                ? 'bg-slate-800 text-blue-300 border border-slate-700'
                : 'bg-slate-100 text-blue-700 border border-slate-200'
            }`}
          >
            {seg.slice(1, -1)}
          </code>
        );
      }
      if (seg.startsWith('**') && seg.endsWith('**') && seg.length > 4) {
        return (
          <strong key={idx} className="font-bold">
            {seg.slice(2, -2)}
          </strong>
        );
      }
      if (seg.startsWith('*') && seg.endsWith('*') && seg.length > 2) {
        return (
          <em key={idx} className="italic">
            {seg.slice(1, -1)}
          </em>
        );
      }
      return seg;
    });
  };

  const renderTextBlock = (text: string, partIndex: number) => {
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;

    const flushList = (key: string) => {
      if (!listBuffer) return null;
      const current = listBuffer;
      listBuffer = null;

      if (current.type === 'ul') {
        return (
          <ul key={key} className="list-disc list-outside pl-5 space-y-1 my-2">
            {current.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ul>
        );
      } else {
        return (
          <ol key={key} className="list-decimal list-outside pl-5 space-y-1 my-2">
            {current.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {renderInlineFormatted(item)}
              </li>
            ))}
          </ol>
        );
      }
    };

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();

      // Heading 1 (# ...)
      if (line.startsWith('# ')) {
        if (listBuffer) elements.push(flushList(`list-${lineIdx}`));
        elements.push(
          <h1 key={lineIdx} className="text-xl font-extrabold tracking-tight mt-4 mb-2">
            {renderInlineFormatted(line.slice(2))}
          </h1>
        );
        return;
      }

      // Heading 2 (## ...)
      if (line.startsWith('## ')) {
        if (listBuffer) elements.push(flushList(`list-${lineIdx}`));
        elements.push(
          <h2 key={lineIdx} className="text-lg font-bold tracking-tight mt-3 mb-1.5 text-blue-600 dark:text-blue-400">
            {renderInlineFormatted(line.slice(3))}
          </h2>
        );
        return;
      }

      // Heading 3 (### ...)
      if (line.startsWith('### ')) {
        if (listBuffer) elements.push(flushList(`list-${lineIdx}`));
        elements.push(
          <h3 key={lineIdx} className="text-sm font-bold mt-2.5 mb-1">
            {renderInlineFormatted(line.slice(4))}
          </h3>
        );
        return;
      }

      // Blockquote (> ...)
      if (line.startsWith('> ')) {
        if (listBuffer) elements.push(flushList(`list-${lineIdx}`));
        elements.push(
          <blockquote
            key={lineIdx}
            className={`border-l-4 pl-3.5 py-1 my-2 italic text-sm ${
              isDark ? 'border-blue-500 bg-slate-800/40 text-slate-300' : 'border-blue-600 bg-blue-50/50 text-slate-700'
            }`}
          >
            {renderInlineFormatted(line.slice(2))}
          </blockquote>
        );
        return;
      }

      // Unordered list item (- ... or * ...)
      const ulMatch = line.match(/^[-*]\s+(.+)/);
      if (ulMatch) {
        if (!listBuffer || listBuffer.type !== 'ul') {
          if (listBuffer) elements.push(flushList(`list-prev-${lineIdx}`));
          listBuffer = { type: 'ul', items: [] };
        }
        listBuffer.items.push(ulMatch[1]);
        return;
      }

      // Ordered list item (1. ...)
      const olMatch = line.match(/^(\d+)\.\s+(.+)/);
      if (olMatch) {
        if (!listBuffer || listBuffer.type !== 'ol') {
          if (listBuffer) elements.push(flushList(`list-prev-${lineIdx}`));
          listBuffer = { type: 'ol', items: [] };
        }
        listBuffer.items.push(olMatch[2]);
        return;
      }

      // Regular line or empty line
      if (listBuffer) {
        elements.push(flushList(`list-before-${lineIdx}`));
      }

      if (!trimmed) {
        elements.push(<div key={lineIdx} className="h-2" />);
      } else {
        elements.push(
          <p key={lineIdx} className="leading-relaxed my-1">
            {renderInlineFormatted(line)}
          </p>
        );
      }
    });

    if (listBuffer) {
      elements.push(flushList(`list-final-${partIndex}`));
    }

    return <div key={partIndex} className="space-y-1">{elements}</div>;
  };

  return (
    <div className="text-sm leading-relaxed space-y-3">
      {parts.map((part, pIdx) => {
        if (part.type === 'code') {
          return (
            <div
              key={pIdx}
              className={`rounded-2xl overflow-hidden my-3 border text-xs font-mono shadow-sm ${
                isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-900 border-slate-800 text-slate-100'
              }`}
            >
              {/* Code header bar */}
              <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/60 text-slate-300">
                <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-400">
                  {part.language || 'code'}
                </span>
                <button
                  onClick={() => handleCopyCode(part.content, pIdx)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-700/70 hover:bg-slate-600 text-white transition-colors cursor-pointer text-[11px] font-medium"
                  title="Copy code to clipboard"
                >
                  {copiedIndex === pIdx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-300" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code body */}
              <pre className="p-4 overflow-x-auto text-slate-100 font-mono text-[13px] leading-relaxed select-text">
                <code>{part.content}</code>
              </pre>
            </div>
          );
        }

        return renderTextBlock(part.content, pIdx);
      })}
    </div>
  );
};
