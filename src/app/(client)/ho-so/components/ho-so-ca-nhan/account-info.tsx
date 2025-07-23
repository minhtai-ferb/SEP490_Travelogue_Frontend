"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserManager } from "@/services/user-manager";
import { addToast } from "@heroui/react";
import { userAtom } from "@/store/auth";
import { useAtom } from "jotai";

const accountInfoSchema = z.object({
  fullName: z.string().min(1, { message: "Vui lòng nhập họ tên" }),
  email: z.string().email({ message: "Địa chỉ email không hợp lệ" }),
  phone: z
    .string()
    .optional()
    .refine((value) => !value || /^0[0-9]{9}$/.test(value), {
      message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng 10 chữ số và bắt đầu bằng số 0.",
    }),
  address: z.string().optional(),
});

type AccountInfoFormValues = z.infer<typeof accountInfoSchema>;

export default function AccountInfo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getUserById, updateUser } = useUserManager();
  const [user] = useAtom(userAtom);

  const form = useForm<AccountInfoFormValues>({
    resolver: zodResolver(accountInfoSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  useEffect(() => {
    if (user === undefined) {
      return;
    }

    if (!user?.id) {
      return;
    }

    const fetchUserData = async () => {
      try {
        const userData = await getUserById(user.id as string);
        if (userData) {
          form.reset({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phoneNumber || "",
            address: userData.address || "",
          });
        }
      } catch (error) {
        addToast({
          title: "error",
          description:
            "Không thể tải thông tin tài khoản. Vui lòng thử lại sau.",
          color: "danger",
        });
      }
    };

    fetchUserData();
  }, [getUserById, form, user]);

  const onSubmit = async (values: AccountInfoFormValues) => {
    setIsSubmitting(true);
    if (user === undefined) {
      return;
    }

    if (!user?.id) {
      return;
    }
    try {
      console.log("data", values);

      const response = await updateUser(user.id as string, {
        fullName: values.fullName,
        phoneNumber: values.phone || "",
        address: values.address || "",
      });

      if (response) {
        addToast({
          title: "Cập nhật thành công",
          description: "Thông tin tài khoản đã được cập nhật thành công.",
          color: "success",
        });

        // Reload user data after successful update
        const updatedUserData = await getUserById(user.id as string);
        if (updatedUserData) {
          form.reset({
            fullName: updatedUserData.fullName || "",
            email: updatedUserData.email || "",
            phone: updatedUserData.phoneNumber || "",
            address: updatedUserData.address || "",
          });
        }
      }
    } catch (error) {
      addToast({
        title: "Có lỗi xảy ra",
        description:
          "Đã có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại sau.",
        color: "danger",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Thông tin cá nhân</h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập họ và tên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập số điện thoại" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input placeholder="Nhập địa chỉ" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => form.reset()}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
