import DOMPurify from "dompurify";

interface RichTextDisplayProps {
  html: string;
  className?: string;
}

/**
 * Renders sanitized HTML (e.g. from a WYSIWYG editor) with basic typography styles.
 * Always sanitize to prevent XSS.
 */
export function RichTextDisplay({ html, className = "" }: RichTextDisplayProps) {
  const sanitized = DOMPurify.sanitize(html ?? "", {
    ALLOWED_TAGS: [
      "p", "br", "strong", "b", "em", "i", "u", "s", "ul", "ol", "li",
      "h1", "h2", "h3", "h4", "a", "blockquote", "span", "code", "pre", "hr",
    ],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });

  return (
    <div
      className={
        "text-sm text-gray-600 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-0.5 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold [&_a]:text-blue-600 [&_a]:underline [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_s]:line-through [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_code]:text-xs [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-600 [&_hr]:border-gray-200 [&_hr]:my-2 " +
        className
      }
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
