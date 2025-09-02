// app/admin/bookings/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { matchKeyword } from "./utils/text";
import BookingFilterBar, {
  BookingFilter as UIXFilter,
} from "./components/booking-filter-bar";
import { useBookings } from "@/services/use-bookings";
import { useTourguideAssign } from "@/services/tourguide";
import { BookingItem, BookingTableComponent } from "./components/booking-table";
import { hasAdminInPath } from "@/utils/check-admin";
import TourGuideProfileModal from "../detail/[id]/components/TourGuideProfileModal";

export default function BookingTourGuideTable() {
  const { loading, getBookingsPaged } = useBookings();
  const { getTourguideProfile, loading: tourGuideLoading } = useTourguideAssign();
  const router = useRouter();
  const pathname = usePathname();

  const [filter, setFilter] = useState<UIXFilter>({
    status: undefined,
    bookingType: undefined,
    startDate: undefined,
    endDate: undefined,
    keyword: "",
  });

  // server pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // raw data từ API (theo trang server)
  const [serverTotal, setServerTotal] = useState(0);
  const [rawItems, setRawItems] = useState<BookingItem[]>([]);

  // tour guide modal state
  const [tourGuideModalOpen, setTourGuideModalOpen] = useState(false);
  const [tourGuideProfile, setTourGuideProfile] = useState<any>(null);

  // fetch theo status/type/date (không có keyword)
  const fetchData = async (opts?: { resetPage?: boolean }) => {
    const pn = opts?.resetPage ? 1 : pageNumber;
    const res = await getBookingsPaged({
      status: filter.status,
      bookingType: 3,
      startDate: filter.startDate,
      endDate: filter.endDate,
      pageNumber: pn,
      pageSize,
    });
    if (res) {
      // Sort by bookingDate descending (most recent first)
      const sortedItems = res.items.sort(
        (a: BookingItem, b: BookingItem) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
      setRawItems(sortedItems);
      setServerTotal(res.totalCount);
      if (opts?.resetPage) setPageNumber(1);
    }
  };

  useEffect(() => {
    fetchData(); /* eslint-disable-next-line */
  }, [pageNumber, pageSize]);

  const onApply = async () => {
    await fetchData({ resetPage: true });
  };

  const onReset = async () => {
    const empty = {
      status: undefined,
      bookingType: undefined,
      startDate: undefined,
      endDate: undefined,
      keyword: "",
    };
    setFilter(empty);
    setPageNumber(1);
    const res = await getBookingsPaged({ ...empty, pageNumber: 1, pageSize });
    if (res) {
      // Sort by bookingDate descending (most recent first)
      const sortedItems = res.items.sort(
        (a: BookingItem, b: BookingItem) =>
          new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime()
      );
      setRawItems(sortedItems);
      setServerTotal(res.totalCount);
    }
  };

  const filteredLocal = useMemo(() => {
    const kw = (filter.keyword ?? "").trim();
    if (!kw) return rawItems;
    return rawItems.filter((r) =>
      matchKeyword(
        kw,
        r.tourName,
        r.tourGuideName,
        r.userName,
        r.tripPlanName,
        r.contactName
      )
    );
  }, [rawItems, filter.keyword]);

  // Khi có keyword => dùng client pagination trên filteredLocal
  const isClientPaging = Boolean((filter.keyword ?? "").trim());

  const [clientPage, setClientPage] = useState(1);
  const [clientSize, setClientSize] = useState(10);
  useEffect(() => {
    setClientPage(1);
  }, [filter.keyword]); // reset trang khi đổi keyword

  const clientPagedData = useMemo(() => {
    if (!isClientPaging) return filteredLocal;
    const start = (clientPage - 1) * clientSize;
    return filteredLocal.slice(start, start + clientSize);
  }, [filteredLocal, isClientPaging, clientPage, clientSize]);

  // Handle view booking detail
  const handleViewBooking = (booking: BookingItem) => {
    const isAdminPath = hasAdminInPath(pathname);
    const basePath = isAdminPath ? "/admin" : "/moderator";
    router.push(`${basePath}/booking/tour-guide/${booking.id}`);
  };

  // Handle view tour guide
  const handleViewTourGuide = async (booking: BookingItem) => {
    if (booking.tourGuideId) {
      try {
        setTourGuideModalOpen(true);
        const profileData = await getTourguideProfile(booking.tourGuideId);
        setTourGuideProfile(profileData);
      } catch (error) {
        console.error("Error fetching tour guide profile:", error);
        setTourGuideModalOpen(false);
      }
    }
  };

  // Handle view trip plan
  const handleViewTripPlan = (booking: BookingItem) => {
    if (booking.tripPlanId) {
      const isAdminPath = hasAdminInPath(pathname);
      const basePath = isAdminPath ? "/admin" : "/moderator";
      router.push(`${basePath}/personal-plan/${booking.tripPlanId}`);
    }
  };

  return (
    <div className="gap-4 p-4 absolute w-full pt-20">
      <BookingFilterBar
        value={filter}
        onChange={setFilter}
        onReset={onReset}
        onApply={onApply}
      />

      <BookingTableComponent
        data={isClientPaging ? clientPagedData : rawItems}
        loading={loading}
        currentPage={isClientPaging ? clientPage : pageNumber}
        pageSize={isClientPaging ? clientSize : pageSize}
        totalCount={isClientPaging ? filteredLocal.length : serverTotal}
        onPaginationChange={(p: number, s: number) => {
          if (isClientPaging) {
            setClientPage(p);
            setClientSize(s);
          } else {
            setPageNumber(p);
            setPageSize(s);
          }
        }}
        onView={handleViewBooking}
        onCancel={(r: BookingItem) => console.log("cancel", r.id)}
        onPay={(r: BookingItem) => console.log("pay", r.paymentLinkId)}
        onViewTourGuide={handleViewTourGuide}
        onViewTripPlan={handleViewTripPlan}
      />

      {/* Tour Guide Profile Modal */}
      <TourGuideProfileModal
        open={tourGuideModalOpen}
        onClose={() => {
          setTourGuideModalOpen(false);
          setTourGuideProfile(null);
        }}
        tourGuideProfile={tourGuideProfile}
        loading={tourGuideLoading}
      />
    </div>
  );
}
