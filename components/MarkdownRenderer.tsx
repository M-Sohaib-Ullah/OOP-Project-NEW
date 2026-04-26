import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose dark:prose-invert prose-sm max-w-none break-words">
      <ReactMarkdown
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            const isInline = !match && !String(children).includes('\n');
            
            return !isInline ? (
              <div className="rounded-md bg-gray-900 dark:bg-slate-900 p-4 my-2 overflow-x-auto border border-gray-700 dark:border-slate-700 text-gray-100">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            ) : (
              <code className="bg-gray-200 dark:bg-slate-800 rounded px-1 py-0.5 text-orange-600 dark:text-orange-300 font-mono text-[0.9em]" {...props}>
                {children}
              </code>
            )
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};