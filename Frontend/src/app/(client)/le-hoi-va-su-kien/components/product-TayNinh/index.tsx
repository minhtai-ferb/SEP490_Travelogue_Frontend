"use client"

import { useState, useEffect, useCallback } from "react"
import "swiper/css"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import FeaturedCard from "@/components/common/featured-card"
import { PulsatingButton } from "@/components/ui/PulsatingButton"
import api from "@/config/axiosInstance"
import { useRouter } from "next/navigation"

interface Event {
  id: string
  name: string
  description: string
  content: string
  startDate: string
  medias: { mediaUrl: string }[]
}

interface MonthData {
  label: string
  month: number
  year: number
}

export const HandmadeProductTayNinh = () => {
  const router = useRouter()
  // Get the current month and year (using the provided date)
  const currentDate = new Date("2025-04-06")
  const baseMonth = currentDate.getMonth() // 3 (April, 0-based)
  const baseYear = currentDate.getFullYear() // 2025

  // Calculate the month and year based on an absolute index
  const getMonthYearFromIndex = useCallback(
    (index: number) => {
      // Ensure index is always positive for modulo operation
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

  // Initialize with the first month's data
  const initialMonthData = getMonthYearFromIndex(0)

  const [swiperInstance, setSwiperInstance] = useState<any>(null)
  const [news, setNews] = useState<Event[]>([])
  const [loading, setLoading] = useState(false)
  const [activeMonthIndex, setActiveMonthIndex] = useState(0)
  const [currentMonthData, setCurrentMonthData] = useState<MonthData>(initialMonthData)
  const [allEvents, setAllEvents] = useState<Record<string, Event[]>>({})

  // Generate the initial 4 months for display
  const months = Array.from({ length: 4 }, (_, i) => getMonthYearFromIndex(i))

  // Fetch events for all months at once
  const fetchAllEvents = async () => {
    setLoading(true)
    try {
      // Create an array of promises for all 4 months
      const promises = months.map(({ month, year }) => api.get(`/event/filter-paged?month=${month}&year=${year}`))

      // Execute all promises in parallel
      const responses = await Promise.all(promises)

      // Process the results and store by month/year key
      const eventsMap: Record<string, Event[]> = {}

      responses.forEach((response, index) => {
        const { month, year } = months[index]
        const key = `${month}-${year}`
        const result = response?.data?.data

        if (result && result.length > 0) {
          eventsMap[key] = result.map((event: any) => ({
            image: { src: event.medias[0]?.mediaUrl || "" },
            title: event.name,
            content: event.description,
            date: event.startDate,
            ...event,
          }))
        } else {
          eventsMap[key] = []
        }
      })

      setAllEvents(eventsMap)

      // Set initial month's events
      const initialKey = `${initialMonthData.month}-${initialMonthData.year}`
      setNews(eventsMap[initialKey] || [])
    } catch (error) {
      console.error("Error fetching events:", error)
      setAllEvents({})
      setNews([])
    } finally {
      setLoading(false)
    }
  }

  // Update the current month data and set events from cache
  const updateCurrentMonth = useCallback(
    (index: number) => {
      const data = getMonthYearFromIndex(index)
      setCurrentMonthData(data)

      // Use cached events instead of fetching
      const key = `${data.month}-${data.year}`
      setNews(allEvents[key] || [])
    },
    [getMonthYearFromIndex, allEvents],
  )

  // Initial fetch for all months
  useEffect(() => {
    fetchAllEvents()
  }, [])

  // Handle month button click
  const handleMonthClick = (index: number) => {
    setActiveMonthIndex(index)
    updateCurrentMonth(index)

    if (swiperInstance) {
      swiperInstance.slideToLoop(index)
    }
  }

  const handleButtonClick = () => {
    return router.push("/le-hoi-va-su-kien")
  }

  // Create a simple counter for continuous cycling
  useEffect(() => {
    if (!swiperInstance) return

    // Force the swiper to advance every 5 seconds
    const interval = setInterval(() => {
      // Get the next index (0-3)
      const nextIndex = (activeMonthIndex + 1) % 4

      // Update the active month index
      setActiveMonthIndex(nextIndex)

      // Update the current month data
      updateCurrentMonth(nextIndex)

      // Move the swiper to the next slide
      swiperInstance.slideToLoop(nextIndex)
    }, 5000)

    return () => clearInterval(interval)
  }, [swiperInstance, activeMonthIndex, updateCurrentMonth])

  return (
    <div className="flex flex-col h-fit w-full px-4 sm:px-6 md:w-5/6 mx-auto">
      {/* Section Title */}
      <section className="flex flex-col gap-4 text-center mt-6">
        <h1 className="text-3xl md:text-6xl font-bold text-blue-500">Có gì hấp dẫn?</h1>
        <h3 className="text-xl md:text-xl font-normal py-6">
          Khám phá ngay các sự kiện & lễ hội sắp tới ở tại Tây Ninh
        </h3>
      </section>

      <div className="relative h-full w-full flex flex-col gap-20">
        <div className="relative flex flex-col items-center w-full mx-auto">
          {/* Pagination Buttons (Months) */}
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

          {/* Pagination Line */}
          <div className="absolute md:top-11 top-8 left-0 right-0 w-full h-0.5 bg-gray-400 z-10"></div>

          {/* Year Background Section */}
          <div className="absolute w-full bg-[#dadcdd] text-center py-2 items-center text-xl font-semibold md:top-12 top-9">
            <p className="self-center text-blue-500 text-4xl font-bold">{currentMonthData.year}</p>
          </div>
        </div>

        {/* Swiper Component */}
        <div className="relative w-full">
          {loading ? (
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
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet-custom",
                bulletActiveClass: "swiper-pagination-bullet-active-custom",
              }}
              onSwiper={(swiper) => setSwiperInstance(swiper)}
              // Disable the built-in autoplay and slide change handler
              // We'll handle cycling manually
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 1 },
              }}
            >
              {months.map((_, slideIndex) => (
                <SwiperSlide key={slideIndex} className="w-full h-screen">
                  <div className="flex flex-col justify-center gap-4 md:flex-row">
                    {/* Large Card on the Left (Featured) */}
                    <div className="w-full md:w-1/2 h-[60vh]">
                      {news.length > 0 ? (
                        <FeaturedCard item={news[0]} isFeatured={true} />
                      ) : (
                        <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                          <p className="text-gray-500">
                            Không có sự kiện trong {currentMonthData.label}/{currentMonthData.year}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Four Smaller Cards */}
                    <div className="w-full md:w-1/2 grid grid-cols-2 gap-2">
                      {news.length > 1
                        ? news
                          .slice(1, 5)
                          .map((smallItem, index) => <FeaturedCard isFeatured={false} item={smallItem} key={index} />)
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
              ))}
            </Swiper>
          )}

          {/* Button */}
          <div className="flex justify-center py-4" onClick={handleButtonClick}>
            <PulsatingButton>Xem Tất Cả</PulsatingButton>
          </div>
        </div>
      </div>
    </div>
  )
}

