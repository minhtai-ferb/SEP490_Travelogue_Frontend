"use client";

import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ImageUp, Loader2, UploadCloud } from "lucide-react";
import toast from "react-hot-toast";
import { LocalCert } from "../types/tourguide";
import CertificationItem from "./certification-item";
import { useTourguideAssign } from "@/services/tourguide";

export default function CertificationUploader({
  items,
  setItems,
  onUpload,
  loading,
}: {
  items: LocalCert[];
  setItems: React.Dispatch<React.SetStateAction<LocalCert[]>>;
  onUpload: (
    files: File[],
    updateUploaded: (urls: string[]) => void,
    onError: () => void
  ) => Promise<void>;
  loading: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const hasPending = items.some((i) => i.status === "pending");
  const { deleteCertification } = useTourguideAssign();

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files ? Array.from(e.target.files) : [];
    addFiles(list);
  };

  const addFiles = (list: File[]) => {
    const accepted = list.filter((f) => {
      const okType =
        f.type.startsWith("image/") ||
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf");
      const okSize = f.size <= 8 * 1024 * 1024;
      if (!okType) toast.error(`${f.name} không phải hình/PDF`);
      if (!okSize) toast.error(`${f.name} > 8MB`);
      return okType && okSize;
    });

    const mapped: LocalCert[] = accepted.map((f) => ({
      id: `${f.name}-${f.size}-${crypto.randomUUID()}`,
      name: "",
      file: f,
      status: "pending",
      progress: 0,
      previewUrl: f.type.startsWith("image/")
        ? URL.createObjectURL(f)
        : undefined,
    }));

    setItems((prev) => [...prev, ...mapped]);
  };

  const handleUpload = async () => {
    const pendings = items.filter((i) => i.status === "pending" && i.file);
    if (pendings.length === 0) {
      toast.error("Vui lòng chọn tệp chứng chỉ trước.");
      return;
    }

    setItems((prev) =>
      prev.map((i) =>
        i.status === "pending" ? { ...i, status: "uploading", progress: 5 } : i
      )
    );

    const timer = setInterval(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.status === "uploading"
            ? { ...i, progress: Math.min(95, i.progress + 7) }
            : i
        )
      );
    }, 160);

    try {
      await onUpload(
        pendings.map((p) => p.file!) as File[],
        (urls) => {
          clearInterval(timer);
          setItems((prev) => {
            let uploadIdx = 0;
            return prev.map((i) => {
              if (i.status === "uploading") {
                const url = urls[uploadIdx++];
                return {
                  ...i,
                  status: url ? "uploaded" : "error",
                  progress: 100,
                  certificateUrl: url || i.certificateUrl,
                };
              }
              return i;
            });
          });
          toast.success(`Đã tải lên ${urls.length} tệp`);
        },
        () => {
          clearInterval(timer);
          setItems((prev) =>
            prev.map((i) =>
              i.status === "uploading"
                ? { ...i, status: "error", progress: 0 }
                : i
            )
          );
          toast.error("Tải tệp thất bại, vui lòng thử lại.");
        }
      );
    } catch (e: any) {
      clearInterval(timer);
      setItems((prev) =>
        prev.map((i) =>
          i.status === "uploading" ? { ...i, status: "error", progress: 0 } : i
        )
      );
      toast.error(e?.message || "Không thể tải lên.");
    }
  };

  const handleRemove = async (certificateUrl: string) => {
    const fileName = certificateUrl.split("/").pop() || "";
    await deleteCertification(fileName)
      .then(() => {
        setItems((prev) =>
          prev.filter((item) => item.certificateUrl !== certificateUrl)
        );
        toast.success("Đã xóa chứng chỉ");
      })
      .catch(() => {
        toast.error("Không thể xóa chứng chỉ");
      });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>Chứng chỉ nghề (ít nhất 1)</Label>
          <p className="text-xs text-muted-foreground">
            Hỗ trợ JPG/PNG/PDF, tối đa 8MB mỗi tệp.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
          >
            <ImageUp className="h-4 w-4 mr-2" /> Chọn tệp
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={loading || !hasPending}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4 mr-2" />
            )}
            Tải chứng chỉ
          </Button>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept="image/*,application/pdf"
            multiple
            onChange={onPick}
          />
        </div>
      </div>

      {items.length === 0 ? (
        <div className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
          Chưa có tệp nào được chọn. Hãy chọn và tải tệp, đặt tên cho từng chứng
          chỉ.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((it) => (
            <CertificationItem
              key={it.id}
              item={it}
              onNameChange={(id, name) =>
                setItems((prev) =>
                  prev.map((p) => (p.id === id ? { ...p, name } : p))
                )
              }
              onRemove={(id) => {
                if (it.certificateUrl) {
                  handleRemove(it.certificateUrl);
                }
                setItems((prev) => prev.filter((p) => p.id !== id));
              }}
            />
          ))}
        </div>
      )}

      <div className="rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
        Mẹo duyệt nhanh: Ảnh rõ nét, không che mờ thông tin; PDF nên xuất từ bản
        gốc. Đặt đúng tên theo văn bản gốc.
      </div>
    </div>
  );
}
