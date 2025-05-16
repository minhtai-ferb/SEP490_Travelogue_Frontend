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
import { useExperienceController } from "@/services/experience-controller"; // Use experience controller
import { TypeExperience } from "@/types/Experience"; // Change to TypeExperience
import { addToast } from "@heroui/react";
import type { TableProps } from "antd";
import { Form, Input, Modal, Space, Spin, Table } from "antd";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import React, { useEffect, useState } from "react";

function ManageTypeExperience() {
  const [typeExperience, setTypeExperiences] = useState<TypeExperience[]>([]); 
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<TypeExperience | null>(null); 
  const [loading, setLoading] = useState(false);
  const {
    getAllTypeExperience, 
    createTypeExperience,
    updateTypeExperience,
    deleteTypeExperience,
  } = useExperienceController(); 

  const columns: TableProps<TypeExperience>["columns"] = [ // Change to TypeExperience
    {
      title: "Tên loại trải nghiệm", // Change to Experience
      dataIndex: "typeName",
      key: "typeName",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thao tác",
      key: "key",
      width: "20%",
      render: (_: unknown, record: TypeExperience) => ( // Change to TypeExperience
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
    fetchTypeExperiences();
  }, []);

  const fetchTypeExperiences = async () => {
    try {
      const response = await getAllTypeExperience(); // Use experience API
      const dataWithKeys = response.map((item: TypeExperience) => ({ // Change to TypeExperience
        ...item,
        key: item.id,
      }));
      setTypeExperiences(dataWithKeys);
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
    setEditingExperience(null); // Change to editingExperience
    setIsModalOpen(true);
  };

  const handleEdit = (experience: TypeExperience) => { // Change to TypeExperience
    setEditingExperience(experience); // Change to editingExperience
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (record: TypeExperience) => { // Change to TypeExperience
    try {
      await deleteTypeExperience(record.id); // Use experience delete API
      addToast({
        title: "Thành công!",
        description: "Xóa thành công",
        color: "success",
      });
      fetchTypeExperiences();
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
      if (editingExperience) {
        await updateTypeExperience(editingExperience.id, values); // Change to updateTypeExperience
        addToast({
          title: "Thành công!",
          description: "Chỉnh sửa thành công",
          color: "success",
        });
      } else {
        await createTypeExperience(values); // Use createTypeExperience
        addToast({
          title: "Thành công!",
          description: "Tạo mới thành công",
          color: "success",
        });
      }
      setIsModalOpen(false);
      fetchTypeExperiences();
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

  const filteredExperiences = typeExperience.filter((experience) => // Change to TypeExperience
    experience.typeName.toLowerCase().includes(searchText.toLowerCase()) // Change to TypeExperience
  );

  console.log("Filtered Experiences:", filteredExperiences); // Change to filteredExperiences

  if (!loading) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý trải nghiệm</BreadcrumbLink> {/* Change to Experience */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại trải nghiệm</BreadcrumbPage> {/* Change to Experience */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin trải nghiệm...</span> {/* Change to Experience */}
        </div>
      </SidebarInset>
    );
  } else if (filteredExperiences.length === 0) { // Change to filteredExperiences
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý trải nghiệm</BreadcrumbLink> {/* Change to Experience */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại trải nghiệm</BreadcrumbPage> {/* Change to Experience */}
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
            editingExperience
              ? "Chỉnh sửa loại trải nghiệm"
              : "Tạo mới loại trải nghiệm" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingExperience || { name: "" }} // Change to editingExperience
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="typeName"
              label="Loại trải nghiệm" 
              rules={[{ required: true, message: "Phải điền loại trải nghiệm!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingExperience ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  } else if (filteredExperiences.length > 0) { // Change to filteredExperiences
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý trải nghiệm</BreadcrumbLink> {/* Change to Experience */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý loại trải nghiệm</BreadcrumbPage> {/* Change to Experience */}
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
              placeholder="Tìm kiếm loại trải nghiệm" 
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
            <Table<TypeExperience> // Change to TypeExperience
              columns={columns}
              dataSource={filteredExperiences} // Change to filteredExperiences
              style={{ width: "100%" }}
              pagination={{ pageSize: 6 }}
            />
          </div>
        </div>
        <Modal
          title={
            editingExperience
              ? "Chỉnh sửa loại trải nghiệm"
              : "Tạo mới loại trải nghiệm" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingExperience || { name: "" }} // Change to editingExperience
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="typeName"
              label="Loại trải nghiệm"
              rules={[{ required: true, message: "Phải điền loại trải nghiệm!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingExperience ? "Chỉnh sửa" : "Tạo mới"} 
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  }
}

export default ManageTypeExperience;
