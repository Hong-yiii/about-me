import { unified } from "unified";
import remarkParse from "remark-parse"; // Parses markdown
import remarkMath from "remark-math"; // Adds support for math in markdown
import remarkRehype from "remark-rehype"; // Converts remark tree to rehype tree
import rehypeRaw from "rehype-raw"; // Allows raw HTML
import rehypeKatex from "rehype-katex"; // Renders math with KaTeX
import rehypeSanitize from "rehype-sanitize"; // Sanitizes HTML
import rehypeStringify from "rehype-stringify"; // Converts rehype tree to HTML
import remarkGfm from "remark-gfm"; // Adds support for GitHub-Flavored Markdown

const rehypeWrap = require("rehype-wrap"); // Custom plugin for wrapping elements

export default async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkMath) // Enable math in markdown
    .use(remarkGfm) // Enable GitHub-Flavored Markdown (including tables)
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to HTML with raw support
    .use(rehypeRaw) // Enable raw HTML
    .use(rehypeKatex) // Render math with KaTeX
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
        // Allow formatting tags
        "strong",
        "b",
        "em",
        "i",
        // KaTeX and Mermaid elements
        "svg",
        "path",
        "g",
        "circle",
        "line",
        "polygon",
        "rect",
        "text",
        "tspan",
      ],
      attributes: {
        a: ["href", "target", "style"],
        iframe: ["src", "width", "height", "frameborder", "allow", "allowfullscreen"],
        img: ["src", "alt", "title", "width", "height", "style"],
        pre: ["className"],
        code: ["className"],
        div: ["className"], // Allow div attributes
        th: ["colspan", "rowspan", "className"],
        td: ["colspan", "rowspan", "className"],
        video: ["controls", "width", "height", "autoplay", "loop", "muted", "poster"], // Allow video attributes
        source: ["src", "type"], // Allow source attributes
        span: ["className", "style", "aria-hidden"], // KaTeX uses spans with classes
        svg: ["viewBox", "width", "height", "xmlns", "className"], // Mermaid SVGs
        path: ["d", "fill", "stroke", "stroke-width"], // Mermaid paths
        g: ["className", "transform"], // Mermaid groups
        circle: ["cx", "cy", "r", "fill", "stroke"], // Mermaid circles
        line: ["x1", "y1", "x2", "y2", "stroke"], // Mermaid lines
        polygon: ["points", "fill", "stroke"], // Mermaid polygons
        rect: ["x", "y", "width", "height", "fill", "stroke"], // Mermaid rectangles
        text: ["x", "y", "text-anchor", "dominant-baseline", "className"], // Mermaid text
        tspan: ["x", "y", "dy"], // Mermaid text spans
        "*": ["style"], // Allow inline styles for all tags
      },
    }) // Sanitize the HTML
    .use(rehypeStringify) // Convert back to HTML
    .process(markdown);

  return result.toString();
}
