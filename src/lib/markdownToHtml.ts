import { unified } from "unified";
import remarkParse from "remark-parse"; // Parses markdown
import remarkRehype from "remark-rehype"; // Converts remark tree to rehype tree
import rehypeRaw from "rehype-raw"; // Allows raw HTML
import rehypeSanitize from "rehype-sanitize"; // Sanitizes HTML
import rehypeStringify from "rehype-stringify"; // Converts rehype tree to HTML
import remarkGfm from "remark-gfm"; // Adds support for GitHub-Flavored Markdown

const rehypeWrap = require("rehype-wrap"); // Custom plugin for wrapping elements

export default async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkGfm) // Enable GitHub-Flavored Markdown (including tables)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML with raw support
    .use(rehypeRaw) // Enable raw HTML
    .use(
      rehypeWrap,
      { selector: "iframe", wrapper: "div.iframe-container" } // Wrap <iframe> in a container
    )
    .use(rehypeSanitize, {
      tagNames: [
        "a",
        "div",
        "span",
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "ul",
        "ol",
        "li",
        "img",
        "iframe",
        "code",
        "pre",
        "hr",
        "table",
        "thead",
        "tbody",
        "tr",
        "th",
        "td",
        "blockquote",
        "video", // Add video tag
        "source", // Add source tag
      ],
      attributes: {
        a: ["href", "target", "style"],
        iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
        img: ["src", "alt", "title", "width", "height", "style"],
        pre: ["className"],
        code: ["className"],
        div: ["className"],
        th: ["colspan", "rowspan", "className"],
        td: ["colspan", "rowspan", "className"],
        video: ["controls", "width", "height", "autoplay", "loop", "muted", "poster"], // Allow video attributes
        source: ["src", "type"], // Allow source attributes
        "*": ["style"], // Allow inline styles for all tags
      },    
    }) // Sanitize the HTML
    .use(rehypeStringify) // Convert back to HTML
    .process(markdown);

  return result.toString();
}
