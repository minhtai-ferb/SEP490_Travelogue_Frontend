"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { ImagePlus, Trash2, Upload } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useExperienceController } from "@/services/experience-controller";
import { useLocationController } from "@/services/location-controller";
import { useDistrictManager } from "@/services/district-manager";
import { useEventController } from "@/services/event-controller";
import { addToast } from "@heroui/react";
import { Editor } from "@tinymce/tinymce-react";
import { SeccretKey } from "@/secret/secret";

// Define the form schema based on the Experience type
const FormDataSchema = z.object({
  title: z.string().min(1, "Tiêu đề là bắt buộc"),
  description: z.string().min(1, "Mô tả là bắt buộc"),
  content: z.string().min(1, "Nội dung là bắt buộc"),
  locationId: z.string().min(1, "Vui lòng chọn địa điểm"),
  typeExperienceId: z.string().min(1, "Vui lòng chọn loại trải nghiệm"),
  districtId: z.string().min(1, "Vui lòng chọn quận/huyện"),
  eventId: z.string().optional(),
  medias: z.array(z.instanceof(File)).optional(),
  thumbnail: z.instanceof(File).optional(),
});

type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  {
    id: "Bước 1",
    name: "Thông tin cơ bản",
    fields: ["title", "description", "content"],
  },
  {
    id: "Bước 2",
    name: "Thông tin liên kết",
    fields: ["locationId", "typeExperienceId", "districtId", "eventId"],
  },
  {
    id: "Bước 3",
    name: "Tải hình ảnh",
    fields: ["thumbnail", "medias"],
  },
  { id: "Bước 4", name: "Hoàn thành" },
];

interface LocationOption {
  id: string;
  name: string;
}

interface TypeExperienceOption {
  id: string;
  typeName: string;
}

interface DistrictOption {
  id: string;
  name: string;
}

interface EventOption {
  id: string;
  name: string;
}

