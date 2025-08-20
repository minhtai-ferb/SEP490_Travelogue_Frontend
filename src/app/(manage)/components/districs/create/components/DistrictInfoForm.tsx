"use client";

import { motion } from "framer-motion";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface DistrictInfoFormProps {
  delta: number;
}

export function DistrictInfoForm({ delta }: DistrictInfoFormProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
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
              {...register("name")}
              autoComplete="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
            {errors.name?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.name.message as string}
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
              {...register("area", {
                valueAsNumber: true, // This will convert the string to a number
              })}
              autoComplete="area"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
            />
            {errors.area?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.area.message as string}
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
              {...register("description")}
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6"
              rows={4}
            />
            {errors.description?.message && (
              <p className="mt-2 text-sm text-red-400">
                {errors.description.message as string}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
