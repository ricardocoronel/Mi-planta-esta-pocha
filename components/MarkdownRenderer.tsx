import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Split by headers to create sections
  const sections = content.split(/(?=### )/g);

  return (
    <div className="space-y-6 text-gray-700 leading-relaxed">
      {sections.map((section, index) => {
        const trimmed = section.trim();
        if (!trimmed) return null;

        if (trimmed.startsWith('###')) {
          const lines = trimmed.split('\n');
          const title = lines[0].replace('###', '').trim();
          const body = lines.slice(1).join('\n').trim();

          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
              <h3 className="text-xl font-bold text-emerald-800 mb-4 flex items-center">
                {getIconForSection(title)}
                <span className="ml-2">{title}</span>
              </h3>
              <div className="prose prose-emerald max-w-none">
                {renderBody(body)}
              </div>
            </div>
          );
        } else {
          // Intro text or unstructured content
          return (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm">
               {renderBody(trimmed)}
            </div>
          );
        }
      })}
    </div>
  );
};

// Helper to add icons to known headers
const getIconForSection = (title: string) => {
  const lower = title.toLowerCase();
  if (lower.includes('identificación')) return '🌿';
  if (lower.includes('diagnóstico') || lower.includes('salud')) return '🩺';
  if (lower.includes('ocurriendo')) return '🔍';
  if (lower.includes('cuidados')) return '💧';
  if (lower.includes('plan')) return '📋';
  if (lower.includes('nota')) return '💚';
  return '🌱';
};

const renderBody = (text: string) => {
  return text.split('\n').map((line, i) => {
    // List items
    if (line.trim().startsWith('- ')) {
      const content = line.trim().substring(2);
      return (
        <li key={i} className="list-disc ml-5 mb-2 pl-1 marker:text-emerald-500">
          <FormatText text={content} />
        </li>
      );
    }
    // Numbered lists
    if (/^\d+\./.test(line.trim())) {
        return (
            <div key={i} className="mb-3 flex items-start">
                <span className="font-bold text-emerald-600 mr-2 min-w-[1.5rem]">{line.trim().split('.')[0]}.</span>
                <span><FormatText text={line.trim().substring(line.trim().indexOf('.') + 1)} /></span>
            </div>
        )
    }
    // Empty lines
    if (!line.trim()) return <br key={i} />;
    
    // Paragraphs
    return <p key={i} className="mb-2"><FormatText text={line} /></p>;
  });
};

const FormatText = ({ text }: { text: string }) => {
  // Simple bold parser for **text**
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
        }
        return part;
      })}
    </>
  );
};
