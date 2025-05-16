"use client"

import { useEffect, useState } from "react"
import { Spin, Image as AntImage, Tag, Carousel } from "antd"
import { useEventController } from "@/services/event-controller"
import type { Event } from "@/types/Event"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Calendar, Clock, Edit, MapPin, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import dayjs from "dayjs"
import "dayjs/locale/vi"

// Định nghĩa các mẫu lặp lại cho sự kiện
const recurrencePatternLabels: Record<string, string> = {
  DAILY: "Hàng ngày",
  WEEKLY: "Hàng tuần",
  MONTHLY: "Hàng tháng",
  YEARLY: "Hàng năm",
}

function ViewEvent() {
  const params = useParams()
  const router = useRouter()
  const eventId = params.id as string

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)

  const { getEventById } = useEventController()

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) return

      setLoading(true)
      try {
        const eventData = await getEventById(eventId)
        setEvent(eventData)
      } catch (error) {
        console.error("Error fetching event data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventData()
  }, [eventId, getEventById])

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""

    // Kiểm tra nếu dateString là định dạng ngày hợp lệ
    if (dayjs(dateString).isValid()) {
      return dayjs(dateString).format("DD/MM/YYYY")
    }

    // Nếu không phải định dạng ngày hợp lệ, trả về nguyên chuỗi
    return dateString
  }

  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return ""
    return dayjs(`2000-01-01 ${timeString}`).format("HH:mm")
  }

  // Find thumbnail image
  const thumbnailImage =
    event?.medias?.find((media) => media.isThumbnail)?.mediaUrl || event?.medias?.[0]?.mediaUrl || "/placeholder.svg"

  // Get non-thumbnail images for gallery
  const galleryImages = event?.medias?.filter((media) => !media.isThumbnail) || []

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin sự kiện...</span>
        </div>
      </SidebarInset>
    )
  }

  if (!event) {
    return (
      <SidebarInset>
        <header className="flex sticky top-0 bg-background h-16 shrink-0 items-center gap-2 border-b px-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Chi tiết sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-4">
          <div className="text-xl font-semibold mb-4">Không tìm thấy sự kiện</div>
          <Button variant="outline" onClick={() => router.push("/admin/events/list")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
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
              <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/events/lists">Danh sách sự kiện</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Chi tiết sự kiện</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto">
          <Button variant="outline" onClick={() => router.push(`/admin/events/edit/${eventId}`)}>
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      </header>
      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Main content */}
            <div className="flex-1">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-3xl font-bold mb-2">{event.name}</h1>
                  {event.isHighlighted && (
                    <Tag color="gold" className="ml-2">
                      Sự kiện nổi bật
                    </Tag>
                  )}
                </div>
                <div className="flex items-center text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{event.districtName || "Chưa có thông tin quận/huyện"}</span>
                </div>
                {event.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                    <span>{event.rating}/5</span>
                  </div>
                )}
              </div>

              {/* Main image */}
              <div className="flex justify-center mb-6 rounded-lg overflow-hidden border">
                <AntImage
                  src={thumbnailImage}
                  alt={event.name}
                  width={900}
                  height={400}
                  className="object-contain w-full h-64 rounded-lg"
                />
              </div>

              {/* Event schedule */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Lịch trình sự kiện
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Thời gian bắt đầu:</div>
                    <div className="font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(event.startTime)} - {formatDate(event.startDate)}
                    </div>
                    {event.lunarStartDate && (
                      <div className="text-sm mt-1">
                        <span className="text-muted-foreground">Âm lịch:</span> {event.lunarStartDate}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Thời gian kết thúc:</div>
                    <div className="font-medium flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      {formatTime(event.endTime)} - {formatDate(event.endDate)}
                    </div>
                    {event.lunarEndDate && (
                      <div className="text-sm mt-1">
                        <span className="text-muted-foreground">Âm lịch:</span> {event.lunarEndDate}
                      </div>
                    )}
                  </div>
                </div>
                {event.isRecurring && event.recurrencePattern && (
                  <div className="mt-3 pt-3 border-t">
                    <div className="text-sm text-muted-foreground">Lặp lại:</div>
                    <div className="font-medium">
                      {recurrencePatternLabels[event.recurrencePattern] || event.recurrencePattern}
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Mô tả</h2>
                <div className="prose max-w-none">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* Content */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Nội dung chi tiết</h2>
                <div
                  className="prose max-w-none overflow-x-auto break-words"
                  style={{
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                  }}
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>

              <style jsx global>{`
                .prose img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.375rem;
                }

                .prose table {
                  width: 100%;
                  overflow-x: auto;
                  display: block;
                }

                .prose pre {
                  overflow-x: auto;
                  white-space: pre-wrap;
                  white-space: -moz-pre-wrap;
                  white-space: -pre-wrap;
                  white-space: -o-pre-wrap;
                  word-wrap: break-word;
                }

                .prose iframe {
                  max-width: 100%;
                }

                @media (max-width: 640px) {
                  .prose {
                    font-size: 0.9rem;
                  }
                }
              `}</style>

              {/* Image gallery */}
              {galleryImages.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3">Hình ảnh</h2>
                  <Carousel autoplay className="w-full max-w-4xl mx-auto rounded-lg overflow-hidden border">
                    {galleryImages.map((media, index) => (
                      <div
                        key={index}
                        className="h-64 flex justify-center content-center mb-6 rounded-lg overflow-hidden border"
                      >
                        <AntImage
                          src={media.mediaUrl}
                          alt={`${event.name} - ${index + 1}`}
                          className="object-contain w-full h-64 rounded-lg"
                          height={256}
                          width={900}
                        />
                      </div>
                    ))}
                  </Carousel>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                    {galleryImages.map((media, index) => (
                      <div key={index} className="flex justify-center mb-6 rounded-lg overflow-hidden border">
                        <AntImage
                          key={index}
                          src={media.mediaUrl}
                          alt={`${event.name} - ${index + 1}`}
                          width={100}
                          height={100}
                          className="object-contain w-full h-64 rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="w-full md:w-80 lg:w-96">
              <Card className="sticky top-20">
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Thông tin</h2>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Loại sự kiện</div>
                      <div className="font-medium">{event.typeEventName || "Chưa phân loại"}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Địa điểm</div>
                      <div className="font-medium">{event.locationName || "Chưa có thông tin"}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Quận/Huyện</div>
                      <div className="font-medium">{event.districtName || "Chưa có thông tin"}</div>
                    </div>

                    <div>
                      <div className="text-sm text-muted-foreground">Trạng thái</div>
                      <div className="font-medium">
                        {dayjs(event.endDate).isAfter(dayjs()) ? (
                          <Tag color="green">Đang diễn ra</Tag>
                        ) : (
                          <Tag color="default">Đã kết thúc</Tag>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="w-full" onClick={() => router.push(`/admin/events/edit/${eventId}`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Chỉnh sửa sự kiện
                    </Button>
                  </div>

                  <div className="mt-4">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/admin/events/lists")}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Quay lại danh sách
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default ViewEvent

