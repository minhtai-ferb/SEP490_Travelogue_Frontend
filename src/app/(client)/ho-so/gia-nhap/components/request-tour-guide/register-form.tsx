"use client";

import React, { useCallback, useMemo, useState } from "react";
import { useTourguideAssign } from "@/services/tourguide";
import toast from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileUser, Loader2, MapPin, Trash2 } from "lucide-react";
import {
  LocalCert,
  RequestSchema,
  TourGuideRequestPayload,
} from "./types/tourguide";
import IntroField from "./components/intro-field";
import PriceField from "./components/price-field";
import CertificationUploader from "./components/certifications-uploader";

export default function RegisterTourGuideRequestForm({ fetchLatest }: { fetchLatest: () => void }) {
  const { uploadCertifications, createTourGuideRequest, loading } =
    useTourguideAssign();

  const [introduction, setIntroduction] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [certs, setCerts] = useState<LocalCert[]>([]);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const canSubmit = useMemo(() => {
    const hasAtLeastOneUploaded = certs.some(
      (c) => c.status === "uploaded" && !!c.certificateUrl && !!c.name
    );
    return (
      introduction.length >= 20 &&
      price >= 0 &&
      hasAtLeastOneUploaded &&
      !loading
    );
  }, [introduction, price, certs, loading]);

  const performUpload = useCallback(
    async (
      files: File[],
      updateUploaded: (urls: string[]) => void,
      onError: () => void
    ) => {
      try {
        const urls = await uploadCertifications(files);
        updateUploaded(urls);
      } catch {
        onError();
      }
    },
    [uploadCertifications]
  );

  const buildPayload = (): TourGuideRequestPayload | null => {
    const payload = {
      introduction,
      price,
      certifications: certs
        .filter((c) => c.status === "uploaded" && c.certificateUrl)
        .map((c) => ({
          name: c.name.trim(),
          certificateUrl: c.certificateUrl!,
        })),
    } as TourGuideRequestPayload;

    const res = RequestSchema.safeParse(payload);
    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of res.error.issues) {
        if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
      }
      setErrors(fieldErrors);
      return null;
    }
    setErrors({});
    return payload;
  };

  const onSubmit = async () => {
    const payload = buildPayload();
    if (!payload) return;

    try {
      await createTourGuideRequest(payload);
      toast.success("Gửi yêu cầu đăng ký hướng dẫn viên thành công.");
      setIntroduction("");
      setPrice(0);
      setCerts([]);
      fetchLatest()
    } catch (e: any) {
      toast.error(e?.message || "Không thể gửi yêu cầu, vui lòng thử lại.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl ">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 justify-start">
            <FileUser className="h-5 w-5 text-blue-600" />
            Thông tin yêu cầu
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <IntroField
            value={introduction}
            onChange={setIntroduction}
            error={errors.introduction as string}
          />
          <PriceField
            value={price}
            onChange={setPrice}
            error={errors.price as string}
          />
          <CertificationUploader
            items={certs}
            setItems={setCerts}
            onUpload={performUpload}
            loading={loading}
          />

          <div className="rounded-lg border p-3 bg-muted/30">
            <div className="text-sm font-medium mb-2">Tóm tắt</div>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>
                Giới thiệu:{" "}
                <span className="text-foreground">
                  {introduction
                    ? `${introduction.slice(0, 60)}${introduction.length > 60 ? "…" : ""
                    }`
                    : "(chưa có)"}
                </span>
              </li>
              <li>
                Giá/ngày:{" "}
                <span className="text-foreground">
                  {price?.toLocaleString("vi-VN")} VND
                </span>
              </li>
              <li>
                Chứng chỉ đã tải:{" "}
                {certs.filter((c) => c.status === "uploaded").length}
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="justify-end">
          <Button type="button" onClick={onSubmit} disabled={!canSubmit}>
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 mr-2" />
            )}
            Gửi yêu cầu
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
