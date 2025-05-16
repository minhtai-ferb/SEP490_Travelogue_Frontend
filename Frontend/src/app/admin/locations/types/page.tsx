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
import { useLocationController } from "@/services/location-controller";
import { TypeLocation } from "@/types/Location";
import { addToast } from "@heroui/react";
import type { TableProps } from "antd";
import { Form, Input, Modal, Space, Spin, Table } from "antd";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import React, { useEffect, useState } from "react";

function ManageTypeLocation() {
  const [typeLocation, setTypeLocations] = useState<TypeLocation[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<TypeLocation | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const {
    getAllTypeLocation,
    createTypeLocation,
    updateTypeLocation,
    deleteTypeLocation,
  } = useLocationController();

  const columns: TableProps<TypeLocation>["columns"] = [
    {
      title: "Tên loại địa điểm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thao tác",
      key: "key",
      width: "20%",
      render: (_: unknown, record: TypeLocation) => (
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
    fetchTypeLocations();
  }, []);

  const fetchTypeLocations = async () => {
    try {
      const response = await getAllTypeLocation();
      const dataWithKeys = response.map((item: TypeLocation) => ({
        ...item,
        key: item.id,
      }));
      setTypeLocations(dataWithKeys);
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
    setEditingLocation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (location: TypeLocation) => {
    setEditingLocation(location);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (record: TypeLocation) => {
    try {
      await deleteTypeLocation(record.id);
      addToast({
        title: "Thành công!",
        description: "Xóa thành công",
        color: "success",
      });
      fetchTypeLocations();
    } catch (error) {
      addToast({
        title: "Lỗi!",
        description: "Có lỗi khi đang xóa!",
        color: "danger",
      });
    }
  };

  const handleModalOk = async (values: { name: string }) => {
    try {
      if (editingLocation) {
        await updateTypeLocation(editingLocation.id, values);
        addToast({
          title: "Thành công!",
          description: "Chỉnh sửa thành công",
          color: "success",
        });
      } else {
        await createTypeLocation(values);
        addToast({
          title: "Thành công!",
          description: "Tạo mới thành công",
          color: "success",
        });
      }
      setIsModalOpen(false);
      fetchTypeLocations();
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

  const filteredLocations = typeLocation.filter((location) =>
    location.name.toLowerCase().includes(searchText.toLowerCase())
  );

  console.log("Filtered Locations:", filteredLocations);

  if (!loading) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại địa điểm</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin địa điểm...</span>
        </div>
      </SidebarInset>
    );
  } else if (filteredLocations.length == 0) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại địa điểm</BreadcrumbPage>
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
            editingLocation
              ? "Chỉnh sửa loại địa điểm"
              : "Tạo mới loại địa điểm"
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingLocation || { name: "" }}
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="name"
              label="Loại địa điểm"
              rules={[{ required: true, message: "Phải điền loại địa điểm!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingLocation ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  } else if (filteredLocations.length > 0) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý địa điểm</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại địa điểm</BreadcrumbPage>
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
              placeholder="Tìm kiếm loại địa điểm"
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
            <Table<TypeLocation>
              columns={columns}
              dataSource={filteredLocations}
              style={{ width: "100%" }}
            />
          </div>
        </div>
        <Modal
          title={
            editingLocation
              ? "Chỉnh sửa loại địa điểm"
              : "Tạo mới loại địa điểm"
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingLocation || { name: "" }}
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="name"
              label="Loại địa điểm"
              rules={[{ required: true, message: "Phải điền loại địa điểm!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingLocation ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  }
}

export default ManageTypeLocation;
