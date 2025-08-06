"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import MenuBar from "./menu-bar";
import { Image } from "@tiptap/extension-image";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node";
import { useLocations } from "@/services/use-locations";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function ContentEditor({
  content,
  onChange,
}: ContentEditorProps) {
  const { uploadMediaMultiple, deleteMediaByFileName } = useLocations();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Placeholder.configure({
        placeholder: "Viết nội dung ở đây…",
        showOnlyWhenEditable: true,
      }),
      Image.configure({ HTMLAttributes: { class: "max-w-full h-auto mx-auto" } }),
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: 5 * 1024 * 1024, // ví dụ 5MB
        upload: async (file) => {
          const urls = await uploadMediaMultiple([file]);
          if (!urls?.length) throw new Error("Không nhận URL");
          return urls[0];
        },
        onError: (err) => console.error("Upload thất bại:", err),
        onSuccess: (url) => console.log("Upload thành công:", url),
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    onDelete({ type, node }: any) {
      if (type === "node" && node.type.name === "image") {
        const src = node.attrs.src as string;
        const fileName = src.split("/").pop();
        if (fileName) {
          deleteMediaByFileName(fileName)
            .then(() => console.log("Xóa file media:", fileName))
            .catch((e) => console.error("Lỗi xóa file:", e));
        }
      }
    },
    editorProps: {
      attributes: {
        class:
          "min-h-[200px] max-h-[400px] overflow-y-auto border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500",
      },
    },
    injectCSS: false,
    autofocus: false,
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!editor) return null;

  return (
    <div className="">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
