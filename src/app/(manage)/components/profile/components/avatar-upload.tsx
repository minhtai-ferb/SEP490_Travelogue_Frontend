"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addToast } from "@heroui/react";
import { useAtom } from "jotai";
import { userAtom } from "@/store/auth";
import { useUserManager } from "@/services/user-manager";
import toast from "react-hot-toast";

type UploadState = "idle" | "uploading" | "done";

export default function AvatarUpload() {
  const [user, setUser] = useAtom(userAtom);
  const { updateUserAvatar } = useUserManager();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Validate cơ bản
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      addToast({ title: "Tệp không hợp lệ", description: "Chỉ chấp nhận JPG/PNG/WEBP.", color: "danger" });
      return;
    }
    const maxBytes = 2 * 1024 * 1024; // 2MB
    if (f.size > maxBytes) {
      addToast({ title: "Tệp quá lớn", description: "Giới hạn 2MB.", color: "danger" });
      return;
    }
    setFile(f);
  };

  const upload = async () => {
    if (!file || !user?.id) return;
    try {
      setStatus("uploading");
      const res = await updateUserAvatar(file);
      console.log("Upload response:", res);
      setUser((prev: any) => ({ ...prev, avatarUrl: res?.mediaUrl }));
      toast.success("Ảnh đại diện đã được cập nhật.");
      setStatus("done");
      setFile(null);
      setPreview(null);
    } catch (e: any) {
      toast.error(e?.message || "Không thể upload ảnh.");
      setStatus("idle");
    }
  };

//   const removeAvatar = async () => {
//     if (!user?.id) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${user.id}/avatar`, {
//         method: "DELETE",
//         credentials: "include",
//       });
//       if (!res.ok) throw new Error("Không thể xóa ảnh");

//       setUser((prev: any) => ({ ...prev, avatarUrl: null }));
//       addToast({ title: "Đã xóa", description: "Ảnh đại diện đã được gỡ.", color: "success" });
//     } catch (e: any) {
//       addToast({ title: "Lỗi", description: e?.message || "Không thể xóa ảnh.", color: "danger" });
//     }
//   };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h2 className="text-lg font-medium mb-4">Ảnh đại diện</h2>

        <div className="flex items-start gap-6">
          {/* Hiển thị avatar hiện tại */}
          <div className="flex flex-col items-center gap-3">
            <div className="w-24 h-24 rounded-full overflow-hidden border">
              {/* Nếu user có avatarUrl thì dùng, không thì hiển thị fallback */}
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>
            {/* {user?.avatarUrl && (
              <Button variant="outline" onClick={removeAvatar}>
                Gỡ ảnh
              </Button>
            )} */}
          </div>

          {/* Form chọn & upload ảnh */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Chọn ảnh JPG/PNG/WEBP ≤ 2MB. Nên dùng ảnh vuông để hiển thị đẹp hơn.
              </p>
              <Input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFileChange} />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => { setFile(null); setPreview(null); }}>
                Hủy
              </Button>
              <Button disabled={!file || status === "uploading"} onClick={upload}>
                {status === "uploading" ? "Đang tải lên..." : "Tải lên"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
