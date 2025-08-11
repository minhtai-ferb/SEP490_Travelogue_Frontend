'use client'

import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Clock, Share2, Bookmark, ChevronLeft } from "lucide-react";
import { use, useEffect, useState } from "react";
import { NewsItem } from "@/interfaces/news";
import RelatedNews from "@/components/common/related-category";
import { useNews } from "@/services/use-news";

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const [detail, setDetail] = useState<NewsItem>()

  const { id } = use(params);
  const { getNewsById } = useNews()

  const fetchDetailNews = async (id: string) => {
    try {
      const response = await getNewsById(id);
      setDetail(response)

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (id) {
      fetchDetailNews(id);
    }
  }, [id])

  // Get current date for the "Today's Information" section
  // const currentDate = format(new Date(), "MMMM d, yyyy")
  const currentDate = format(new Date(), "d MMMM, yyyy", { locale: vi });

  return (
    <main className="min-h-screen bg-background">
      {/* Header with current date */}
      <div className="bg-black text-white py-2 px-4 text-sm text-center">
        <p>Ngày hôm nay: {currentDate}</p>
      </div>

      {/* Article content */}
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/tin-tuc" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Về trang tin tức
            </Link>
          </Button>
        </div>

        {/* Category */}
        <div className="mb-4">
          <Link
            href={`/tin-tuc/phan-loai/${detail?.categoryName?.toLowerCase()}`}
            className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold"
          >
            {detail?.categoryName || 'Phân loại'}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {detail?.title}
        </h1>

        {/* Meta information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-8">
          <p>Người viết: {detail?.createdByName || "Ẩn danh"}</p>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{format(detail?.createdTime || new Date(), "d MMMM, yyyy", { locale: vi })}</span>
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="ghost" size="icon">
              <Share2 className="h-5 w-5" />
              <span className="sr-only">Chia sẻ</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
              <span className="sr-only">Lưu</span>
            </Button>
          </div>
        </div>

        {/* Featured image */}
        <div className="mb-8">
          <Image
            src={detail?.medias[0]?.mediaUrl || "/placeholder_image.jpg"}
            alt={detail?.title || "Placeholder"}
            width={1200}
            height={800}
            className="w-full object-cover rounded-lg aspect-video"
          />
          <p className="text-sm text-gray-500 mt-2">
            Nguồn: {detail?.createdByName || "Ẩn danh"}
          </p>
        </div>

        {/* Article content */}
        <div
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: detail?.content || "" }}
        />

        <RelatedNews relatedNews={detail?.relatedNews || []} />
      </article>
    </main>
  );
}
