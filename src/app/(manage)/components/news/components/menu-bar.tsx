import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  Redo2Icon,
  SquareMinusIcon,
  Strikethrough,
  TextQuoteIcon,
  Undo2Icon,
  Heading1,
  Heading,
  ChevronDown,
  Underline,
  AlignJustify,
  Link2Icon,
} from "lucide-react";
import { Editor } from "@tiptap/react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";

function MenuGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 pl-2 first:pl-0 first:border-none border-l border-gray-200">
      {children}
    </div>
  );
}

export default function MenuBar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  return (
    <TooltipProvider>
      <div className="border rounded-md p-2 mb-1 flex flex-row justify-center items-center gap-2 z-50 text-sm">
        {/* Nhóm: Undo / Redo */}
        <MenuGroup>
          {[
            {
              icon: <Undo2Icon className="size-4" />,
              title: "Hoàn tác",
              action: () => editor.chain().focus().undo().run(),
              disabled: !editor.can().undo(),
            },
            {
              icon: <Redo2Icon className="size-4" />,
              title: "Làm lại",
              action: () => editor.chain().focus().redo().run(),
              disabled: !editor.can().redo(),
            },
          ].map((btn, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={btn.action}
                  disabled={btn.disabled}
                  className="p-2 rounded-md hover:bg-muted transition"
                >
                  {btn.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </MenuGroup>

        {/* Nhóm: Heading Dropdown */}
        <MenuGroup>
          {/* Dropdown Heading */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="p-2 rounded-md hover:bg-muted transition flex items-center gap-1"
                  >
                    <Heading className="size-4" />
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tiêu đề</p>
              </TooltipContent>
            </Tooltip>

            <DropdownMenuContent side="bottom" align="start" className="w-40">
              {[1, 2, 3, 4].map((level) => (
                <DropdownMenuItem
                  key={level}
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .toggleHeading({ level: level as 1 | 2 | 3 | 4 })
                      .run()
                  }
                  className={
                    editor.isActive("heading", { level })
                      ? "bg-muted text-primary font-semibold"
                      : ""
                  }
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono">H{level}</span>
                    <p>Tiêu đề {level}</p>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Nút: Kẻ ngang */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className={`p-2 rounded-md hover:bg-muted transition ${
                  editor.isActive("horizontalRule")
                    ? "bg-muted text-primary"
                    : ""
                }`}
              >
                <SquareMinusIcon className="size-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Kẻ ngang</p>
            </TooltipContent>
          </Tooltip>
        </MenuGroup>

        {/* Nhóm: List + Quote */}
        <MenuGroup>
          {[
            {
              icon: <List className="size-4" />,
              title: "Danh sách không thứ tự",
              action: () => editor.chain().focus().toggleBulletList().run(),
              pressed: editor.isActive("bulletList"),
            },
            {
              icon: <ListOrdered className="size-4" />,
              title: "Danh sách có thứ tự",
              action: () => editor.chain().focus().toggleOrderedList().run(),
              pressed: editor.isActive("orderedList"),
            },
            {
              icon: <TextQuoteIcon className="size-4" />,
              title: "Trích dẫn",
              action: () => editor.chain().focus().toggleBlockquote().run(),
              pressed: editor.isActive("blockquote"),
            },
          ].map((btn, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={btn.action}
                  className={`p-2 rounded-md hover:bg-muted transition ${
                    btn.pressed ? "bg-muted text-primary" : ""
                  }`}
                >
                  {btn.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </MenuGroup>

        {/* Nhóm: Định dạng văn bản */}
        <MenuGroup>
          {[
            {
              icon: <Bold className="size-4" />,
              title: "In đậm",
              action: () => editor.chain().focus().toggleBold().run(),
              pressed: editor.isActive("bold"),
            },
            {
              icon: <Italic className="size-4" />,
              title: "In nghiêng",
              action: () => editor.chain().focus().toggleItalic().run(),
              pressed: editor.isActive("italic"),
            },
            {
              icon: <Underline className="size-4" />,
              title: "Gạch dưới",
              action: () => editor.chain().focus().toggleUnderline().run(),
              pressed: editor.isActive("underline"),
            },
            {
              icon: <Strikethrough className="size-4" />,
              title: "Gạch ngang",
              action: () => editor.chain().focus().toggleStrike().run(),
              pressed: editor.isActive("strike"),
            },
            {
              icon: <Highlighter className="size-4" />,
              title: "Tô sáng",
              action: () => editor.chain().focus().toggleHighlight().run(),
              pressed: editor.isActive("highlight"),
            },
          ].map((btn, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={btn.action}
                  className={`p-2 rounded-md hover:bg-muted transition ${
                    btn.pressed ? "bg-muted text-primary" : ""
                  }`}
                >
                  {btn.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </MenuGroup>

        {/* Nhóm: Căn lề */}
        <MenuGroup>
          {[
            {
              icon: <AlignLeft className="size-4" />,
              title: "Căn trái",
              action: () => editor.chain().focus().setTextAlign("left").run(),
              pressed: editor.isActive({ textAlign: "left" }),
            },
            {
              icon: <AlignCenter className="size-4" />,
              title: "Căn giữa",
              action: () => editor.chain().focus().setTextAlign("center").run(),
              pressed: editor.isActive({ textAlign: "center" }),
            },
            {
              icon: <AlignRight className="size-4" />,
              title: "Căn phải",
              action: () => editor.chain().focus().setTextAlign("right").run(),
              pressed: editor.isActive({ textAlign: "right" }),
            },
            {
              icon: <AlignJustify className="size-4" />,
              title: "Căn đều",
              action: () =>
                editor.chain().focus().setTextAlign("justify").run(),
              pressed: editor.isActive({ textAlign: "justify" }),
            },
          ].map((btn, idx) => (
            <Tooltip key={idx}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={btn.action}
                  className={`p-2 rounded-md hover:bg-muted transition ${
                    btn.pressed ? "bg-muted text-primary" : ""
                  }`}
                >
                  {btn.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{btn.title}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </MenuGroup>
        {/* Nhóm: Chức năng nâng cao */}
        <MenuGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Nhập URL liên kết:");
                  const text = prompt("Văn bản hiển thị:");
                  if (url) {
                    editor
                      .chain()
                      .focus()
                      .extendMarkRange("link")
                      .setLink({ href: url })
                      .insertContent(text || url)
                      .run();
                  }
                }}
                className="p-2 rounded-md hover:bg-muted"
              >
                <Link2Icon className="size‑4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm hoặc chỉnh sửa liên kết</p>
            </TooltipContent>
          </Tooltip>
          <ImageUploadButton
            editor={editor}
            text="Thêm ảnh"
            hideWhenUnavailable
            onInserted={() => console.log("Đã chèn ảnh")}
          />
        </MenuGroup>
      </div>
    </TooltipProvider>
  );
}
