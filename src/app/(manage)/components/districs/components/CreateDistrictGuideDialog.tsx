"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Plus, Edit, Save } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface CreateDistrictGuideDialogProps {
  children: React.ReactNode;
  href: string;
}

export const CreateDistrictGuideDialog = ({ children, href }: CreateDistrictGuideDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleStartCreate = () => {
    setOpen(false);
    // Điều hướng đến trang tạo quận huyện mới
    router.push(`${href}/create`);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const steps = [
    {
      icon: <Plus className="w-5 h-5 text-blue-500" />,
      title: "Bước 1: Nhấp vào nút 'Tạo Quận Huyện'",
      description: "Tìm và nhấp vào nút 'Tạo Quận Huyện' màu xanh để bắt đầu quá trình tạo mới."
    },
    {
      icon: <Edit className="w-5 h-5 text-green-500" />,
      title: "Bước 2: Điền thông tin cơ bản",
      description: "Nhập tên quận/huyện, mã định danh và chọn tỉnh/thành phố mà quận/huyện thuộc về."
    },
    {
      icon: <CheckCircle className="w-5 h-5 text-purple-500" />,
      title: "Bước 3: Thêm thông tin chi tiết",
      description: "Điền các thông tin bổ sung như diện tích, dân số, mô tả ngắn về đặc điểm của quận/huyện."
    },
    {
      icon: <Save className="w-5 h-5 text-orange-500" />,
      title: "Bước 4: Lưu và hoàn tất",
      description: "Kiểm tra lại thông tin và nhấp 'Lưu' để hoàn tất việc tạo quận/huyện mới."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plus className="w-6 h-6 text-blue-500" />
            Hướng dẫn tạo quận huyện mới
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Làm theo các bước dưới đây để tạo quận huyện mới một cách dễ dàng và nhanh chóng.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Lưu ý quan trọng</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Đảm bảo tên quận/huyện không trùng lặp với các quận/huyện đã có</li>
                <li>• Mã định danh phải tuân theo quy định của Tổng cục Thống kê</li>
                <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="px-6"
              onClick={handleClose}
            >
              Đã hiểu
            </Button>
          </DialogClose>
          <Button
            className="px-6 bg-blue-500 hover:bg-blue-600"
            onClick={handleStartCreate}
          >
            Bắt đầu tạo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
