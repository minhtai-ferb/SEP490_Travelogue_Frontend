"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function IntroField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="introduction">Giới thiệu</Label>
      <Textarea
        id="introduction"
        placeholder="Giới thiệu bản thân, kinh nghiệm, khu vực hoạt động..."
        className="min-h-28"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Gợi ý: nêu số năm kinh nghiệm, chứng chỉ nổi bật, địa bàn rành.{" "}
          <span className="font-medium text-amber-600">
            (Không được ít hơn 20 ký tự)
          </span>
        </p>
      )}
    </div>
  );
}
