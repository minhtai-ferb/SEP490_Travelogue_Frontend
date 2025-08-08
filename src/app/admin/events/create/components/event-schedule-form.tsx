"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Form, DatePicker, TimePicker, Switch, Radio, message, Input } from "antd"
import { useEventController } from "@/services/event-controller"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from 'lucide-react'
import { useRouter } from "next/navigation"
import { addToast } from "@heroui/react"
import dayjs from "dayjs"

// Định nghĩa các mẫu lặp lại cho sự kiện - có thể sử dụng làm gợi ý
const recurrencePatterns = [
  { value: "Hăng tháng", label: "Hăng tháng" },
  { value: "Một năm hai lần", label: "Một năm hai lần" },
  { value: "Một năm một lần", label: "Một năm một lần" },
  { value: "Hai năm một lần", label: "Hai năm một lần" },
]

interface EventScheduleFormProps {
  eventId: string
  onScheduleUpdated: () => void
}

export default function EventScheduleForm({ eventId, onScheduleUpdated }: EventScheduleFormProps) {
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const [useLunarCalendar, setUseLunarCalendar] = useState(false)
  const [eventData, setEventData] = useState<any>(null)
  const [patternSuggestions, setPatternSuggestions] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")

  const { getEventById, updateEvent } = useEventController()
  const router = useRouter()

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const data = await getEventById(eventId)
        setEventData(data)

        // Set form values if data exists
        if (data) {
          form.setFieldsValue({
            startDate: data.startDate ? dayjs(data.startDate) : null,
            endDate: data.endDate ? dayjs(data.endDate) : null,
            startTime: data.startTime ? dayjs(data.startTime, "HH:mm:ss") : null,
            endTime: data.endTime ? dayjs(data.endTime, "HH:mm:ss") : null,
            lunarStartDate: data.lunarStartDate || "",
            lunarEndDate: data.lunarEndDate || "",
            recurrencePattern: data.recurrencePattern || null,
          })

          setIsRecurring(!!data.isRecurring)
          setUseLunarCalendar(!!data.lunarStartDate || !!data.lunarEndDate)

          // Nếu có recurrencePattern, cập nhật inputValue
          if (data.recurrencePattern) {
            setInputValue(data.recurrencePattern)
          }
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
        message.error("Không thể tải dữ liệu sự kiện. Vui lòng thử lại.")
      }
    }

    if (eventId) {
      fetchEventData()
    }
  }, [eventId, getEventById, form])

  // Xử lý khi người dùng nhập vào input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)
    form.setFieldsValue({ recurrencePattern: value })

    // Lọc gợi ý dựa trên giá trị nhập vào
    if (value) {
      const filtered = recurrencePatterns
        .filter(
          (pattern) =>
            pattern.value.toLowerCase().includes(value.toLowerCase()) ||
            pattern.label.toLowerCase().includes(value.toLowerCase()),
        )
        .map((pattern) => pattern.value)
      setPatternSuggestions(filtered)
    } else {
      setPatternSuggestions([])
    }
  }

  // Xử lý khi người dùng chọn một mẫu gợi ý
  const handleSuggestionSelect = (pattern: string) => {
    setInputValue(pattern)
    form.setFieldsValue({ recurrencePattern: pattern })
    setPatternSuggestions([])
  }

  // Handle form submission
  const onFinish = async (values: any) => {
    if (!eventId) {
      message.error("Không tìm thấy ID sự kiện.")
      return
    }

    setSubmitting(true)

    try {
      // Format dates and times
      const formattedValues = {
        name: eventData.name,
        description: eventData.description,
        startDate: values.startDate?.format("YYYY-MM-DD"),
        endDate: values.endDate?.format("YYYY-MM-DD"),
        startTime: values.startTime?.format("HH:mm:ss"),
        endTime: values.endTime?.format("HH:mm:ss"),
        lunarStartDate: useLunarCalendar && values.lunarStartDate ? values.lunarStartDate : null,
        lunarEndDate: useLunarCalendar && values.lunarEndDate ? values.lunarEndDate : null,
        isRecurring: isRecurring,
        recurrencePattern: isRecurring ? values.recurrencePattern : null,
        typeEventId: eventData.typeEventId,
        isHighlighted: eventData.isHighlighted || false,
      }

      // Update event with schedule information
      await updateEvent(eventId, formattedValues)

      addToast({
        title: "Cập nhật lịch trình thành công!",
        description: "Thông tin lịch trình đã được cập nhật.",
        color: "success",
      })

      // Notify parent component
      onScheduleUpdated()
    } catch (error) {
      console.error("Error updating event schedule:", error)
      message.error("Không thể cập nhật lịch trình. Vui lòng thử lại sau.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} className="w-full">
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Label>Loại lịch:</Label>
          <Radio.Group
            defaultValue={useLunarCalendar ? "lunar" : "solar"}
            onChange={(e) => setUseLunarCalendar(e.target.value === "lunar")}
          >
            <Radio value="solar">Dương lịch</Radio>
            <Radio value="lunar">Âm lịch</Radio>
          </Radio.Group>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Form.Item
              label={useLunarCalendar ? "Ngày bắt đầu (Dương lịch)" : "Ngày bắt đầu"}
              name="startDate"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày bắt đầu!",
                },
              ]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày bắt đầu" />
            </Form.Item>

            {useLunarCalendar && (
              <Form.Item label="Ngày bắt đầu (Âm lịch)" name="lunarStartDate">
                <Input placeholder="Nhập ngày bắt đầu âm lịch (VD: 15/01/2023)" />
              </Form.Item>
            )}

            <Form.Item
              label="Giờ bắt đầu"
              name="startTime"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giờ bắt đầu!",
                },
              ]}
            >
              <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ bắt đầu" />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label={useLunarCalendar ? "Ngày kết thúc (Dương lịch)" : "Ngày kết thúc"}
              name="endDate"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ngày kết thúc!",
                },
              ]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" placeholder="Chọn ngày kết thúc" />
            </Form.Item>

            {useLunarCalendar && (
              <Form.Item label="Ngày kết thúc (Âm lịch)" name="lunarEndDate">
                <Input placeholder="Nhập ngày kết thúc âm lịch (VD: 20/01/2023)" />
              </Form.Item>
            )}

            <Form.Item
              label="Giờ kết thúc"
              name="endTime"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn giờ kết thúc!",
                },
              ]}
            >
              <TimePicker className="w-full" format="HH:mm" placeholder="Chọn giờ kết thúc" />
            </Form.Item>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch checked={isRecurring} onChange={(checked) => setIsRecurring(checked)} />
            <Label>Sự kiện lặp lại</Label>
          </div>

          {isRecurring && (
            <div>
              <Form.Item
                label="Mẫu lặp lại"
                name="recurrencePattern"
                rules={[
                  {
                    required: isRecurring,
                    message: "Vui lòng nhập mẫu lặp lại!",
                  },
                ]}
              >
                <Input
                  placeholder="Nhập mẫu lặp lại (ví dụ: DAILY, WEEKLY, MONTHLY, YEARLY)"
                  value={inputValue}
                  onChange={handleInputChange}
                />
              </Form.Item>

              {/* Hiển thị gợi ý */}
              {patternSuggestions.length > 0 && (
                <div className="mb-4 bg-white border rounded-md shadow-sm">
                  <div className="p-2 text-sm text-gray-500">Gợi ý:</div>
                  <ul className="max-h-40 overflow-y-auto">
                    {patternSuggestions.map((pattern) => (
                      <li
                        key={pattern}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleSuggestionSelect(pattern)}
                      >
                        {pattern} - {recurrencePatterns.find((p) => p.value === pattern)?.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Hiển thị gợi ý mẫu */}
              <div className="mt-2 text-sm text-gray-500">
                <p>Các mẫu lặp lại phổ biến:</p>
                <ul className="mt-1 space-y-1">
                  {recurrencePatterns.map((pattern) => (
                    <li key={pattern.value} className="flex">
                      <span
                        className="text-blue-500 cursor-pointer hover:underline"
                        onClick={() => {
                          setInputValue(pattern.value)
                          form.setFieldsValue({ recurrencePattern: pattern.value })
                        }}
                      >
                        {pattern.value}
                      </span>
                      <span className="ml-2">- {pattern.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-6">
        <Button variant="default" type="submit" className="bg-blue-500 text-white" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang cập nhật...
            </>
          ) : (
            "Cập nhật lịch trình"
          )}
        </Button>
      </div>
    </Form>
  )
}
