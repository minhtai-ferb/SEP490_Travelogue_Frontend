"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import { useDistrictManager } from "@/services/district-manager";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { FormDataSchema } from "./lib/schema";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus } from "lucide-react";
import { toast } from "sonner";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Console } from "console";

type Inputs = z.infer<typeof FormDataSchema>;

const steps = [
  {
    id: "Bước 1",
    name: "Thông tin huyện",
    fields: ["name", "description", "area"],
  },
  {
    id: "Bước 2",
    name: "Tải hình ảnh",
    fields: ["image"],
  },
  { id: "Bước 3", name: "Hoàn thành" },
];

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const delta = currentStep - previousStep;
  const router = useRouter();
  const { createDistrict, loading } = useDistrictManager();

  // useForm hook
  const formMethods = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema),
  });

  const {
    handleSubmit,
    reset,
    trigger,
    formState: { errors },
  } = formMethods;

  const processForm: SubmitHandler<Inputs> = async (data) => {
    try {
      // Debugging: Log the form data
      console.log("Form data before creating FormData:", data);

      // Construct FormData object
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("area", data.area.toString()); // Convert number to string
      formData.append("description", data.description);
      formData.append("imageUpload", data.image); // Append the image file

      // Debugging: Log the FormData object
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      // Call the API
      const response = await createDistrict(formData);
      console.log("API response:", response);
      // Reset form and show success message
      reset();
      toast.success("Quận huyện đã được tạo thành công!");

      // Redirect to district list page after a delay
      setTimeout(() => {
        router.push("/admin/districs");
      }, 2000);
    } catch (error) {
      console.error("Error creating district:", error);
      toast.error("Có lỗi xảy ra khi tạo quận huyện.");
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

  // Tải hình ảnh
  const [preview, setPreview] = useState<string | ArrayBuffer | null>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const reader = new FileReader();
      try {
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(acceptedFiles[0]);

        // Debugging: Log the accepted file
        console.log("Accepted file:", acceptedFiles[0]);

        // Set the image in the form state
        formMethods.setValue("image", acceptedFiles[0]);
        formMethods.clearErrors("image");
      } catch (error) {
        setPreview(null);
        formMethods.resetField("image");
      }
    },
    [formMethods]
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 10000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/districs">Quản lý quận huyện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Tạo mới quận huyện</BreadcrumbPage>
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
                    Thông tin huyện
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Cung cấp chi tiết thông tin huyện.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    {/* input tên */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Tên 
                      </label>
                      <div className="mt-2">
                        <Input
                          type="text"
                          id="name"
                          {...formMethods.register("name")}
                          autoComplete="name"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.name?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* input diện tích */}
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="area"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Diện tích 
                      </label>
                      <div className="mt-2">
                        <Input
                          type="number"
                          id="area"
                          {...formMethods.register("area", {
                            valueAsNumber: true, // This will convert the string to a number
                          })}
                          autoComplete="area"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                        />
                        {errors.area?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.area.message}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* input mô tả */}
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Mô tả
                      </label>
                      <div className="mt-2">
                        <Textarea
                          id="description"
                          {...formMethods.register("description")}
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
                          rows={4}
                        />
                        {errors.description?.message && (
                          <p className="mt-2 text-sm text-red-400">
                            {errors.description.message}
                          </p>
                        )}
                      </div>
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
                    Tải hình ảnh
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Tải hình ảnh để hiển thị trên trang web.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-1">
                    <FormField
                      control={formMethods.control}
                      name="image"
                      render={() => (
                        <FormItem className="mx-auto md:w-1/2">
                          <FormControl>
                            <div
                              {...getRootProps()}
                              className="mx-auto flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-lg border border-foreground p-8 shadow-sm shadow-foreground"
                            >
                              {preview && (
                                <img
                                  src={preview as string}
                                  alt="Uploaded image"
                                  className="max-h-[400px] rounded-lg"
                                />
                              )}
                              <ImagePlus
                                className={`size-40 ${
                                  preview ? "hidden" : "block"
                                }`}
                              />
                              <Input {...getInputProps()} type="file" />
                              {isDragActive ? (
                                <p>Thả hình ảnh vào đây!</p>
                              ) : (
                                <p>
                                  Nhấp vào đây hoặc kéo một hình ảnh để tải lên
                                </p>
                              )}
                            </div>
                          </FormControl>

                          {/* Display error message if there's an issue with the image */}
                          <FormMessage>
                            {formMethods.formState.errors.image && (
                              <p className="text-red-500 text-sm">
                                {formMethods.formState.errors.image.message}
                              </p>
                            )}
                          </FormMessage>
                          {fileRejections.length > 0 && (
                            <div className="mt-2 text-sm text-red-500">
                              {fileRejections.map(({ file, errors }) => (
                                <div key={file.path}>
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
                </motion.div>
              )}

              {currentStep === 2 && (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Hoàn tất
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    Cảm ơn bạn đã gửi thông tin.
                  </p>
                </>
              )}
            </form>
          </FormProvider>

          {/* Navigation */}
          <div className="mt-4 pt-5">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={prev}
                disabled={currentStep === 0 || loading}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={next}
                disabled={currentStep === steps.length - 1 || loading}
                className="rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Đang xử lý..." : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </section>
      </div>
    </SidebarInset>
  );
}
