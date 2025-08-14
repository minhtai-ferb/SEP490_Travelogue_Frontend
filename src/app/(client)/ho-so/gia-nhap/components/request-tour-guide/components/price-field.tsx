"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PriceField({
  value,
  onChange,
  error,
}: {
  value: number | string;
  onChange: (v: number) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="price">Đơn giá (VND/ngày)</Label>
      <Input
        id="price"
        inputMode="numeric"
        placeholder="Ví dụ: 800000"
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)
        }
      />
      {error ? (
        <p className="text-xs text-destructive">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Nhập số nguyên, không bao gồm dấu chấm/phẩy.
        </p>
      )}
    </div>
  );
}
