"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useAuth } from "@/services/useAuth"
import { addToast } from "@heroui/react"
import { useAtom } from "jotai"
import { userAtom } from "@/store/auth";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Form validation schema
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 kí tự" }),
    confirmPassword: z.string().min(6, { message: "Mật khẩu phải ít nhất 6 kí tự" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  })

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function PasswordSecurity() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { changePassword } = useAuth()
  const [user] = useAtom(userAtom);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  })

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setIsSubmitting(true)

    try {
      if (!user) {
        throw new Error("User is undefined. Please log in again.")
      }
  
      if (!user.email) {
        throw new Error("User email is missing. Please log in again.")
      }
  
      console.log("User:", user)
  
      await changePassword(user.email, values.newPassword, values.confirmPassword)
  
      addToast({
        title: "Đổi mật khẩu thành công",
        description: "Mật khẩu đã được đổi thành công.",
        color: "success",
      })
  
      form.reset()
    } catch (error: any) {
      console.error("Error during password reset:", error.message || error)
  
      addToast({
        title: "Có lỗi xảy ra",
        description: error.message || "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        color: "danger",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-2">Đổi mật khẩu</h2>
        <p className="text-sm text-gray-500 mb-6">
          Để có thể bảo mật tài khoản, bạn đổi mật khẩu, qua đó cần đăng nhập lại bằng mật khẩu mới trên tất cả thiết
          bị.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between mb-1">
                    <FormLabel>Tạo mật khẩu mới</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <span className="text-xs text-blue-500 cursor-pointer">
                          Mẹo để có mật khẩu mạnh dễ nhớ
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="w-64">
                        <ul className="text-sm text-gray-700 list-disc pl-4">
                          <li>Sử dụng ít nhất 6 ký tự.</li>
                          <li>Kết hợp chữ hoa, chữ thường, số và ký tự đặc biệt.</li>
                          <li>Tránh sử dụng thông tin cá nhân dễ đoán.</li>
                          <li>Sử dụng cụm từ dễ nhớ nhưng khó đoán.</li>
                        </ul>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input type="password" placeholder="Nhập mật khẩu mới" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => form.reset()}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Đổi mật khẩu"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
