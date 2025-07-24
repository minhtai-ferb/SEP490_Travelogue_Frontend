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
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"; // Use newcategory controller
import { useNewsController } from "@/services/news-manager";
import { Newcategory } from "@/types/New";
import { addToast } from "@heroui/react";
import type { TableProps } from "antd";
import { Form, Input, Modal, Space, Spin, Table } from "antd";
import { Pencil, Trash2 } from "lucide-react"; // Import icons
import React, { useEffect, useState } from "react";

function ManageNewcategory() {
  const [newcategories, setNewcategories] = useState<Newcategory[]>([]); // Change to Newcategory
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Newcategory | null>(null); // Change to Newcategory
  const [loading, setLoading] = useState(false);
  const {
    getAllNewcategory, 
    createNewcategory,
    updateNewcategory,
    deleteNewcategory,
  } = useNewsController(); // Change to useNewcategoryController

  const columns: TableProps<Newcategory>["columns"] = [ // Change to Newcategory
    {
      title: "Tên loại danh mục", // Change to Category
      dataIndex: "category",
      key: "category",
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: "Thao tác",
      key: "key",
      width: "20%",
      render: (_: unknown, record: Newcategory) => ( // Change to Newcategory
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
    fetchNewcategories();
  }, []);

  const fetchNewcategories = async () => {
    try {
      const response = await getAllNewcategory(); // Use newcategory API
      const dataWithKeys = response.map((item: Newcategory) => ({ // Change to Newcategory
        ...item,
        key: item.id,
      }));
      setNewcategories(dataWithKeys);
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
    setEditingCategory(null); // Change to editingCategory
    setIsModalOpen(true);
  };

  const handleEdit = (category: Newcategory) => { // Change to Newcategory
    setEditingCategory(category); // Change to editingCategory
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async (record: Newcategory) => { // Change to Newcategory
    try {
      await deleteNewcategory(record.id); // Use newcategory delete API
      addToast({
        title: "Thành công!",
        description: "Xóa thành công",
        color: "success",
      });
      fetchNewcategories();
    } catch (error) {
      addToast({
        title: "Lỗi!",
        description: "Có lỗi khi đang xóa!",
        color: "danger",
      });
    }
  };

  const handleModalOk = async (values: { category: string }) => {
    try {
      if (editingCategory) {
        await updateNewcategory(editingCategory.id, values); // Change to updateNewcategory
        addToast({
          title: "Thành công!",
          description: "Chỉnh sửa thành công",
          color: "success",
        });
      } else {
        await createNewcategory(values); // Use createNewcategory
        addToast({
          title: "Thành công!",
          description: "Tạo mới thành công",
          color: "success",
        });
      }
      setIsModalOpen(false);
      fetchNewcategories();
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

  const filteredCategories = newcategories.filter((category) => // Change to Newcategory
    category.category.toLowerCase().includes(searchText.toLowerCase()) // Change to Newcategory
  );

  console.log("Filtered Categories:", filteredCategories); // Change to filteredCategories

  if (!loading) {
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý loại danh mục</BreadcrumbLink> {/* Change to Category */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý danh mục mới</BreadcrumbPage> {/* Change to Category */}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <Spin size="large" />
          <span className="ml-2">Đang tải thông tin danh mục...</span> {/* Change to Category */}
        </div>
      </SidebarInset>
    );
  } else if (filteredCategories.length === 0) { // Change to filteredCategories
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý loại danh mục</BreadcrumbLink> {/* Change to Category */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý danh mục mới</BreadcrumbPage> {/* Change to Category */}
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
            editingCategory
              ? "Chỉnh sửa loại danh mục"
              : "Tạo mới loại danh mục" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingCategory || { name: "" }} // Change to editingCategory
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="category"
              label="Loại danh mục" 
              rules={[{ required: true, message: "Phải điền loại danh mục!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingCategory ? "Chỉnh sửa" : "Tạo mới"}
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  } else if (filteredCategories.length > 0) { // Change to filteredCategories
    return (
      <SidebarInset>
        <header className="sticky top-0 flex shrink-0 items-center gap-2 border-b bg-background p-4 z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Quản lý loại danh mục</BreadcrumbLink> {/* Change to Category */}
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Quản lý danh mục mới</BreadcrumbPage> {/* Change to Category */}
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
              placeholder="Tìm kiếm loại danh mục" 
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
            <Table<Newcategory> // Change to Newcategory
              columns={columns}
              dataSource={filteredCategories} // Change to filteredCategories
              style={{ width: "100%" }}
              pagination={{ pageSize: 6 }}
            />
          </div>
        </div>
        <Modal
          title={
            editingCategory
              ? "Chỉnh sửa loại danh mục"
              : "Tạo mới loại danh mục" 
          }
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          footer={null}
        >
          <Form
            initialValues={editingCategory || { name: "" }} // Change to editingCategory
            onFinish={handleModalOk}
            layout="vertical"
          >
            <Form.Item
              className="mt-2"
              name="category"
              label="Loại danh mục"
              rules={[{ required: true, message: "Phải điền loại danh mục!" }]} 
            >
              <Input />
            </Form.Item>
            <Form.Item style={{ textAlign: "right" }}>
              <Button type="submit" className="bg-blue-500 text-white">
                {editingCategory ? "Chỉnh sửa" : "Tạo mới"} 
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </SidebarInset>
    );
  }
}

export default ManageNewcategory;
