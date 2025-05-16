"use client";

import { useRouter, useParams } from "next/navigation";
import { useCallback, useEffect, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Trash2, Upload, Loader2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Editor } from "@tinymce/tinymce-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNewsController } from "@/services/news-manager";
import { useLocationController } from "@/services/location-controller";
import { useEventController } from "@/services/event-controller";
import { SeccretKey } from "@/secret/secret";

// Define the form schema based on the News type
const FormDataSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  content: z.object({
    content: z.string().min(1, "Nội dung là bắt buộc"),
  }),
  locationId: z.string().min(1, "Vui lòng chọn địa điểm"),
  newsCategoryId: z.string().min(1, "Vui lòng chọn danh mục tin tức"),
  eventId: z.string().optional(),
  isHighlighted: z.boolean().default(false),
  medias: z.array(z.instanceof(File)).optional(),
  thumbnail: z.instanceof(File).optional(),
});

type Inputs = z.infer<typeof FormDataSchema>;

// Replace this with your actual TinyMCE API key
const TINYMCE_API_KEY = "your-api-key-here";

interface LocationOption {
  id: string;
  name: string;
}

interface NewsCategoryOption {
  id: string;
  category: string;
}

interface EventOption {
  id: string;
  name: string;
}

interface ListMedia {
  isThumbnail: boolean;
  fileType: string;
  mediaUrl: string;
}

