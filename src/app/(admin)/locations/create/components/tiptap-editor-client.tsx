"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, ImageIcon } from "lucide-react"

interface TiptapEditorProps {
  content: string
  onChange: (html: string) => void
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content,
    editorProps: {
      attributes: {
        class: "focus:outline-none prose prose-sm",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
  })

  const handleAddImage = () => {
    const url = prompt("Nhập URL hình ảnh:")
    if (url) {
      editor?.chain().focus().setImage({ src: url }).run()
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleAddImage}>
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
