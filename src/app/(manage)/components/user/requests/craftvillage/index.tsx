"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCraftVillage } from "@/services/use-craftvillage";
import { CraftVillageRequestResponse, CraftVillageRequestStatus } from "@/types/CraftVillage";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowDown, ArrowUp, ArrowUpDown, Eye, MapPin, Search } from "lucide-react";
import dayjs from "dayjs";

function CraftVillageRequest({ href }: { href: string }) {
	const router = useRouter()

	const [dataTable, setDataTable] = useState<CraftVillageRequestResponse[]>([])
	const [query, setQuery] = useState("")
	const [search, setSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [sortBy, setSortBy] = useState<"name" | "ownerFullName" | "status" | "createdTime">("createdTime");
	const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
	const [isHydrated, setIsHydrated] = useState(false);

	const { getCraftVillageRequest, loading } = useCraftVillage()

	useEffect(() => {
		setIsHydrated(true);
	}, []);

	// Debounce search input
	useEffect(() => {
		const t = setTimeout(() => {
			setSearch(query);
		}, 350);
		return () => clearTimeout(t);
	}, [query]);

	const fetchData = async () => {
		try {
			const response = await getCraftVillageRequest()
			const list: CraftVillageRequestResponse[] = Array.isArray(response) ? response : [];
			const filtered = search
				? list.filter(
					(it) =>
						it.name?.toLowerCase().includes(search.toLowerCase()) ||
						it.ownerFullName?.toLowerCase().includes(search.toLowerCase()) ||
						it.ownerEmail?.toLowerCase().includes(search.toLowerCase()) ||
						it.address?.toLowerCase().includes(search.toLowerCase())
				)
				: list;

			setDataTable(filtered);
		} catch (e) {
			console.error(e);
		}
	}

	useEffect(() => {
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [search, statusFilter]);

	const handleView = (id: string) => {
		router.push(`${href}/craftvillage/request/${id}`)
	}

	const initials = (name?: string) => {
		if (!name) return "?";
		const parts = name.trim().split(/\s+/);
		const f = parts[0]?.[0] ?? "";
		const l = parts.length > 1 ? parts[parts.length - 1][0] : "";
		return (f + l).toUpperCase();
	};

	const statusBadge = (s: CraftVillageRequestStatus | number | undefined) => {
		const st = (s as CraftVillageRequestStatus) ?? CraftVillageRequestStatus.Pending;
		switch (st) {
			case CraftVillageRequestStatus.Pending:
				return (
					<Badge className="border-amber-200 bg-amber-100 text-amber-800">Chờ duyệt</Badge>
				);
			case CraftVillageRequestStatus.Approved:
				return (
					<Badge className="border-emerald-200 bg-emerald-100 text-emerald-800">Đã duyệt</Badge>
				);
			case CraftVillageRequestStatus.Rejected:
				return (
					<Badge className="border-rose-200 bg-rose-100 text-rose-800">Từ chối</Badge>
				);
			default:
				return <Badge variant="secondary">Trạng thái</Badge>;
		}
	};

	const filteredAndSortedData = useMemo(() => {
		let filtered = dataTable.filter((row) => {
			const matchStatus =
				statusFilter === "all" ||
				(statusFilter === "pending" && row.status === CraftVillageRequestStatus.Pending) ||
				(statusFilter === "approved" && row.status === CraftVillageRequestStatus.Approved) ||
				(statusFilter === "rejected" && row.status === CraftVillageRequestStatus.Rejected)
			return matchStatus;
		});

		// Sort data
		filtered.sort((a, b) => {
			const dir = sortDir === "asc" ? 1 : -1;
			if (sortBy === "name") {
				const av = (a.name || "").toLowerCase();
				const bv = (b.name || "").toLowerCase();
				return av.localeCompare(bv) * dir;
			}
			if (sortBy === "ownerFullName") {
				const av = (a.ownerFullName || "").toLowerCase();
				const bv = (b.ownerFullName || "").toLowerCase();
				return av.localeCompare(bv) * dir;
			}
			const av = Number(a.status ?? CraftVillageRequestStatus.Pending);
			const bv = Number(b.status ?? CraftVillageRequestStatus.Pending);
			return (av - bv) * dir;
		});

		return filtered;
	}, [dataTable, statusFilter, sortBy, sortDir]);

	const totalItems = filteredAndSortedData.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const pagedItems = useMemo(() => {
		const start = (page - 1) * pageSize;
		return filteredAndSortedData.slice(start, start + pageSize);
	}, [filteredAndSortedData, page, pageSize]);

	const toggleSort = (field: "name" | "ownerFullName" | "status") => {
		if (sortBy === field) {
			setSortDir((d) => (d === "asc" ? "desc" : "asc"));
		} else {
			setSortBy(field);
			setSortDir("asc");
		}
		setPage(1);
	};

	useEffect(() => {
		fetchData()
	}, [search, statusFilter])

	return (
		<div className="space-y-3">
			{/* Toolbar */}
			<div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
					<Input
						placeholder="Tìm kiếm theo tên làng nghề, người đăng ký, email, địa chỉ..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						disabled={loading}
						className="pl-9"
					/>
				</div>
				<Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
					<SelectTrigger className="sm:w-56">
						<SelectValue placeholder="Lọc theo trạng thái" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Tất cả trạng thái</SelectItem>
						<SelectItem value="pending">Chờ duyệt</SelectItem>
						<SelectItem value="approved">Đã duyệt</SelectItem>
						<SelectItem value="rejected">Từ chối</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="rounded-md border">
				<div className="overflow-x-auto">
					<Table className="min-w-[900px]">
						<TableHeader className="sticky top-0 z-10 bg-white">
							<TableRow>
								<TableHead className="w-[320px]">
									<button
										className="inline-flex items-center gap-1 font-medium"
										onClick={() => toggleSort("name")}
										title="Sắp xếp theo tên làng nghề"
									>
										<span>Làng nghề</span>
										{sortBy !== "name" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead className="w-[200px]">
									<button
										className="inline-flex items-center gap-1 font-medium"
										onClick={() => toggleSort("ownerFullName")}
										title="Sắp xếp theo tên người đăng ký"
									>
										<span>Người đăng ký</span>
										{sortBy !== "ownerFullName" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead>Địa chỉ</TableHead>
								<TableHead className="w-[160px]">
									<button
										className="inline-flex items-center gap-1 font-medium"
										onClick={() => toggleSort("status")}
										title="Sắp xếp theo trạng thái"
									>
										<span>Trạng thái</span>
										{sortBy !== "status" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead className="w-[140px]">
									<button
										className="inline-flex items-center gap-1 font-medium"
										onClick={() => toggleSort("createTime")}
										title="Sắp xếp theo thời gian tạo"
									>
										<span>Ngày tạo</span>
										{sortBy !== "createTime" ? (
											<ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
										) : sortDir === "asc" ? (
											<ArrowUp className="w-3.5 h-3.5 text-gray-600" />
										) : (
											<ArrowDown className="w-3.5 h-3.5 text-gray-600" />
										)}
									</button>
								</TableHead>
								<TableHead className="w-[140px]">Ngày duyệt</TableHead>
								<TableHead className="w-[120px] text-right">Hành động</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{!isHydrated && (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center text-sm text-gray-600">
										Đang tải...
									</TableCell>
								</TableRow>
							)}

							{isHydrated && loading && dataTable.length === 0 &&
								Array.from({ length: 6 }).map((_, i) => (
									<TableRow key={`sk-${i}`} className="hover:bg-transparent">
										<TableCell>
											<div className="flex items-center gap-3">
												<div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
												<div className="space-y-2">
													<div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
													<div className="h-3 w-28 bg-gray-200 rounded animate-pulse" />
												</div>
											</div>
										</TableCell>
										<TableCell>
											<div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
										</TableCell>
										<TableCell>
											<div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
										</TableCell>
										<TableCell>
											<div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
										</TableCell>
										<TableCell>
											<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
										</TableCell>
										<TableCell>
											<div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
											</div>
										</TableCell>
									</TableRow>
								))}

							{isHydrated && !loading && pagedItems.map((it) => (
								<TableRow key={it.id} className="hover:bg-muted/40">
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarFallback>{initials(it.name)}</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-semibold text-gray-900">{it.name}</div>
												<div className="text-xs text-gray-500">{it.ownerEmail}</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="font-medium text-gray-900">{it.ownerFullName}</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1 text-sm text-gray-700">
											<MapPin className="w-3.5 h-3.5 text-gray-500" />
											<span className="max-w-[200px] truncate">{it.address || "—"}</span>
										</div>
									</TableCell>
									<TableCell>{statusBadge(it.status as CraftVillageRequestStatus)}</TableCell>
									<TableCell>
										<div className="text-sm text-gray-700">
											{it.reviewedAt ? dayjs(it.reviewedAt).format("DD/MM/YYYY") : "—"}
										</div>
									</TableCell>
									<TableCell>
										<div className="text-sm text-gray-700">
											{it.reviewedAt ? dayjs(it.reviewedAt).format("DD/MM/YYYY") : "—"}
										</div>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex items-center justify-end gap-2">
											<Button size="sm" variant="secondary" onClick={() => handleView(it.id)}>
												<Eye className="w-4 h-4 mr-1" /> Xem chi tiết
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))}

							{isHydrated && !loading && pagedItems.length === 0 && (
								<TableRow>
									<TableCell colSpan={7} className="h-24 text-center text-sm text-gray-600">
										Không có yêu cầu nào — thử đổi bộ lọc hoặc từ khóa.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3">
					<div className="text-sm text-gray-600">
						Hiển thị {Math.min((page - 1) * pageSize + 1, totalItems)}-{Math.min(page * pageSize, totalItems)} trong {totalItems}
					</div>
					<div className="flex items-center gap-2">
						<Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}>
							<SelectTrigger className="w-28"><SelectValue placeholder="Số dòng" /></SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10 / trang</SelectItem>
								<SelectItem value="20">20 / trang</SelectItem>
								<SelectItem value="50">50 / trang</SelectItem>
							</SelectContent>
						</Select>
						<div className="flex items-center gap-2">
							<Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>Trước</Button>
							<Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>Sau</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CraftVillageRequest;
