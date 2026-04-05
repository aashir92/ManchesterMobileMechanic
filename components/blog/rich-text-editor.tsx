"use client";

import { uploadBlogImage } from "@/app/admin/actions";
import { normalizeBlogHref } from "@/lib/blog/normalize-blog-href";
import { getBlogTipTapExtensions } from "@/lib/blog/tiptap-extensions";
import type { Editor, JSONContent } from "@tiptap/core";
import { EditorContent, useEditor } from "@tiptap/react";
import { Bold, ImageIcon, Italic, Link2, Unlink } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const emptyDoc: JSONContent = { type: "doc", content: [] };

function normalizeDoc(value: JSONContent | Record<string, unknown> | undefined): JSONContent {
  if (value && typeof value === "object" && (value as JSONContent).type === "doc") {
    return value as JSONContent;
  }
  return emptyDoc;
}

async function uploadImageFile(file: File): Promise<string | null> {
  const fd = new FormData();
  fd.set("file", file);
  const res = await uploadBlogImage(fd);
  if ("error" in res && res.error) {
    console.error(res.error);
    return null;
  }
  if ("url" in res && res.url) return res.url;
  return null;
}

type LinkRange = { from: number; to: number };

export function RichTextEditor({
  content,
  onChange,
}: {
  content: JSONContent | Record<string, unknown>;
  onChange: (json: JSONContent) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const linkRangeRef = useRef<LinkRange | null>(null);
  const extensions = getBlogTipTapExtensions();

  const [linkPanelOpen, setLinkPanelOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const closeLinkPanel = useCallback(() => {
    setLinkPanelOpen(false);
    setLinkUrl("");
    setLinkError(null);
    linkRangeRef.current = null;
  }, []);

  const openLinkPanel = useCallback((editor: Editor) => {
    setLinkError(null);
    const inLink = editor.isActive("link");
    if (inLink) {
      editor.commands.extendMarkRange("link");
    }
    const { from, to, empty } = editor.state.selection;
    if (!inLink && (empty || from === to)) {
      window.alert(
        'Highlight the words you want as the link (for example “book us”), then click the link button.',
      );
      return;
    }
    linkRangeRef.current = { from, to };
    const currentHref = (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkUrl(currentHref.trim());
    setLinkPanelOpen(true);
  }, []);

  const applyLinkFromPanel = useCallback(
    (editor: Editor) => {
      const range = linkRangeRef.current;
      if (!range) {
        closeLinkPanel();
        return;
      }
      const trimmed = linkUrl.trim();
      if (trimmed === "") {
        editor.chain().focus().setTextSelection(range).unsetLink().run();
        closeLinkPanel();
        return;
      }
      const href = normalizeBlogHref(trimmed);
      if (!href) {
        setLinkError("Use /contact or a full link like https://example.com");
        return;
      }
      editor.chain().focus().setTextSelection(range).setLink({ href }).run();
      closeLinkPanel();
    },
    [linkUrl, closeLinkPanel],
  );

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions,
      content: normalizeDoc(content as JSONContent),
      onCreate: ({ editor: ed }) => {
        editorRef.current = ed;
      },
      onDestroy: () => {
        editorRef.current = null;
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-lg max-w-none min-h-[280px] focus:outline-none prose-headings:text-[#083D6B] px-3 py-2",
        },
        handlePaste(_view, event: ClipboardEvent) {
          const items = event.clipboardData?.items;
          if (!items) return false;
          for (const item of items) {
            if (item.kind === "file" && item.type.startsWith("image/")) {
              const file = item.getAsFile();
              if (!file) continue;
              event.preventDefault();
              void (async () => {
                const url = await uploadImageFile(file);
                if (!url) return;
                editorRef.current?.chain().focus().setImage({ src: url }).run();
              })();
              return true;
            }
          }
          return false;
        },
        handleDrop(_view, event: DragEvent) {
          const file = event.dataTransfer?.files?.[0];
          if (!file || !file.type.startsWith("image/")) return false;
          event.preventDefault();
          void (async () => {
            const url = await uploadImageFile(file);
            if (!url) return;
            editorRef.current?.chain().focus().setImage({ src: url }).run();
          })();
          return true;
        },
      },
      onUpdate: ({ editor: ed }) => {
        onChange(ed.getJSON());
      },
    },
    [],
  );

  useEffect(() => {
    if (!editor) return;
    const next = normalizeDoc(content as JSONContent);
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(next)) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [content, editor]);

  const runFilePick = () => fileInputRef.current?.click();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;
    const url = await uploadImageFile(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const runUnsetLink = useCallback(
    (ed: Editor) => {
      if (!ed.isActive("link")) return;
      ed.chain().focus().extendMarkRange("link").unsetLink().run();
      closeLinkPanel();
    },
    [closeLinkPanel],
  );

  if (!editor) {
    return (
      <div className="min-h-[320px] rounded-lg border border-black/10 bg-white/50 text-sm text-[#42474f]">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-black/15 bg-white shadow-sm">
      <div className="sticky top-16 z-10 flex flex-wrap items-center gap-1 border-b border-black/10 bg-white/90 px-2 py-2 backdrop-blur-md">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
        <ToolbarButton
          label="Add or edit link on selected text"
          active={editor.isActive("link")}
          onClick={() => openLinkPanel(editor)}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Remove link"
          onClick={() => runUnsetLink(editor)}
          disabled={!editor.isActive("link")}
        >
          <Unlink className="h-4 w-4" />
        </ToolbarButton>
        <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />
        <ToolbarButton label="Insert image" onClick={runFilePick}>
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={onFileChange}
        />
      </div>

      {linkPanelOpen ? (
        <div className="flex flex-col gap-2 border-b border-black/10 bg-[#f4f5f7] px-3 py-3 sm:flex-row sm:items-center">
          <label className="min-w-0 flex-1 text-xs font-medium text-[#42474f]">
            Link address
            <input
              type="text"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                setLinkError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyLinkFromPanel(editor);
                }
                if (e.key === "Escape") closeLinkPanel();
              }}
              className="mt-1 w-full rounded-lg border border-black/15 px-3 py-2 text-sm"
              placeholder="/contact or https://example.com"
              autoFocus
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyLinkFromPanel(editor)}
              className="rounded-lg bg-[#083D6B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#062f55]"
            >
              Apply link
            </button>
            <button
              type="button"
              onClick={closeLinkPanel}
              className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-medium text-[#42474f] hover:bg-black/5"
            >
              Cancel
            </button>
          </div>
          {linkError ? <p className="w-full text-xs text-red-700">{linkError}</p> : null}
        </div>
      ) : null}

      <p className="border-b border-black/10 bg-[#f4f5f7]/80 px-3 py-2 text-xs text-[#42474f]">
        To make words clickable (e.g. &quot;book us&quot;): highlight them, click the link icon, type{" "}
        <code className="rounded bg-black/5 px-1">/contact</code> or{" "}
        <code className="rounded bg-black/5 px-1">https://example.com</code>, then Apply. On the live blog,
        readers click that text to go to the link.
      </p>
      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onClick={onClick}
      className={`rounded-md p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        active
          ? "bg-[#083D6B]/15 text-[#083D6B]"
          : "text-[#42474f] hover:bg-black/5 hover:text-[#083D6B]"
      }`}
    >
      {children}
    </button>
  );
}