export default function EditNewsForm() {
  const router = useRouter();
  const params = useParams();
  const newsId = params.id as string;
  const editorRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [news, setNews] = useState<any>(null);

  // State for dropdown options
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [newsCategories, setNewsCategories] = useState<NewsCategoryOption[]>(
    []
  );
  const [events, setEvents] = useState<EventOption[]>([]);
  const [uploadedEditorImages, setUploadedEditorImages] = useState<
    Array<{ file: File; url: string }>
  >([]);

  // Thumbnail state
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [existingMedias, setExistingMedias] = useState<ListMedia[]>([]);

  // Get the news controller hook
  const {
    getNewsById,
    updateNews,
    uploadNewsMedia,
    uploadThumbnail,
    getAllNewcategory,
    loading,
  } = useNewsController();
  const { getAllLocation } = useLocationController();
  const { getAllEvent } = useEventController();
  const [editorContent, setEditorContent] = useState("");

  // useForm hook
  const formMethods = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      title: "",
      description: "",
      content: { content: "" },
      locationId: "",
      newsCategoryId: "",
      eventId: "",
      isHighlighted: false,
      medias: [],
    },
  });

  const {
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = formMethods;

  // Load news data
  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) return;

      try {
        setIsLoading(true);
        const data = await getNewsById(newsId);

        if (data) {
          setNews(data);

          // Set form values
          setValue("title", data.title);
          setValue("description", data.description);
          setValue("content", data.content);
          setValue("locationId", data.locationId);
          setValue("newsCategoryId", data.newsCategoryId);
          setValue("eventId", data.eventId || "none");
          setValue("isHighlighted", data.isHighlighted);
          setEditorContent(data.content);
          // Set existing media
          if (data.medias && data.medias.length > 0) {
            setExistingMedias(data.medias);

            // Set thumbnail preview if exists
            const thumbnail = data.medias.find(
              (media: ListMedia) => media.isThumbnail
            );
            if (thumbnail) {
              setThumbnailPreview(thumbnail.mediaUrl);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        toast.error("Không thể tải dữ liệu tin tức");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [newsId, getNewsById, setValue]);

  // Handle thumbnail upload
  const handleThumbnailChange = (file: File) => {
    setThumbnailFile(file);
    setValue("thumbnail", file);

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setThumbnailPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch news categories
        const newsCategoryData = await getAllNewcategory();
        if (newsCategoryData) {
          setNewsCategories(newsCategoryData);
        }

        // Fetch locations
        const locationsData = await getAllLocation();
        if (locationsData) {
          setLocations(locationsData);
        }

        // Fetch events
        const eventsData = await getAllEvent();
        if (eventsData) {
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    fetchData();
  }, [getAllNewcategory, getAllLocation, getAllEvent]);

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Get content from editor if available
      const content = editorRef.current
        ? editorRef.current.getContent()
        : data.content;

      // Update the news
      const newsData = {
        title: data.title,
        description: data.description,
        content: content,
        locationId: data.locationId,
        newsCategoryId: data.newsCategoryId,
        eventId: data.eventId === "none" || !data.eventId ? "" : data.eventId,
        isHighlighted: data.isHighlighted,
      };

      await updateNews(newsId, newsData);

      // Upload thumbnail if exists
      if (thumbnailFile) {
        await uploadThumbnail(newsId, thumbnailFile);
      }

      // Upload media files if they exist
      if (data.medias && data.medias.length > 0) {
        // Combine all uploaded files
        const allMediaFiles = data.medias || [];

        // Add editor images to media files
        const editorImageFiles = uploadedEditorImages.map((img) => img.file);
        const combinedMediaFiles = [...allMediaFiles, ...editorImageFiles];

        if (combinedMediaFiles.length > 0) {
          await uploadNewsMedia(newsId, combinedMediaFiles);
        }
      }

      toast.success("Tin tức đã được cập nhật thành công!");

      // Redirect to news list page after a delay
      setTimeout(() => {
        router.push("/admin/news");
      }, 2000);
    } catch (error) {
      console.error("Error updating news:", error);
      toast.error("Có lỗi xảy ra khi cập nhật tin tức.");
    }
  };

  // Media upload handling
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newPreviews = acceptedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews((prev) => [...prev, ...newPreviews]);

      // Get current media files
      const currentMedias = formMethods.getValues("medias") || [];

      // Set the media files in the form state
      formMethods.setValue("medias", [...currentMedias, ...acceptedFiles]);
      formMethods.clearErrors("medias");
    },
    [formMethods]
  );

  const removeMedia = (index: number) => {
    // Remove preview
    setPreviews((prev) => prev.filter((_, i) => i !== index));

    // Remove from form state
    const currentMedias = formMethods.getValues("medias") || [];
    formMethods.setValue(
      "medias",
      currentMedias.filter((_, i) => i !== index)
    );
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    setValue("thumbnail", undefined);
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxSize: 10000000, // 10MB
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  const thumbnailDropzone = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        handleThumbnailChange(acceptedFiles[0]);
      }
    },
    maxFiles: 1,
    maxSize: 10000000, // 10MB
    accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
  });

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </SidebarInset>
    );
  }

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Tổng quát</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/news">
                Quản lý tin tức
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chỉnh sửa tin tức</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-10">
        <section className="relative flex flex-col justify-between">
          <h1 className="text-2xl font-bold mb-6">Chỉnh sửa tin tức</h1>

          <FormProvider {...formMethods}>
            <form className="space-y-8" onSubmit={handleSubmit(processForm)}>
              {/* Thông tin cơ bản */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Thông tin cơ bản
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Cung cấp thông tin chi tiết về tin tức.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Tiêu đề */}
                  <div className="sm:col-span-6">
                    <FormField
                      control={formMethods.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tiêu đề</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Nhập tiêu đề tin tức"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Mô tả */}
                  <div className="sm:col-span-6">
                    <FormField
                      control={formMethods.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập mô tả ngắn về tin tức"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Nội dung */}
                  <div className="sm:col-span-6">
                    <FormField
                      control={formMethods.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nội dung</FormLabel>
                          <FormControl>
                            <div className="border rounded-md">
                              <Editor
                                apiKey={SeccretKey.TINYMCE_API_KEY}
                                onInit={(evt, editor) => {
                                  editorRef.current = editor;
                                  field.onChange({
                                    content: editor.getContent(),
                                  });
                                }}
                                initialValue={editorContent}
                                onEditorChange={(content) => {
                                  field.onChange({ content: content });
                                }}
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
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin liên kết */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Thông tin liên kết
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Liên kết tin tức với địa điểm, danh mục tin tức và sự kiện.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  {/* Danh mục tin tức */}
                  <div className="sm:col-span-3">
                    <FormField
                      control={formMethods.control}
                      name="newsCategoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Danh mục tin tức</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn danh mục tin tức" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {newsCategories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Địa điểm */}
                  <div className="sm:col-span-3">
                    <FormField
                      control={formMethods.control}
                      name="locationId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa điểm</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn địa điểm" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Sự kiện (tùy chọn) */}
                  <div className="sm:col-span-3">
                    <FormField
                      control={formMethods.control}
                      name="eventId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sự kiện (tùy chọn)</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn sự kiện (nếu có)" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">
                                Không có sự kiện
                              </SelectItem>
                              {events.map((event) => (
                                <SelectItem key={event.id} value={event.id}>
                                  {event.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Tin nổi bật */}
                  <div className="sm:col-span-3">
                    <FormField
                      control={formMethods.control}
                      name="isHighlighted"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Tin nổi bật</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Đánh dấu tin tức này là tin nổi bật để hiển thị
                              trên trang chủ
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Hình ảnh */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Hình ảnh
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Quản lý hình ảnh của tin tức.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Thumbnail upload */}
                  <div>
                    <FormLabel>Hình ảnh Thumbnail</FormLabel>
                    <p className="text-sm text-gray-500 mb-2">
                      Hình ảnh đại diện cho tin tức (chỉ được chọn 1 hình)
                    </p>

                    {!thumbnailPreview ? (
                      <div
                        {...thumbnailDropzone.getRootProps()}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
                      >
                        <input {...thumbnailDropzone.getInputProps()} />
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        {thumbnailDropzone.isDragActive ? (
                          <p className="text-sm text-gray-600">
                            Thả hình ảnh vào đây
                          </p>
                        ) : (
                          <p className="text-sm text-gray-600">
                            Nhấp vào đây hoặc kéo hình ảnh để tải lên
                          </p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          PNG, JPG, JPEG (tối đa 10MB)
                        </p>
                      </div>
                    ) : (
                      <div className="relative">
                        <img
                          src={thumbnailPreview || "/placeholder.svg"}
                          alt="Thumbnail preview"
                          className="w-full max-w-md h-auto rounded-lg mx-auto"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={removeThumbnail}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Additional images upload */}
                  <div>
                    <FormLabel>Hình ảnh bổ sung</FormLabel>
                    <p className="text-sm text-gray-500 mb-2">
                      Tải lên các hình ảnh bổ sung cho tin tức (có thể chọn
                      nhiều hình)
                    </p>
                    <FormField
                      control={formMethods.control}
                      name="medias"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-dashed border-gray-300 p-8 hover:border-gray-400"
                            >
                              <ImagePlus className="h-12 w-12 text-gray-400" />
                              <Input
                                {...getInputProps()}
                                type="file"
                                multiple
                              />
                              {isDragActive ? (
                                <p className="text-sm text-gray-600">
                                  Thả hình ảnh vào đây!
                                </p>
                              ) : (
                                <p className="text-sm text-gray-600">
                                  Nhấp vào đây hoặc kéo hình ảnh để tải lên
                                </p>
                              )}
                              <p className="text-xs text-gray-500">
                                PNG, JPG, JPEG (tối đa 10MB)
                              </p>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {fileRejections.length > 0 && (
                            <div className="mt-2 text-sm text-red-500">
                              {fileRejections.map(({ file, errors }) => (
                                <div key={file.name}>
                                  {errors.map((e) => (
                                    <p key={e.code}>{e.message}</p>
                                  ))}
                                </div>
                              ))}
                            </div>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Existing media display */}
                  {existingMedias.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Hình ảnh hiện có
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {existingMedias
                          .filter((media) => !media.isThumbnail)
                          .map((media, index) => (
                            <Card key={index} className="overflow-hidden">
                              <CardContent className="p-0 relative">
                                <img
                                  src={media.mediaUrl || "/placeholder.svg"}
                                  alt={`Media ${index + 1}`}
                                  className="h-40 w-full object-cover"
                                />
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Preview uploaded images */}
                  {previews.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium mb-2">
                        Hình ảnh mới tải lên
                      </h3>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {previews.map((preview, index) => (
                          <Card key={index} className="overflow-hidden">
                            <CardContent className="p-0 relative">
                              <img
                                src={preview || "/placeholder.svg"}
                                alt={`Preview ${index + 1}`}
                                className="h-40 w-full object-cover"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => removeMedia(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form actions */}
              <div className="flex justify-end space-x-4 pt-5 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/admin/news")}
                  disabled={loading}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Cập nhật tin tức"
                  )}
                </Button>
              </div>
            </form>
          </FormProvider>
        </section>
      </div>
    </SidebarInset>
  );
}
