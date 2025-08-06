"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Edit, Loader2, ArrowLeft, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useExperienceController } from "@/services/experience-controller"

interface ListMedia {
  isThumbnail: boolean
  fileType: string
  mediaUrl: string
}

export default function ExperienceDetailPage() {
  const router = useRouter()
  const params = useParams()
  const experienceId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [experience, setExperience] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { getExperienceById, deleteExperience, loading } = useExperienceController()

  // Load experience data
  useEffect(() => {
    const fetchExperience = async () => {
      if (!experienceId) return

      try {
        setIsLoading(true)
        const data = await getExperienceById(experienceId)

        if (data) {
          setExperience(data)
        }
      } catch (error) {
        console.error("Error fetching experience:", error)
        toast.error("Không thể tải dữ liệu trải nghiệm")
      } finally {
        setIsLoading(false)
      }
    }

    fetchExperience()
  }, [experienceId, getExperienceById])

  const handleDelete = async () => {
    try {
      await deleteExperience(experienceId)
      toast.success("Trải nghiệm đã được xóa thành công!")
      router.push("/admin/experience")
    } catch (error) {
      console.error("Error deleting experience:", error)
      toast.error("Có lỗi xảy ra khi xóa trải nghiệm")
    }
  }

  const getThumbnail = () => {
    if (!experience?.medias || experience.medias.length === 0) {
      return "/placeholder_image.jpg"
    }

    const thumbnail = experience.medias.find((media: ListMedia) => media.isThumbnail)
    return thumbnail ? thumbnail.mediaUrl : experience.medias[0].mediaUrl
  }

  if (isLoading) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        </div>
      </SidebarInset>
    )
  }

  if (!experience) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium">Không tìm thấy trải nghiệm</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/experience")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách
            </Button>
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Tổng quát</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/experience">Quản lý trải nghiệm</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết trải nghiệm</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/experience/edit/${experienceId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa trải nghiệm</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa trải nghiệm này? Hành động này không thể hoàn tác.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Hủy
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Xác nhận xóa"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-8 p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thumbnail and basic info */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-0">
                <img
                  src={getThumbnail() || "/placeholder_image.jpg"}
                  alt={experience.title}
                  className="w-full h-64 object-cover"
                />
              </CardContent>
            </Card>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Loại trải nghiệm</h3>
                <p className="mt-1">{experience.typeExperienceName || "Không có thông tin"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Địa điểm</h3>
                <p className="mt-1">{experience.locationName || "Không có thông tin"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Quận/Huyện</h3>
                <p className="mt-1">{experience.districtName || "Không có thông tin"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Sự kiện</h3>
                <p className="mt-1">{experience.eventName || "Không có sự kiện"}</p>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{experience.title}</h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
              <p className="text-gray-700">{experience.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Nội dung</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: experience.content }} />
            </div>

            {/* Gallery */}
            {experience.medias && experience.medias.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {experience.medias.map((media: ListMedia, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={media.mediaUrl || "/placeholder_image.jpg"}
                          alt={`${experience.title} - Hình ${index + 1}`}
                          className="w-full h-40 object-cover"
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
