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
import { Edit, Loader2, ArrowLeft, Trash2, Star } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import { useNewsController } from "@/services/news-manager"

interface ListMedia {
  isThumbnail: boolean
  fileType: string
  mediaUrl: string
}

export default function NewsDetailPage() {
  const router = useRouter()
  const params = useParams()
  const newsId = params.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [news, setNews] = useState<any>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const { getNewsById, deleteNews, loading } = useNewsController()

  // Load news data
  useEffect(() => {
    const fetchNews = async () => {
      if (!newsId) return

      try {
        setIsLoading(true)
        const data = await getNewsById(newsId)

        if (data) {
          setNews(data)
        }
      } catch (error) {
        console.error("Error fetching news:", error)
        toast.error("Không thể tải dữ liệu tin tức")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNews()
  }, [newsId, getNewsById])

  const handleDelete = async () => {
    try {
      await deleteNews(newsId)
      toast.success("Tin tức đã được xóa thành công!")
      router.push("/admin/news")
    } catch (error) {
      console.error("Error deleting news:", error)
      toast.error("Có lỗi xảy ra khi xóa tin tức")
    }
  }

  const getThumbnail = () => {
    if (!news?.medias || news.medias.length === 0) {
      return "/placeholder_image.jpgge.jpg"
    }

    const thumbnail = news.medias.find((media: ListMedia) => media.isThumbnail)
    return thumbnail ? thumbnail.mediaUrl : news.medias[0].mediaUrl
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

  if (!news) {
    return (
      <SidebarInset>
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <p className="text-lg font-medium">Không tìm thấy tin tức</p>
            <Button variant="outline" className="mt-4" onClick={() => router.push("/admin/news")}>
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
              <BreadcrumbLink href="/admin/news">Quản lý tin tức</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết tin tức</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => router.push(`/admin/news/edit/${newsId}`)}>
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
                <DialogTitle>Xác nhận xóa tin tức</DialogTitle>
                <DialogDescription>
                  Bạn có chắc chắn muốn xóa tin tức này? Hành động này không thể hoàn tác.
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
                <img src={getThumbnail() || "/placeholder_image.jpg"} alt={news.title} className="w-full h-64 object-cover" />
              </CardContent>
            </Card>

            <div className="mt-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Danh mục tin tức</h3>
                <p className="mt-1">{news.categoryName || "Không có thông tin"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Địa điểm</h3>
                <p className="mt-1">{news.locationName || "Không có thông tin"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Sự kiện</h3>
                <p className="mt-1">{news.eventName || "Không có sự kiện"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                <div className="mt-1">
                  {news.isHighlighted ? (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600">
                      <Star className="h-3 w-3 mr-1 fill-current" /> Tin nổi bật
                    </Badge>
                  ) : (
                    <Badge variant="outline">Tin thường</Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-4">{news.title}</h1>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Mô tả</h2>
              <p className="text-gray-700">{news.description}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Nội dung</h2>
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: news.content }} />
            </div>

            {/* Gallery */}
            {news.medias && news.medias.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Hình ảnh</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {news.medias.map((media: ListMedia, index: number) => (
                    <Card key={index} className="overflow-hidden">
                      <CardContent className="p-0">
                        <img
                          src={media.mediaUrl || "/placeholder_image.jpg"}
                          alt={`${news.title} - Hình ${index + 1}`}
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
