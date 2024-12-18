import { unified } from "unified";
import remarkParse from "remark-parse"; // Parses markdown
import remarkRehype from "remark-rehype"; // Converts remark tree to rehype tree
import rehypeRaw from "rehype-raw"; // Allows raw HTML
import rehypeSanitize from "rehype-sanitize"; // Sanitizes HTML
import rehypeStringify from "rehype-stringify"; // Converts rehype tree to HTML

export default async function markdownToHtml(markdown: string) {
  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML with raw support
    .use(rehypeRaw) // Enable raw HTML
    .use(rehypeSanitize, {
      tagNames: ["a", "div", "span", "p", "h1", "h2", "h3", "ul", "ol", "li", "iframe"],
      attributes: {
        a: ["href", "target", "style"],
        iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
        "*": ["style"], // Allow inline styles
      },
    })
    .use(rehypeStringify) // Convert back to HTML
    .process(markdown);

  return result.toString();
}
