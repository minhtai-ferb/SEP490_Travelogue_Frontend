"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button"; // shadcn button import
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useEventController } from "@/services/event-controller"; // Use event controller
import { TypeEvent } from "@/types/Event"; // Change to TypeEvent
import { addToast } from "@heroui/react";
import type { TableProps } from "antd";
import { Form, Input, Modal, Space, Spin, Table } from "antd";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import React, { useEffect, useState } from "react";

function ManageTypeEvent() {
  const [typeEvent, setTypeEvents] = useState<TypeEvent[]>([]); // Change to TypeEvent
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TypeEvent | null>(null); // Change to TypeEvent
  const [loading, setLoading] = useState(false);
  const {
    getAllTypeEvent, // Use event controller for type events
    createTypeEvent,
    updateTypeEvent,
    deleteTypeEvent,
  } = useEventController(); // Change to useEventController

  const columns: TableProps<TypeEvent>["columns"] = [ // Change to TypeEvent
    {
      title: "Tên loại sự kiện", // Change to Event
      dataIndex: "typeName",
      key: "typeName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thao tác",
      key: "key",
      width: "20%",
      render: (_: unknown, record: TypeEvent) => ( // Change to TypeEvent
        <Space size="small">
          {/* Button for Edit */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleEdit(record)}
            title="Chỉnh sửa"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Chỉnh sửa</span>
          </Button>
          {/* Button for Delete */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleDeleteConfirm(record)}
            title="Xóa"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Xóa</span>
          </Button>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    fetchTypeEvents();
  }, []);

  const fetchTypeEvents = async () => {
    try {
      const response = await getAllTypeEvent(); // Use event API
      const dataWithKeys = response.map((item: TypeEvent) => ({ // Change to TypeEvent
        ...item,
        key: item.id,
      }));
      setTypeEvents(dataWithKeys);
      console.log("Data:", dataWithKeys);
    } catch (error) {
      addToast({
        title: "Lỗi!",
        description: "Có lỗi khi lấy dữ liệu!",
        color: "danger",
      });
      console.error("Có lỗi khi lấy data:", error);
    } finally {
      setLoading(true);
    }
  };

  const handleCreate = () => {
    setEditingEvent(null); // Change to editingEvent
    setIsModalOpen(true);
  };

  const handleEdit = (event: TypeEvent) => { // Change to TypeEvent
    setEditingEvent(event); // Change to editingEvent
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (record: TypeEvent) => { // Change to TypeEvent
    try {
      await deleteTypeEvent(record.id); // Use event delete API
      addToast({
        title: "Thành công!",
        description: "Xóa thành công",
        color: "success",
      });
      fetchTypeEvents();
    } catch (error) {
      addToast({
        title: "Lỗi!",
        description: "Có lỗi khi đang xóa!",
        color: "danger",
      });
    }
  };

  const handleModalOk = async (values: { typeName: string }) => {
    try {
      if (editingEvent) {
        await updateTypeEvent(editingEvent.id, values); // Change to updateTypeEvent
        addToast({
          title: "Thành công!",
          description: "Chỉnh sửa thành công",
          color: "success",
        });
      } else {
        await createTypeEvent(values); // Use createTypeEvent
        addToast({
          title: "Thành công!",
          description: "Tạo mới thành công",
          color: "success",
        });
      }
      setIsModalOpen(false);
      fetchTypeEvents();
    } catch (error) {
      addToast({
        title: "Lỗi!",
        description: "Có lỗi khi lấy chỉnh sửa/tạo mới!",
        color: "danger",
      });
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const filteredEvents = typeEvent.filter((event) => // Change to TypeEvent
    event.typeName.toLowerCase().includes(searchText.toLowerCase()) // Change to TypeEvent
  );

  console.log("Filtered Events:", filteredEvents); // Change to filteredEvents

  if (!loading) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink> {/* Change to Event */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại sự kiện</BreadcrumbPage> {/* Change to Event */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin sự kiện...</span> {/* Change to Event */}
        </div>
      </SidebarInset>
    );
  } else if (filteredEvents.length === 0) { // Change to filteredEvents
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink> {/* Change to Event */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại sự kiện</BreadcrumbPage> {/* Change to Event */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 justify-center items-center">
          <Button className="bg-blue-500 text-white mx-auto" onClick={handleCreate}>
            Tạo mới
          </Button>
        </div>
        <Modal
          title={
            editingEvent
              ? "Chỉnh sửa loại sự kiện"
              : "Tạo mới loại sự kiện" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingEvent || { name: "" }} // Change to editingEvent
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="typeName"
              label="Loại sự kiện" 
              rules={[{ required: true, message: "Phải điền loại sự kiện!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingEvent ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  } else if (filteredEvents.length > 0) { // Change to filteredEvents
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý sự kiện</BreadcrumbLink> {/* Change to Event */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại sự kiện</BreadcrumbPage> {/* Change to Event */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <Input
              placeholder="Tìm kiếm loại sự kiện" 
              value={searchText}
              onChange={handleSearch}
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button className="bg-blue-500 text-white" onClick={handleCreate}>
              Tạo mới
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Table<TypeEvent> // Change to TypeEvent
              columns={columns}
              dataSource={filteredEvents} // Change to filteredEvents
              style={{ width: "100%" }}
              pagination={{ pageSize: 5 }}
            />
          </div>
        </div>
        <Modal
          title={
            editingEvent
              ? "Chỉnh sửa loại sự kiện"
              : "Tạo mới loại sự kiện" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingEvent || { name: "" }} // Change to editingEvent
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="typeName"
              label="Loại sự kiện"
              rules={[{ required: true, message: "Phải điền loại sự kiện!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingEvent ? "Chỉnh sửa" : "Tạo mới"} 
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  }
}

export default ManageTypeEvent;