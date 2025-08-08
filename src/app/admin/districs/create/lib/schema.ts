import { z } from "zod";

export const FormDataSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  area: z.coerce.number().min(1, "Diện tích là bắt buộc"), // Use coerce.number() to convert string to number
  description: z.string().min(1, "Mô tả là bắt buộc"),
  image: z
    .instanceof(File, { message: "Đầu vào không phải là một tệp" })
    .refine((file) => file.size > 0, "Vui lòng tải lên một hình ảnh")
    .refine(
      (file) => file.type.startsWith("image/"),
      "Chỉ chấp nhận file hình ảnh"
    ),
});
