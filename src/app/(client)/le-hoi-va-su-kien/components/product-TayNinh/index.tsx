"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import "swiper/css"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import type { Swiper as SwiperType } from "swiper"
import FeaturedCard from "@/components/common/featured-card"
import { PulsatingButton } from "@/components/ui/PulsatingButton"
import { useRouter } from "next/navigation"
import { useNews } from "@/services/use-news"
import { ListMedia } from "@/types/News"

interface EventItem {
  id: string
  title: string
  startDate: string
  medias: ListMedia[]
}

type DisplayEvent = EventItem & {
  image: { src: string }
  date: string
}

interface MonthData {
  label: string
  month: number
  year: number
}

export const HandmadeProductTayNinh = () => {
  const router = useRouter()
  const currentDate = new Date()
  const baseMonth = currentDate.getMonth()
  const baseYear = currentDate.getFullYear()
  const { getPagedEvents } = useNews()

  const getMonthYearFromIndex = useCallback(
    (index: number) => {
      const adjustedIndex = index >= 0 ? index : 0

      const monthIndex = (baseMonth + adjustedIndex) % 12
      const yearOffset = Math.floor((baseMonth + adjustedIndex) / 12)
      return {
        month: monthIndex + 1,
        year: baseYear + yearOffset,
        label: `Tháng ${monthIndex + 1}`,
      }
    },
    [baseMonth, baseYear],
  )

  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeMonthIndex, setActiveMonthIndex] = useState(0)
  const [eventsByKey, setEventsByKey] = useState<Record<string, DisplayEvent[]>>({})

  const months = useMemo<MonthData[]>(() => Array.from({ length: 4 }, (_, i) => getMonthYearFromIndex(i)), [getMonthYearFromIndex])
  const makeKey = useCallback((month: number, year: number) => `${month}-${year}`, [])

  const fetchAllEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const promises = months.map(({ month, year }) =>
        getPagedEvents({ month, year, pageNumber: 1, pageSize: 5, isHighlighted: true }),
      )
      const responses = await Promise.all(promises)

      const eventsMap: Record<string, DisplayEvent[]> = {}
      responses.forEach((response, index) => {
        const { month, year } = months[index]
        const key = makeKey(month, year)
        const result: EventItem[] = response?.data || []
        eventsMap[key] = Array.isArray(result)
          ? result.map((event: EventItem) => ({
            image: { src: event.medias?.[0]?.mediaUrl || "" },
            date: event.startDate,
            ...event,
          }))
          : []
      })

      setEventsByKey(eventsMap)
    } catch (error) {
      console.error("Error fetching events:", error)
      setEventsByKey({})
    } finally {
      setIsLoading(false)
    }
  }, [getPagedEvents, makeKey, months])

  useEffect(() => {
    fetchAllEvents()
  }, [fetchAllEvents])

  const handleMonthClick = (index: number) => {
    setActiveMonthIndex(index)
    swiperInstance?.slideToLoop(index)
  }

  const handleButtonClick = () => {
    return router.push("/le-hoi-va-su-kien")
  }

  const currentMonthData = getMonthYearFromIndex(activeMonthIndex)

  return (
    <div className="flex flex-col h-fit w-full px-4 sm:px-6 md:w-5/6 mx-auto">
      <section className="flex flex-col gap-4 text-center mt-6">
        <h1 className="text-3xl md:text-6xl font-bold text-blue-500">Có gì hấp dẫn?</h1>
        <h3 className="text-xl md:text-xl font-normal py-6">
          Khám phá ngay các sự kiện & lễ hội sắp tới ở tại Tây Ninh
        </h3>
      </section>

      <div className="relative h-full w-full flex flex-col gap-20">
        <div className="relative flex flex-col items-center w-full mx-auto">
          <div className="pagination-container flex justify-around items-center w-full relative z-20">
            {months.map(({ label }, index) => (
              <div key={index} className="flex flex-col items-center">
                <span className="text-md md:text-lg font-semibold">{label}</span>
                <button
                  className={`relative w-6 h-6 md:w-8 md:h-8 rounded-full z-20 border-2 border-gray-300 transition-colors ${activeMonthIndex === index ? "bg-blue-500" : "bg-white"
                    }`}
                  onClick={() => handleMonthClick(index)}
                />
              </div>
            ))}
          </div>

          <div className="absolute md:top-11 top-8 left-0 right-0 w-full h-0.5 bg-gray-400 z-10"></div>

          <div className="absolute w-full bg-[#dadcdd] text-center py-2 items-center text-xl font-semibold md:top-12 top-9">
            <p className="self-center text-blue-500 text-4xl font-bold">{currentMonthData.year}</p>
          </div>
        </div>

        <div className="relative w-full">
          {isLoading ? (
            <div className="text-center py-10 h-[60vh] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              className="mySwiper"
              spaceBetween={16}
              slidesPerView={1}
              loop={true}
              observer={true}
              observeParents={true}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet-custom",
                bulletActiveClass: "swiper-pagination-bullet-active-custom",
              }}
              onSwiper={(swiper) => setSwiperInstance(swiper)}
              onSlideChange={(swiper) => setActiveMonthIndex(swiper.realIndex)}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
              }}
            >
              {months.map((monthData, slideIndex) => {
                const key = makeKey(monthData.month, monthData.year)
                const events = eventsByKey[key] || []
                return (
                  <SwiperSlide key={slideIndex} className="w-full h-screen">
                    <div className="flex flex-col justify-center gap-4 md:flex-row">
                      <div className="w-full md:w-1/2 h-[60vh]">
                        {events.length > 0 ? (
                          <FeaturedCard item={events[0]} isFeatured={true} />
                        ) : (
                          <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                            <p className="text-gray-500">
                              Không có sự kiện trong {monthData.label}/{monthData.year}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-1/2 grid grid-cols-2 gap-2">
                        {events.length > 0
                          ? events
                            .slice(0, 4)
                            .map((smallItem, index) => (
                              <FeaturedCard isFeatured={false} item={smallItem} key={index} />
                            ))
                          : Array.from({ length: 4 }).map((_, index) => (
                            <div
                              key={index}
                              className="h-[30vh] flex items-center justify-center bg-gray-100 rounded-lg"
                            >
                              <p className="text-gray-500 text-sm">Không có sự kiện</p>
                            </div>
                          ))}
                      </div>
                    </div>
                  </SwiperSlide>
                )
              })}
            </Swiper>
          )}

          <div className="flex justify-center py-4" onClick={handleButtonClick}>
            <PulsatingButton>Xem Tất Cả</PulsatingButton>
          </div>
        </div>
      </div>
    </div>
  )
}

