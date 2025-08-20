// app/admin/bookings/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { matchKeyword } from "./utils/text";
import BookingFilterBar, {
  BookingFilter as UIXFilter,
} from "./components/booking-filter-bar";
import { useBookings } from "@/services/use-bookings";
import { BookingItem, BookingTableComponent } from "./components/booking-table";

export default function BookingTourGuideTable() {
  const { loading, getBookingsPaged } = useBookings();

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

  // fetch theo status/type/date (không có keyword)
  const fetchData = async (opts?: { resetPage?: boolean }) => {
    const pn = opts?.resetPage ? 1 : pageNumber;
    const res = await getBookingsPaged({
      status: filter.status,
      bookingType: filter.bookingType,
      startDate: filter.startDate,
      endDate: filter.endDate,
      pageNumber: pn,
      pageSize,
    });
    if (res) {
      setRawItems(res.items);
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
      setRawItems(res.items);
      setServerTotal(res.totalCount);
    }
  };

  const filteredLocal = useMemo(() => {
    const kw = (filter.keyword ?? "").trim();
    if (!kw) return rawItems;
    return rawItems.filter((r) =>
      matchKeyword(kw, r.tourName, r.tourGuideName, r.userName)
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

  return (
    <div className="gap-4 p-4">
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
        onPaginationChange={(p, s) => {
          if (isClientPaging) {
            setClientPage(p);
            setClientSize(s);
          } else {
            setPageNumber(p);
            setPageSize(s);
          }
        }}
        onView={(r) => console.log("view", r.id)}
        onCancel={(r) => console.log("cancel", r.id)}
        onPay={(r) => console.log("pay", r.paymentLinkId)}
      />
    </div>
  );
}
