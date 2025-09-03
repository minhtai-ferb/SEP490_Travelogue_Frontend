"use client";

import '@ant-design/v5-patch-for-react-19';
import React, { useEffect, useMemo, useState } from "react";
import { Card, message, Modal } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useTour } from "@/services/tour";
import type { TourDetail } from "@/types/Tour";
import { useRouter } from "next/navigation";
import { StatsCards } from "./StatsCards";
import { TopBarAntd } from "./TopBarAntd";
import { ToursTableAntd } from "./ToursTableAntd";
import { ErrorResult } from "./ErrorResult";
import "./tour-management.css";

const { confirm } = Modal;

interface TourManagementAntdProps {
  href: string;
}

function TourManagement({ href }: TourManagementAntdProps) {
  const router = useRouter();
  const [tours, setTours] = useState<TourDetail[]>([]);
  const [filteredTours, setFilteredTours] = useState<TourDetail[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const { getAllTour, deleteTour } = useTour();

  const fetchAllTours = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAllTour();
      const sortedTours = response?.sort(
        (a: any, b: any) =>
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
      );
      setTours(sortedTours || []);
      setFilteredTours(sortedTours || []);
    } catch (error) {
      setError("Có lỗi khi tải dữ liệu chuyến đi");
      message.error("Có lỗi khi tải dữ liệu chuyến đi");
      console.error("Lỗi fetch tours", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTours();
  }, []);

  useEffect(() => {
    let filtered = tours;

    // Search filter
    if (searchValue) {
      filtered = filtered.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchValue.toLowerCase()) ||
          tour.description.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((tour) => tour.statusText === statusFilter);
    }

    // Type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((tour) => tour.tourTypeText === typeFilter);
    }

    // Rating filter
    if (ratingFilter !== "all") {
      if (ratingFilter === "no-rating") {
        filtered = filtered.filter((tour) => !tour.averageRating || tour.averageRating <= 0);
      } else if (ratingFilter === "5") {
        filtered = filtered.filter((tour) => tour.averageRating >= 5);
      } else if (ratingFilter === "4+") {
        filtered = filtered.filter((tour) => tour.averageRating >= 4);
      } else if (ratingFilter === "3+") {
        filtered = filtered.filter((tour) => tour.averageRating >= 3);
      } else if (ratingFilter === "2+") {
        filtered = filtered.filter((tour) => tour.averageRating >= 2);
      } else if (ratingFilter === "1+") {
        filtered = filtered.filter((tour) => tour.averageRating >= 1);
      }
    }

    setFilteredTours(filtered);
    setPage(1); // Reset to first page when filtering
  }, [tours, searchValue, statusFilter, typeFilter, ratingFilter]);

  const paginatedTours = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredTours.slice(start, end)
  }, [page, pageSize, filteredTours]);

  // Actions
  const handleView = (tour: TourDetail) => {
    router.push(`${href}/${tour.tourId}`);
  };

  const handleEdit = (tour: TourDetail) => {
    router.push(`${href}/${tour.tourId}/edit`);
  };

  const handleDelete = (tour: TourDetail) => {
    confirm({
      title: "Xác nhận xóa chuyến đi",
      icon: <ExclamationCircleFilled />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa chuyến đi này không?</p>
          <p style={{ fontWeight: 600, marginTop: 8 }}>
            Chuyến đi: {tour.name}
          </p>
          <p style={{ color: "#666", fontSize: 12 }}>
            Hành động này không thể hoàn tác.
          </p>
        </div>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => handleConfirmDelete(tour),
    });
  };

  const handleConfirmDelete = async (tour: TourDetail) => {
    try {
      setActionLoading(true);
      await deleteTour(tour.tourId);
      message.success("Xóa chuyến đi thành công");
      await fetchAllTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
      message.error("Có lỗi khi xóa chuyến đi");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreate = () => {
    router.push(`${href}/create`);
  };

  const handlePageChange = (newPage: number, newPageSize?: number) => {
    setPage(newPage);
    if (newPageSize && newPageSize !== pageSize) {
      setPageSize(newPageSize);
    }
  };

  // Show error state if there's an error
  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <ErrorResult message={error} onRetry={fetchAllTours} />
      </div>
    );
  }

  return (
    <div className="absolute w-full pt-20 p-4">
      {/* Statistics Cards */}
      <div className="tour-management-stats">
        <StatsCards tours={tours} />
      </div>

      {/* Main Content Card */}
      <Card
        title={
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            Quản Lý Chuyến Tham Quan
          </div>
        }
        style={{ borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
      >
        {/* Top Bar with Filters */}
        <div className="tour-filters">
          <TopBarAntd
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            typeFilter={typeFilter}
            onTypeChange={setTypeFilter}
            ratingFilter={ratingFilter}
            onRatingChange={setRatingFilter}
            onCreate={handleCreate}
            totalCount={filteredTours.length}
          />
        </div>

        {/* Tours Table */}
        <div className="tour-table-container">
          <ToursTableAntd
            tours={paginatedTours}
            loading={loading}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={{
              current: page,
              pageSize: pageSize,
              total: filteredTours.length,
              onChange: handlePageChange,
            }}
          />
        </div>
      </Card>
    </div>
  );
}

export default TourManagement;
