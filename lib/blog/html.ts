import { generateHTML } from "@tiptap/html";
import type { JSONContent } from "@tiptap/core";
import { getBlogTipTapExtensions } from "@/lib/blog/tiptap-extensions";

const emptyDoc: JSONContent = { type: "doc", content: [] };

function asDoc(content: unknown): JSONContent {
  if (content && typeof content === "object" && (content as JSONContent).type === "doc") {
    return content as JSONContent;
  }
  return emptyDoc;
}

export function blogContentToHtml(content: unknown): string {
  return generateHTML(asDoc(content), getBlogTipTapExtensions());
}