export default function CreateExperienceForm() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();
  const editorRef = useRef<any>(null);

  // State for dropdown options
  const [locations, setLocations] = useState<LocationOption[]>([]);
  const [typeExperiences, setTypeExperiences] = useState<
    TypeExperienceOption[]
  >([]);
  const [districts, setDistricts] = useState<DistrictOption[]>([]);
  const [events, setEvents] = useState<EventOption[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Get the experience controller hook
  const {
    createExperience,
    uploadExperienceMedia,
    getAllTypeExperience,
    uploadThumbnail,
    loading,
  } = useExperienceController();
  const { getAllLocation } = useLocationController();
  const { getAllDistrict } = useDistrictManager();
  const { getAllEvent } = useEventController();

  // useForm hook
  const formMethods = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      locationId: "",
      typeExperienceId: "",
      districtId: "",
      eventId: "",
      medias: [],
    },
  });

  const {
    handleSubmit,
    reset,
    trigger,
    setValue,
    formState: { errors },
  } = formMethods;

  // Load dropdown data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch type experiences
        const typeExperienceData = await getAllTypeExperience();
        const locationsData = await getAllLocation();
        const districtsData = await getAllDistrict();
        const eventsData = await getAllEvent();
        if (typeExperienceData) {
          setTypeExperiences(typeExperienceData);
        }

        // Mock data for locations, districts, and events
        // In a real application, you would fetch these from your API
        if (locationsData) {
          setLocations(locationsData);
        }

        if (districtsData) {
          setDistricts(districtsData);
        }

        if (eventsData) {
          setEvents(eventsData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    fetchData();
  }, [getAllTypeExperience]);

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

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Create the experience first
      const content = editorRef.current ? editorRef.current.getContent() : "";

      console.log("Form data:", data);
      

      const experienceData = {
        title: data.title,
        description: data.description,
        content: data.content,
        locationId: data.locationId,
        typeExperienceId: data.typeExperienceId,
        districtId: data.districtId,
        eventId: data.eventId,
      };

      const response = await createExperience(experienceData);

      // If experience creation was successful and we have media files, upload them
      if (response && data.medias && data.medias.length > 0) {
        await uploadExperienceMedia(response.id, data.medias);

        if (thumbnailFile) {
          await uploadThumbnail(response.id, thumbnailFile);
        }
      }

      // Reset form and show success message
      reset();
      addToast({
        title: "Trải nghiệm đã được tạo thành công!",
        description: "Bạn sẽ được chuyển hướng đến trang quản lý trải nghiệm.",
        color: "success",
      });
      // Redirect to experience list page after a delay
      setTimeout(() => {
        router.push("/admin/experience");
      }, 2000);
    } catch (error) {
      console.error("Error creating experience:", error);
      addToast({
        title: "Có lỗi xảy ra khi tạo trải nghiệm.",
        description: "Vui lòng kiểm tra lại thông tin và thử lại.",
        color: "danger",
      });
    }
  };

  type FieldName = keyof Inputs;

  const next = async () => {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });

    if (!output) return;

    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)(); // Only submit if validation passes
      }
      setPreviousStep(currentStep);
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0 && currentStep < steps.length - 1) {
      setPreviousStep(currentStep);
      setCurrentStep((step) => step - 1);
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
              <BreadcrumbLink href="/admin/experience">
                Quản lý trải nghiệm
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo mới trải nghiệm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-10">
        <section className="relative flex flex-col justify-between">
          <nav aria-label="Progress">
            <ol
              role="list"
              className="space-y-4 md:flex md:space-x-8 md:space-y-0"
            >
              {steps.map((step, index) => (
                <li key={step.name} className="md:flex-1">
                  {currentStep > index ? (
                    <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-sky-600">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : currentStep === index ? (
                    <div
                      className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                      aria-current="step"
                    >
                      <span className="text-sm font-medium text-sky-600">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  ) : (
                    <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                      <span className="text-sm font-medium text-gray-500">
                        {step.id}
                      </span>
                      <span className="text-sm font-medium">{step.name}</span>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <FormProvider {...formMethods}>
            <form className="mt-6 py-6" onSubmit={handleSubmit(processForm)}>
              {currentStep === 0 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Thông tin cơ bản
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Cung cấp thông tin chi tiết về trải nghiệm.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
                                placeholder="Nhập tiêu đề trải nghiệm"
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
                                placeholder="Nhập mô tả ngắn về trải nghiệm"
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
                                  onInit={(evt, editor) =>
                                    (editorRef.current = editor)
                                  }
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
                                  }}
                                  onEditorChange={(content) => {
                                    field.onChange(content);
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
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Thông tin liên kết
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Liên kết trải nghiệm với địa điểm, loại trải nghiệm,
                    quận/huyện và sự kiện.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* Loại trải nghiệm */}
                    <div className="sm:col-span-3">
                      <FormField
                        control={formMethods.control}
                        name="typeExperienceId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại trải nghiệm</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn loại trải nghiệm" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {typeExperiences.map((type) => (
                                  <SelectItem key={type.id} value={type.id}>
                                    {type.typeName}
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

                    {/* Quận/Huyện */}
                    <div className="sm:col-span-3">
                      <FormField
                        control={formMethods.control}
                        name="districtId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quận/Huyện</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn quận/huyện" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {districts.map((district) => (
                                  <SelectItem
                                    key={district.id}
                                    value={district.id}
                                  >
                                    {district.name}
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
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <h2 className="text-lg font-semibold leading-7 text-gray-900">
                    Tải hình ảnh
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Tải hình ảnh để hiển thị trên trang web.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">
                    <div>
                      <FormLabel>Hình ảnh Thumbnail</FormLabel>
                      <p className="text-sm text-gray-500 mb-2">
                        Hình ảnh đại diện cho trải nghiệm (chỉ được chọn 1 hình)
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
                        Tải lên các hình ảnh bổ sung cho trải nghiệm (có thể
                        chọn nhiều hình)
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
                    {/* Preview uploaded images */}
                    {previews.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">
                          Hình ảnh đã tải lên
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
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  initial={{ x: delta >= 0 ? "50%" : "-50%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900 mb-4">
                      Hoàn tất
                    </h2>
                    <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-lg leading-6 text-gray-600 mb-2">
                      Trải nghiệm đã được tạo thành công!
                    </p>
                    <p className="text-sm text-gray-500">
                      Bạn sẽ được chuyển hướng đến trang quản lý trải nghiệm
                      trong giây lát.
                    </p>
                  </div>
                </motion.div>
              )}
            </form>
          </FormProvider>

          {/* Navigation */}
          <div className="mt-8 pt-5 border-t border-gray-200">
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prev}
                disabled={currentStep === 0 || loading}
                className="flex items-center gap-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
                Quay lại
              </Button>
              <Button
                type="button"
                onClick={next}
                disabled={currentStep === steps.length - 1 || loading}
                className="flex items-center gap-1"
              >
                {loading ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    {currentStep === steps.length - 2
                      ? "Hoàn thành"
                      : "Tiếp theo"}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </SidebarInset>
  );
}
