"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsItem } from "@/interfaces/news";
import { useNews } from "@/services/use-news";
import { NewsCategory } from "@/types/News";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  ArrowUpRight,
  ChevronRight,
  Clock,
  Filter,
  Home,
  Search,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function CategoryPage({ params }: { params: Promise<{ slug: string }>; }) {

  const { slug } = use(params);

  const pathname = usePathname();
  const [category, setCategory] = useState<any>()
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 9;

  const { getByCategory } = useNews();

  const getTypeByName = (name: string) => {
    switch (name) {
      case "News":
        return NewsCategory.News
      case "Event":
        return NewsCategory.Event
      case "Experience":
        return NewsCategory.Experience
    }
  }

  // Get category ID from slug (this would be replaced with your actual mapping)
  const fetchNews = async (page: number, resetResults = false) => {
    setIsLoading(true);
    const categoryNum = getTypeByName(slug)
    try {
      const responseNewsCategory = await getByCategory(categoryNum);
      setCategory(responseNewsCategory?.data);
      const response = await getByCategory(categoryNum);

      if (response) {
        if (resetResults) {
          setNewsItems(response);
        } else {
          setNewsItems((prev) => [...prev, ...response]);
        }

        setTotalItems(response.totalCount || 0);
        setHasMore(page * itemsPerPage < (response.totalCount || 0));
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(1, true);
  }, [slug, searchTerm, sortBy]);

  const loadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNews(nextPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchNews(1, true);
  };

  // Get current date for the header
  const currentDate = format(new Date(), "d MMMM, yyyy", { locale: vi });

  return (
    <main className="min-h-screen bg-background">
      {/* Header with current date */}
      <div className="bg-black text-white py-2 px-4 text-sm text-center">
        <p>Tin tức ngày hôm nay: {currentDate}</p>
      </div>

      {/* Category header */}
      <section className="bg-black text-white py-12 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <Link
              href="/"
              className="flex items-center hover:text-white transition-colors"
            >
              <Home className="h-3.5 w-3.5 mr-1" />
              Trang chủ
            </Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <Link
              href="/tin-tuc"
              className="hover:text-white transition-colors"
            >
              Tin tức
            </Link>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-white">{category?.category}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {category?.category.toUpperCase()}
          </h1>
          <p className="text-lg max-w-2xl">
            Thông tin về {category?.category.toLowerCase()} mới nhất từ nguồn tin cậy
            nhất.
          </p>
          <div className="h-1 w-16 bg-emerald-500 mt-6"></div>
        </div>
      </section>

      {/* Filters and search */}
      <div className="container mx-auto px-4 py-6 border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-gray-500" />
            <span className="mr-3 text-gray-700">Sắp xếp theo:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="title">Tiêu đề (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Tìm kiếm tin tức..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full md:w-[300px]"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
              >
                Tìm
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* News grid */}
      <div className="container mx-auto px-4 py-12">
        {totalItems > 0 && (
          <p className="text-gray-500 mb-6">
            Hiển thị {Math.min(newsItems.length, totalItems)} / {totalItems} kết
            quả
          </p>
        )}

        {isLoading && newsItems.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              Không tìm thấy tin tức
            </h3>
            <p className="text-gray-500 mb-6">
              Không có tin tức nào trong danh mục này hoặc phù hợp với tìm kiếm
              của bạn.
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Xóa tìm kiếm
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsItems.map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Loading more indicator */}
        {isLoading && newsItems.length > 0 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-4 h-4 rounded-full bg-emerald-500 animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        )}

        {/* Load more button */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-12">
            <Button
              onClick={loadMore}
              variant="outline"
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white border-0"
            >
              Tải thêm tin
            </Button>
          </div>
        )}

        {/* No more results */}
        {!isLoading && !hasMore && newsItems.length > 0 && (
          <p className="text-center text-gray-500 mt-8">
            Đã hiển thị tất cả tin tức
          </p>
        )}
      </div>
    </main>
  );
}

interface NewsCardProps {
  item: NewsItem;
}

function NewsCard({ item }: NewsCardProps) {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all group h-full flex flex-col">
      <div className="relative overflow-hidden">
        <Image
          src={
            item.medias[1]?.mediaUrl ||
            `/placeholder_image.jpg?height=400&width=600&text=${encodeURIComponent(
              item.title || "News"
            )}`
          }
          alt={item.title || "News image"}
          width={600}
          height={400}
          className="w-full object-cover aspect-video group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardContent className="p-5 flex-1 flex flex-col">
        {item.categoryName && (
          <div className="mb-2">
            <span className="text-xs font-medium text-emerald-600 uppercase">
              {item.categoryName}
            </span>
          </div>
        )}

        <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {item.title}
        </h3>

        <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
          {item.description || "Đọc thêm về tin tức này..."}
        </p>

        <div className="mt-auto flex items-center justify-between">
          {item.createdTime ? (
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {format(new Date(item.createdTime), "d MMM, yyyy", {
                locale: vi,
              })}
            </div>
          ) : (
            <div></div>
          )}

          <Link href={item.categoryName === "News" ? `/tin-tuc/bai-bao/${item.id}` : `/trai-nghiem/thong-tin/${item?.id}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 flex items-center gap-1 -mr-2"
            >
              Đọc tin
              <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function NewsCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm h-full flex flex-col">
      <Skeleton className="w-full h-48" />
      <CardContent className="p-5 flex-1 flex flex-col">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-3/4 mb-4" />
        <div className="mt-auto flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
