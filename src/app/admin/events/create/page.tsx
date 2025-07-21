"use client"

import { useState, useEffect } from "react"
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
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
// Sửa đường dẫn import nếu cần thiết
import BasicInfoForm from "./components/basic-info-form"
import EventContentForm from "./components/event-content-form"
import EventScheduleForm from "./components/event-schedule-form"

function CreateEvent() {
  // Sử dụng localStorage để lưu trữ eventId giữa các lần render
  const [currentStep, setCurrentStep] = useState(0)
  const [eventId, setEventId] = useState<string | null>(() => {
    // Khôi phục eventId từ localStorage nếu có
    if (typeof window !== "undefined") {
      const savedEventId = localStorage.getItem("currentEventId")
      return savedEventId || null
    }
    return null
  })
  const router = useRouter()

  // Lưu eventId vào localStorage khi nó thay đổi
  useEffect(() => {
    if (eventId) {
      localStorage.setItem("currentEventId", eventId)
    }
  }, [eventId])

  // Thêm console.log để debug
  useEffect(() => {
    console.log("Current step:", currentStep)
    console.log("Event ID:", eventId)
  }, [currentStep, eventId])

  // Handle event creation from basic info
  const handleEventCreated = (id: string) => {
    console.log("Event created with ID:", id)
    if (!id) {
      console.error("Received empty event ID")
      return
    }

    // Đảm bảo ID được lưu trước khi chuyển bước
    setEventId(id)

    // Sử dụng setTimeout để đảm bảo state đã được cập nhật
    setTimeout(() => {
      setCurrentStep(1)
    }, 100)
  }

  // Handle content update
  const handleContentUpdated = () => {
    console.log("Content updated, moving to step 2")
    setCurrentStep(2)
  }

  // Handle schedule update
  const handleScheduleUpdated = () => {
    console.log("Schedule updated, moving to step 3")
    setCurrentStep(3) // Completed all steps
  }

  // Navigate to event list
  const goToEventList = () => {
    // Xóa eventId khỏi localStorage khi hoàn thành
    localStorage.removeItem("currentEventId")
    router.push("/admin/events/lists")
  }

  // Show completion screen
  if (currentStep === 3) {
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
                <BreadcrumbPage>Tạo mới sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
          <div className="bg-white w-full p-6 rounded-lg shadow-md" style={{ maxWidth: 1200 }}>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Hoàn thành!</h2>
              <p className="text-gray-600 mb-6">Sự kiện đã được tạo và cập nhật đầy đủ thông tin.</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("currentEventId")
                    router.push(`/admin/events/edit/${eventId}`)
                  }}
                >
                  Chỉnh sửa sự kiện
                </Button>
                <Button variant="default" type="button" className="bg-blue-500 text-white" onClick={goToEventList}>
                  Xem danh sách sự kiện
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  // Kiểm tra nếu đang ở bước 1 hoặc 2 mà không có eventId
  if ((currentStep === 1 || currentStep === 2) && !eventId) {
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
                <BreadcrumbPage>Tạo mới sự kiện</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
          <div className="bg-white w-full p-6 rounded-lg shadow-md" style={{ maxWidth: 1200 }}>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 text-2xl">!</span>
              </div>
              <h2 className="text-2xl font-bold mb-2 text-red-600">Lỗi: Không tìm thấy ID sự kiện</h2>
              <p className="text-gray-600 mb-6">Không thể tìm thấy ID sự kiện. Vui lòng quay lại bước tạo sự kiện.</p>
              <div className="flex justify-center gap-4">
                <Button
                  variant="default"
                  type="button"
                  className="bg-blue-500 text-white"
                  onClick={() => {
                    setCurrentStep(0)
                    setEventId(null)
                    localStorage.removeItem("currentEventId")
                  }}
                >
                  Quay lại bước tạo sự kiện
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    )
  }

  // Render content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoForm onEventCreated={handleEventCreated} />
      case 1:
        return <EventContentForm eventId={eventId!} onContentUpdated={handleContentUpdated} />
      case 2:
        return <EventScheduleForm eventId={eventId!} onScheduleUpdated={handleScheduleUpdated} />
      default:
        return <div>Bước không hợp lệ</div>
    }
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
              <BreadcrumbPage>Tạo mới sự kiện</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-1 flex flex-1 flex-col gap-4 items-center w-full h-fit">
        <div className="bg-white w-full p-6 rounded-lg shadow-md" style={{ maxWidth: 1200 }}>
          {/* Progress indicator */}
          <div className="mb-6 border-b pb-4">
            <div className="flex items-center justify-between max-w-3xl mx-auto">
              <div className={`flex flex-col items-center ${currentStep >= 0 ? "text-blue-500" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= 0 ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > 0 ? <Check className="h-4 w-4" /> : "1"}
                </div>
                <span className="text-xs">Thông tin cơ bản</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep >= 1 ? "bg-blue-500" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${currentStep >= 1 ? "text-blue-500" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= 1 ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > 1 ? <Check className="h-4 w-4" /> : "2"}
                </div>
                <span className="text-xs">Nội dung & Hình ảnh</span>
              </div>
              <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-blue-500" : "bg-gray-200"}`}></div>
              <div className={`flex flex-col items-center ${currentStep >= 2 ? "text-blue-500" : "text-gray-400"}`}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    currentStep >= 2 ? "bg-blue-100 text-blue-500" : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {currentStep > 2 ? <Check className="h-4 w-4" /> : "3"}
                </div>
                <span className="text-xs">Lịch trình</span>
              </div>
            </div>
          </div>

          {/* Event ID display when available */}
          {eventId && (
            <div className="bg-green-50 p-4 rounded-md border border-green-200 mb-6">
              <div className="flex items-center">
                <Check className="text-green-500 mr-2" />
                <p className="text-green-700 font-medium">Sự kiện đã được tạo thành công!</p>
              </div>
              <p className="text-green-600 mt-1 text-sm">Vui lòng tiếp tục cập nhật thông tin chi tiết.</p>
            </div>
          )}

          {/* Render step content using the helper function */}
          <div className="step-content">{renderStepContent()}</div>
        </div>
      </div>
    </SidebarInset>
  )
}

export default CreateEvent

