import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import type { Extensions } from "@tiptap/core";

/** Shared TipTap extensions for the blog editor and server-side HTML generation. */
export function getBlogTipTapExtensions(): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2] },
    }),
    Link.configure({
      openOnClick: false,
      // Avoid autolinking while typing "https:…" — that created invalid hrefs and click errors.
      autolink: false,
      defaultProtocol: "https",
      HTMLAttributes: {
        class: "text-[#083D6B] underline underline-offset-2",
      },
    }),
    Image.configure({
      HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
    }),
  ];
}
