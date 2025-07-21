"use client";

import { useState, useEffect } from "react";
import { Form, Input, Switch, message, Spin } from "antd";
import { useDistrictManager } from "@/services/district-manager";
import { useLocationController } from "@/services/location-controller";
import { useEventController } from "@/services/event-controller";
import type { District } from "@/types/District";
import type { TypeEvent } from "@/types/Event";
import type { Location } from "@/types/Location";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";

interface BasicInfoFormProps {
  onEventCreated: (eventId: string) => void;
}

export default function BasicInfoForm({ onEventCreated }: BasicInfoFormProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [typeEvents, setTypeEvents] = useState<TypeEvent[]>([]);
  const [locations, setLocation] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { getAllDistrict } = useDistrictManager();
  const { getAllLocation } = useLocationController();
  const { getAllTypeEvent, createEvent } = useEventController();
  const [form] = Form.useForm();
  const router = useRouter();

  // Fetch districts, event types, and locations
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const responseDistricts = await getAllDistrict();
        const responseTypeEvents = await getAllTypeEvent();
        const responseLocations = await getAllLocation();
        setLocation(responseLocations);
        setDistricts(responseDistricts);
        setTypeEvents(responseTypeEvents);
      } catch (error) {
        addToast({
          title: "Không thể tải dữ liệu ban đầu. Vui lòng làm mới trang.",
          description: error as string,
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAllDistrict, getAllTypeEvent, getAllLocation]);

  // Handle form submission
  const onFinish = async (values: any) => {
    setSubmitting(true);

    try {
      // Create basic event with minimal required information
      const formattedValues = {
        ...values,
        // Add default empty values for fields that will be updated later
        content: "",
        startDate: null,
        endDate: null,
        startTime: null,
        endTime: null,
        lunarStartDate: null,
        lunarEndDate: null,
        isRecurring: false,
        recurrencePattern: null,
        rating: "0",
      };

      // Create event
      const eventData = await createEvent(formattedValues);

      if (!eventData) {
        // addToast({
        //   title: "Có lỗi xảy ra",
        //   description: "Không thể tạo sự kiện.",
        //   color: "danger",
        // });
        return;
      }

      // Notify parent component about successful event creation
      onEventCreated(eventData.id);
      addToast({
        title: "Tạo sự kiện thành công!",
        description: "Bây giờ bạn có thể cập nhật thông tin chi tiết.",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Có lỗi xảy ra",
        description: error as string,
        color: "danger",
      });
      message.error("Không thể tạo sự kiện. Vui lòng thử lại sau.");
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading overlay when submitting form
  if (submitting) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Spin size="large" />
        <span className="ml-2">Đang tạo sự kiện mới...</span>
      </div>
    );
  }

  return (
    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
      className="w-full"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Form.Item
            label="Tên sự kiện"
            name="name"
            rules={[
              { required: true, message: "Vui lòng nhập tên sự kiện!" },
            ]}
          >
            <Input placeholder="Nhập tên sự kiện" />
          </Form.Item>

          <Form.Item
            label="Mô tả ngắn"
            name="description"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả!" },
            ]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả ngắn gọn"
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label="Loại sự kiện"
            name="typeEventId"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại sự kiện!",
              },
            ]}
          >
            <Select
              onValueChange={(value) =>
                form.setFieldsValue({ typeEventId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn loại sự kiện" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : (
                  typeEvents.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.typeName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label="Địa điểm"
            name="locationId"
            rules={[{ message: "Vui lòng chọn địa điểm!" }]}
          >
            <Select
              onValueChange={(value) =>
                form.setFieldsValue({ locationId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : (
                  locations.map((location: Location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </Form.Item>

          <Form.Item
            label="Quận/Huyện"
            name="districtId"
            rules={[
              { required: true, message: "Vui lòng chọn quận/huyện!" },
            ]}
          >
            <Select
              onValueChange={(value) =>
                form.setFieldsValue({ districtId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {loading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Đang tải...</span>
                  </div>
                ) : (
                  districts.map((district) => (
                    <SelectItem key={district.id} value={district.id}>
                      {district.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </Form.Item>

          <Form.Item
            label="Sự kiện nổi bật"
            name="isHighlighted"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>
      </div>

      <div className="flex gap-4 justify-end mt-6">
        <Button
          variant="outline"
          type="button"
          onClick={() => router.push("/admin/events/lists")}
        >
          Hủy
        </Button>
        <Button
          variant="default"
          type="submit"
          className="bg-blue-500 text-white"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tạo mới...
            </>
          ) : (
            "Tạo mới sự kiện"
          )}
        </Button>
      </div>
    </Form>
  );
}
