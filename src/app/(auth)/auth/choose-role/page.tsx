"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserCircle2, BadgeCheck, MapPin, Store, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { routeByRole } from "@/types/Roles";
import { getActiveRoleFromStorage, getStoredUser, setActiveRole } from "@/utils/auth-storage";

const roleMeta: Record<string, { label: string; desc: string; icon: any }> = {
  Admin: { label: "Quản trị viên", desc: "Quản lý hệ thống, nội dung, báo cáo", icon: ShieldCheck },
  Moderator: { label: "Kiểm duyệt viên", desc: "Duyệt nội dung cộng đồng, làng nghề, món ăn", icon: BadgeCheck },
  TourGuide: { label: "Hướng dẫn viên", desc: "Quản lý tour, lịch trình, nhận booking", icon: MapPin },
  CraftVillageOwner: { label: "Đại diện làng nghề", desc: "Cập nhật thông tin làng nghề, sản phẩm", icon: Store },
  User: { label: "Người dùng", desc: "Khám phá điểm đến, lên kế hoạch chuyến đi", icon: UserCircle2 },
};


export default function ChooseRolePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const bootstrap = () => {
      const user = getStoredUser();
      const r: string[] = user?.roles ?? [];

      if (!user || !r?.length) {
        router.replace("/auth");
        return;
      }

      // const active = getActiveRoleFromStorage(r);
      // if (active) {
      //   router.replace(routeByRole[active] ?? "/");
      //   return;
      // }

      if (r.length === 1) {
        const only = r[0];
        setActiveRole(only);
        router.replace(routeByRole[only] ?? "/");
        return;
      }

      if (mounted) setRoles(r);
      if (mounted) setLoading(false);
    };

    bootstrap();
    return () => { mounted = false; };
  }, [router]);

  const options = useMemo(() => roles.map((r) => ({
    key: r,
    route: routeByRole[r] ?? "/",
    meta: roleMeta[r] ?? { label: r, desc: "", icon: Users },
  })), [roles]);

  const handlePick = (role: string) => {
    setActiveRole(role);
    router.push(routeByRole[role] ?? "/");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-sm text-gray-500">Đang tải vai trò…</div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="max-w-3xl w-full">
        <h1 className="text-2xl md:text-3xl font-semibold text-center mb-2">Chọn vai trò để sử dụng</h1>
        <p className="text-center text-gray-500 mb-8">Tài khoản của bạn có nhiều vai trò. Hãy chọn một vai trò để tiếp tục. Bạn có thể đổi lại ở menu hồ sơ.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map(({ key, meta }) => {
            const Icon = meta.icon;
            return (
              <Card key={key} className="cursor-pointer transition hover:shadow-md" onClick={() => handlePick(key)}>
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gray-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-medium">{meta.label}</div>
                      <div className="text-xs text-gray-500">{key}</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 flex-1">{meta.desc}</p>
                  <Button className="mt-4 w-full" variant="default">Dùng vai trò này</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Button variant="ghost" onClick={() => router.push("/")}>Về trang chủ</Button>
        </div>
      </div>
    </div>
  );
}
