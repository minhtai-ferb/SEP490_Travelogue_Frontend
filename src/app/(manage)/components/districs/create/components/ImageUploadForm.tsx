"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { ImagePlus } from "lucide-react";

interface ImageUploadFormProps {
  delta: number;
  preview: string | ArrayBuffer | null;
  onDrop: (acceptedFiles: File[]) => void;
}

export function ImageUploadForm({ delta, preview, onDrop }: ImageUploadFormProps) {
  const { control, formState } = useFormContext();

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      maxSize: 10000000,
      accept: { "image/png": [], "image/jpg": [], "image/jpeg": [] },
    });

  return (
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
          control={control}
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
                {formState.errors.image && (
                  <p className="text-red-500 text-sm">
                    {formState.errors.image.message as string}
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
  );
}
