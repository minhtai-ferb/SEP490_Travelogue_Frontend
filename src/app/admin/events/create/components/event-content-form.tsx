"use client";

import { useState, useRef, useEffect } from "react";
import { Form, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useEventController } from "@/services/event-controller";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { SeccretKey } from "@/secret/secret";
import { addToast } from "@heroui/react";
import { Event } from "@/types/Event";

interface EventContentFormProps {
  eventId: string;
  onContentUpdated: () => void;
}

export default function EventContentForm({
  eventId,
  onContentUpdated,
}: EventContentFormProps) {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [editorContent, setEditorContent] = useState("");
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ file: File; url: string }>
  >([]);
  const [data, setData] = useState<Event>({} as Event);
  const { getEventById, updateEvent, uploadEventMedia, uploadThumbnail } =
    useEventController();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    console.log("EventContentForm mounted with eventId:", eventId);
  }, [eventId]);

  // Fetch event data if needed
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventData = await getEventById(eventId);
        setData(eventData);
        if (eventData && eventData.content) {
          setEditorContent(eventData.content);
          if (editorRef.current) {
            editorRef.current.setContent(eventData.content);
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };

    if (eventId) {
      fetchEventData();
    }
  }, [eventId, getEventById]);

  // Handle image upload for the editor
  const handleEditorImageUpload = (
    callback: Function,
    value: any,
    meta: any
  ) => {
    // Create a file input element
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");

    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];

        try {
          // Create a blob URL for temporary preview
          const blobUrl = URL.createObjectURL(file);

          // Add to uploaded images array for tracking
          setUploadedImages((prev) => [...prev, { file, url: blobUrl }]);

          // Call the callback with the temporary URL
          callback(blobUrl, { title: file.name });
        } catch (error) {
          console.error("Error handling image:", error);
          message.error("Không thể tải lên hình ảnh. Vui lòng thử lại.");
        }
      }
    };

    input.click();
  };

  // Handle form submission
  const onFinish = async () => {
    if (!eventId) {
      message.error("Không tìm thấy ID sự kiện.");
      return;
    }

    setSubmitting(true);

    try {
      // Get content from editor
      const content = editorRef.current ? editorRef.current.setEditorContent() : "";
      const formattedValues = {
        name: data?.name || "Default Name", // Replace with actual name if available
        typeEventId: data?.typeEventId || "default-type-id", // Replace with actual typeEventId if available
        isRecurring: data?.isRecurring || false, // Replace with actual value if available
        isHighlighted: data?.isHighlighted || false, // Replace with actual value if available
        content: content,
      };
      // Update event with content
      await updateEvent(eventId, formattedValues);

      // Upload media files
      if (uploadedFiles.length > 0 || uploadedImages.length > 0) {
        // Combine all uploaded files
        const allFiles = [
          ...uploadedFiles,
          ...uploadedImages.map((img) => img.file),
        ];

        // Filter out any duplicates
        const uniqueFileMap = new Map();
        allFiles.forEach((file) => {
          uniqueFileMap.set(file.name, file);
        });

        const uniqueFiles = Array.from(uniqueFileMap.values());

        await uploadEventMedia(eventId, uniqueFiles);
      }

      // Upload thumbnail if exists
      if (thumbnailFile) {
        await uploadThumbnail(eventId, thumbnailFile);
      }

      addToast({
        title: "Cập nhật nội dung thành công!",
        description: "Nội dung và hình ảnh đã được cập nhật.",
        color: "success",
      });

      // Notify parent component
      onContentUpdated();
    } catch (error) {
      console.error("Error updating event content:", error);
      message.error("Không thể cập nhật nội dung. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file uploads
  const handleFileChange = (info: any) => {
    const files = info.fileList
      .filter((file: any) => file.originFileObj)
      .map((file: any) => file.originFileObj);
    setUploadedFiles(files);
  };

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleThumbnailChange = (info: any) => {
    const file = info.fileList[0]?.originFileObj;
    setThumbnailFile(file);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} className="w-full">
      <div className="space-y-6">
        <div className="mb-4">
          <Label className="mb-2 block">Nội dung chi tiết</Label>
          <Editor
            apiKey={SeccretKey.TINYMCE_API_KEY}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue=""
            init={{
              height: 500,
              menubar: true,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "code",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | blocks | " +
                "bold italic forecolor | alignleft aligncenter " +
                "alignright alignjustify | bullist numlist outdent indent | " +
                "removeformat | help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              file_picker_types: "image",
              file_picker_callback: handleEditorImageUpload,
              images_upload_handler: handleEditorImageUpload,
            }}
            onEditorChange={(content) => setEditorContent(content)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form.Item
              label="Hình ảnh Thumbnail"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                accept="image/*"
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handleThumbnailChange}
                showUploadList={{
                  showRemoveIcon: true,
                  showPreviewIcon: false,
                }}
                maxCount={1}
              >
                <button
                  style={{
                    color: "inherit",
                    cursor: "inherit",
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên Thumbnail</div>
                </button>
              </Upload>
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label="Tải lên hình ảnh bổ sung"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                multiple
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handleFileChange}
              >
                <button
                  style={{
                    color: "inherit",
                    cursor: "inherit",
                    border: 0,
                    background: "none",
                  }}
                  type="button"
                >
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        {uploadedImages.length > 0 && (
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">
                Hình ảnh đã tải lên cho nội dung
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {uploadedImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={`Uploaded ${index}`}
                      className="w-full h-24 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          // Copy image URL to clipboard for easy insertion
                          navigator.clipboard.writeText(img.url);
                          message.success(
                            "Đã sao chép URL hình ảnh vào clipboard"
                          );
                        }}
                        className="bg-white text-black rounded-full p-1 text-xs"
                      >
                        Sao chép URL
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Nhấp vào "Sao chép URL" và dán vào trình soạn thảo để chèn hình
                ảnh vào vị trí mong muốn.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex gap-4 justify-end mt-6">
        <Button
          variant="default"
          type="submit"
          className="bg-blue-500 text-white"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật nội dung"
          )}
        </Button>
      </div>
    </Form>
  );
}
