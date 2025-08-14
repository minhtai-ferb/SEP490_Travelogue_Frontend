"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ShieldCheck, UserCircle2, BadgeCheck, MapPin, Store, Users, Plane, Mountain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { routeByRole } from "@/types/Roles"
import { getStoredUser } from "@/utils/auth-storage"

const roleMeta: Record<string, { label: string; icon: any; color: string; bgGradient: string }> = {
  Admin: {
    label: "Quản trị viên",
    icon: ShieldCheck,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100",
  },
  Moderator: {
    label: "Kiểm duyệt viên",
    icon: BadgeCheck,
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-blue-100",
  },
  TourGuide: {
    label: "Hướng dẫn viên",
    icon: MapPin,
    color: "text-orange-600",
    bgGradient: "from-orange-50 to-orange-100",
  },
  CraftVillageOwner: {
    label: "Đại diện làng nghề",
    icon: Store,
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-purple-100",
  },
  User: {
    label: "Người dùng",
    icon: UserCircle2,
    color: "text-teal-600",
    bgGradient: "from-teal-50 to-teal-100",
  },
}

export default function ChooseRolePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [roles, setRoles] = useState<string[]>([])

  useEffect(() => {
    let mounted = true
    const bootstrap = () => {
      const user = getStoredUser()
      const r: string[] = user?.roles ?? []

      if (!user || !r?.length) {
        router.replace("/auth/login")
        return
      }

      if (r.length === 1) {
        const only = r[0]
        router.replace(routeByRole[only] ?? "/")
        return
      }

      if (mounted) setRoles(r)
      if (mounted) setLoading(false)
    }

    bootstrap()
    return () => {
      mounted = false
    }
  }, [router])

  const options = useMemo(
    () =>
      roles.map((r) => ({
        key: r,
        route: routeByRole[r] ?? "/",
        meta: roleMeta[r] ?? {
          label: r,
          desc: "",
          icon: Users,
          color: "text-gray-600",
          bgGradient: "from-gray-50 to-gray-100",
        },
      })),
    [roles],
  )

  const handlePick = (role: string) => {
    router.push(routeByRole[role] ?? "/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <div className="text-lg text-gray-600 font-medium">Đang tải vai trò…</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Background Travel Images */}
      <div className="absolute inset-0 opacity-50">
        <img src="/Banner2.png" alt="Background" className="w-full h-full object-cover" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 opacity-50">
        <Plane className="h-16 w-16 text-blue-400 transform rotate-45" />
      </div>
      <div className="absolute bottom-20 right-10 opacity-50">
        <Mountain className="h-20 w-20 text-emerald-400" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-5xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            {/* <div className="mb-8">
              <img src="/Logo.png?height=80&width=200" alt="Logo" className="h-20 mx-auto mb-4 drop-shadow-lg" />
            </div> */}

            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 mb-6 shadow-sm">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Khám phá Tây Ninh</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-4">
              Chọn vai trò của bạn
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Tài khoản của bạn có nhiều vai trò trong hệ thống du lịch. Hãy chọn vai trò phù hợp để bắt đầu hành trình
              khám phá.
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {options.map(({ key, meta }) => {
              const Icon = meta.icon
              return (
                <Card
                  key={key}
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden"
                  onClick={() => handlePick(key)}
                >
                  <CardContent className="p-0">
                    {/* Card Header with Gradient */}
                    <div className={`bg-gradient-to-r ${meta.bgGradient} p-6 pb-4`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl bg-white shadow-sm ${meta.color}`}>
                          <Icon className="h-7 w-7" />
                        </div>
                        <div>
                          <div className="font-bold text-lg text-gray-800">{meta.label}</div>
                          <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">{key}</div>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 pt-4">
                      <Button
                        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white font-medium py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                        variant="default"
                      >
                        Chọn vai trò này
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Footer */}
          <div className="text-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg inline-block">
              <p className="text-sm text-gray-500 mb-4">Bạn có thể thay đổi vai trò bất kỳ lúc nào trong menu hồ sơ</p>
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="border-gray-300 hover:bg-gray-50 rounded-xl px-8"
              >
                Về trang chủ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
