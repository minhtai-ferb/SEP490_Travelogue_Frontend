"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { FileText, Trash2 } from "lucide-react";
import { LocalCert } from "../types/tourguide";

export default function CertificationItem({
  item,
  onNameChange,
  onRemove,
}: {
  item: LocalCert;
  onNameChange: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border p-3 bg-card">
      <div className="flex gap-3">
        <div className="w-24 h-24 rounded-md overflow-hidden border bg-muted flex items-center justify-center">
          {(() => {
            const isPdf =
              item.file?.type?.includes("pdf") ||
              item.certificateUrl?.toLowerCase().endsWith(".pdf") ||
              item.previewUrl?.toLowerCase().endsWith(".pdf");

            // Ưu tiên link đã upload, nếu chưa có thì tạo link tạm từ file
            const pdfUrl =
              item.certificateUrl ||
              (item.file && item.file.type.includes("pdf")
                ? URL.createObjectURL(item.file)
                : undefined);

            if (isPdf && pdfUrl) {
              return (
                <iframe
                  src={pdfUrl}
                  title={item.name || "PDF Preview"}
                  className="w-full h-full"
                />
              );
            }

            // Nếu là ảnh
            if (item.previewUrl || item.certificateUrl) {
              return (
                <img
                  src={item.certificateUrl || item.previewUrl}
                  alt={item.name || "certificate"}
                  className="w-full h-full object-cover"
                />
              );
            }

            // Không có gì để hiển thị
            return (
              <div className="text-xs text-muted-foreground">Không có hình</div>
            );
          })()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Input
              value={item.name}
              placeholder="Tên chứng chỉ"
              onChange={(e) => onNameChange(item.id, e.target.value)}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onRemove(item.id)}
              aria-label="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-2">
            {item.status === "pending" && (
              <Badge
                variant="outline"
                className="text-amber-700 border-amber-300 bg-amber-50"
              >
                Chưa tải
              </Badge>
            )}
            {item.status === "uploading" && (
              <div className="space-y-2">
                <Progress value={Math.max(5, item.progress)} />
                <div className="text-xs text-muted-foreground">
                  Đang tải... {Math.max(5, Math.floor(item.progress))}%
                </div>
              </div>
            )}
            {item.status === "uploaded" && (
              <Badge className="bg-emerald-600">Đã tải</Badge>
            )}
            {item.status === "error" && (
              <Badge variant="destructive">Lỗi</Badge>
            )}
          </div>

          {item.certificateUrl && (
            <a
              href={item.certificateUrl}
              target="_blank"
              className="text-xs underline mt-1 inline-block text-muted-foreground"
            >
              Xem tệp đã tải
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
