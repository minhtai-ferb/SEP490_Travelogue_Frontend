"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import {
  Table,
  TableRow,
  TableCell,
  TableHeader,
} from "@tiptap/extension-table";

interface ContentEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function ContentEditor({ content, onChange }: ContentEditorProps) {
  const [isPreview, setIsPreview] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      Highlight,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
      StarterKit,
    ],
    content: content,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Nội dung chi tiết</Label>
        <div className="flex space-x-2">
          <Button
            variant={isPreview ? "outline" : "default"}
            size="sm"
            onClick={() => setIsPreview(false)}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant={isPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPreview(true)}
          >
            Xem trước
          </Button>
        </div>
      </div>

      {!isPreview && (
        <div className="space-y-2">
          {/* Editor */}
          <EditorContent editor={editor} />
        </div>
      )}

      {isPreview && (
        <Card>
          <CardContent className="p-4">
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br>"),
              }}
            />
            {!content && (
              <p className="text-gray-500 italic">
                Chưa có nội dung để xem trước
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-gray-500">
        <p>
          Hỗ trợ Markdown và HTML. Bạn có thể thêm hình ảnh, video và định dạng
          văn bản.
        </p>
      </div>
    </div>
  );
}
