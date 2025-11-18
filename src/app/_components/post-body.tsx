'use client';

import { useEffect } from 'react';
import markdownStyles from "./markdown-styles.module.css";

type Props = {
  content: string;
};

export function PostBody({ content }: Props) {
  useEffect(() => {
    // Simple Mermaid initialization
    const initMermaid = async () => {
      const mermaid = (await import('mermaid')).default;
      
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });

      // Find all code blocks with language "mermaid"
      const mermaidBlocks = document.querySelectorAll('pre code.language-mermaid');
      
      // Process each mermaid block
      for (let index = 0; index < mermaidBlocks.length; index++) {
        const block = mermaidBlocks[index];
        const code = block.textContent || '';
        const id = `mermaid-${index}`;
        
        try {
          const { svg } = await mermaid.render(id, code);
          const wrapper = document.createElement('div');
          wrapper.className = 'mermaid-diagram';
          wrapper.innerHTML = svg;
          
          // Replace the code block with the rendered diagram
          const preElement = block.parentElement;
          if (preElement && preElement.tagName === 'PRE') {
            preElement.parentNode?.replaceChild(wrapper, preElement);
          }
        } catch (error) {
          console.error('Mermaid rendering error:', error);
          // Keep the original code block if rendering fails
        }
      }
    };

    initMermaid();
  }, [content]);

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={markdownStyles["markdown"]}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}
