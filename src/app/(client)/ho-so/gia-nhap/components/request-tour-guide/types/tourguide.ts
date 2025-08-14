"use client";
import { z } from "zod";

export const RequestSchema = z.object({
  introduction: z
    .string({ required_error: "Vui lòng giới thiệu ngắn gọn." })
    .min(20, "Giới thiệu tối thiểu 20 ký tự."),
  price: z
    .preprocess((v) => Number(v), z.number().nonnegative("Giá phải >= 0"))
    .refine((v) => Number.isFinite(v), "Giá không hợp lệ"),
  certifications: z
    .array(
      z.object({
        name: z.string().min(2, "Tên chứng chỉ tối thiểu 2 ký tự"),
        certificateUrl: z.string().url("URL chứng chỉ chưa hợp lệ"),
      })
    )
    .min(1, "Cần ít nhất 1 chứng chỉ"),
});

export type TourGuideRequestPayload = z.infer<typeof RequestSchema>;

export type LocalCert = {
  id: string;
  name: string;
  file?: File;
  certificateUrl?: string;
  status: "pending" | "uploading" | "uploaded" | "error";
  progress: number;
  previewUrl?: string;
};