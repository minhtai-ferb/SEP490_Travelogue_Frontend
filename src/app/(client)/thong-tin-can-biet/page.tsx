"use client";
import UnifiedHeader from "@/components/common/common-header";
import DestinationGrid from "@/components/common/destination-grid";
import { headerConfigs } from "@/config/header";
import { Image } from "antd";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

const infoTayNinh = [
  {
    key: "1",
    label: "Thị thực",
    children: (
      <p className="text-lg leading-relaxed">
        Du khách nước ngoài cần kiểm tra yêu cầu thị thực trước khi đến Việt
        Nam. Một số quốc gia được miễn thị thực trong 15–30 ngày. Có thể xin
        e-visa trực tuyến qua Cổng thông tin chính phủ.
      </p>
    ),
  },
  {
    key: "2",
    label: "Di chuyển",
    children: (
      <p className="text-lg leading-relaxed">
        Tây Ninh cách TP.HCM khoảng 100km, có thể di chuyển bằng xe khách, taxi
        hoặc xe máy. Ngoài ra, các ứng dụng đặt xe công nghệ như Grab, Be cũng
        khá phổ biến.
      </p>
    ),
  },
  {
    key: "3",
    label: "Hoàn thuế",
    children: (
      <p className="text-lg leading-relaxed">
        Du khách nước ngoài có thể được hoàn thuế VAT khi mua hàng tại các cửa
        hàng có đăng ký hoàn thuế. Thủ tục hoàn thuế được thực hiện tại sân bay
        quốc tế trước khi rời Việt Nam.
      </p>
    ),
  },
  {
    key: "4",
    label: "Đặc sản",
    children: (
      <p className="text-lg leading-relaxed">
        Một số đặc sản nổi bật của Tây Ninh bao gồm bánh tráng phơi sương, muối
        tôm, nem bưởi, và các món ăn từ bò tơ. Đây là điểm hấp dẫn ẩm thực cho
        du khách gần xa.
      </p>
    ),
  },
  {
    key: "5",
    label: "Thẻ Sim & Số điện thoại cần biết",
    children: (
      <p className="text-lg leading-relaxed">
        Bạn có thể mua SIM du lịch tại sân bay hoặc cửa hàng tiện lợi với giá
        rẻ. Một số nhà mạng phổ biến: Viettel, Mobifone, Vinaphone. Gọi khẩn
        cấp: 113 (công an), 114 (cứu hỏa), 115 (cấp cứu).
      </p>
    ),
  },
  {
    key: "6",
    label: "Ổ cắm điện",
    children: (
      <p className="text-lg leading-relaxed">
        Việt Nam sử dụng điện 220V – 50Hz. Loại ổ cắm phổ biến là A, C và D. Du
        khách nên mang theo bộ chuyển đổi ổ cắm quốc tế để sử dụng các thiết bị
        điện cá nhân.
      </p>
    ),
  },
  {
    key: "7",
    label: "Internet & Bưu chính",
    children: (
      <p className="text-lg leading-relaxed">
        Wi-Fi miễn phí phổ biến ở khách sạn, nhà hàng và quán cà phê. Các dịch
        vụ bưu chính như gửi thư, bưu phẩm được cung cấp tại các bưu cục hoặc
        qua dịch vụ chuyển phát nhanh như VNPost, ViettelPost.
      </p>
    ),
  },
  {
    key: "8",
    label: "Tiền tệ",
    children: (
      <p className="text-lg leading-relaxed">
        Đơn vị tiền tệ là Đồng Việt Nam (VND). Du khách nên đổi tiền tại ngân
        hàng hoặc quầy đổi ngoại tệ hợp pháp. Thẻ Visa/Master được chấp nhận ở
        nhiều nơi, nhưng tiền mặt vẫn phổ biến hơn.
      </p>
    ),
  },
  {
    key: "9",
    label: "Khí hậu và Thời tiết",
    children: (
      <p className="text-lg leading-relaxed">
        Tây Ninh có khí hậu nhiệt đới gió mùa với 2 mùa: mùa mưa (tháng 5 – 11)
        và mùa khô (tháng 12 – 4). Nhiệt độ trung bình khoảng 27°C, nắng nhiều,
        thuận lợi cho du lịch quanh năm.
      </p>
    ),
  },
];

const VideoComponent = dynamic(() => import("./components/video"), {
  ssr: false,
});

function EventPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // const [isModalOpen, setIsModalOpen] = useState(false);

  // const videoRef = useRef<HTMLVideoElement>(null);

  // const handleFullscreen = () => {
  //   const video = videoRef.current;
  //   if (!video) return;
  //   if (video.requestFullscreen) {
  //     video.requestFullscreen();
  //   } else if ((video as any).webkitRequestFullscreen) {
  //     (video as any).webkitRequestFullscreen();
  //   }
  // };

  return (
    <div>
      <header
        className="relative h-screen w-full bg-cover bg-center flex flex-col bg-transparent inset-0 bg-black bg-opacity-40"
        style={{ backgroundImage: "url('/thanh_pho_tay_ninh.jpg')" }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent"
        ></div>
        {/* Unified nav/header */}
        <UnifiedHeader
          config={headerConfigs?.knowledge}
        />

        {/* Centered Main content */}
        <div className="z-20 transition-all duration-100 flex-grow flex flex-col items-center justify-center px-4 text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight drop-shadow-xl mb-4">
            Tin tức mới nhất của chúng tôi
          </h1>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl mb-2 drop-shadow-md">
            Nguồn tin tức và cập nhật mới nhất từ tỉnh của chúng tôi.
          </p>
          <p className="max-w-2xl text-base sm:text-lg md:text-xl mb-6 drop-shadow-md">
            Nơi kết nối cộng đồng với những thông tin đáng tin cậy và kịp thời.
          </p>
          <div className="h-1 w-20 bg-blue-400 rounded-full"></div>
        </div>

      </header>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        <h2 className="text-center text-7xl font-bold mb-10 text-blue-500">
          Về tỉnh Tây Ninh
        </h2>

        {/* Khung chính */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center h-1/2 w-full">
            <VideoComponent />

            {/* Nội dung giới thiệu */}
            <div className="md:col-span-1 pl-4">
              <h1 className="text-3xl font-semibold leading-relaxed mb-5">
                CHÀO MỪNG ĐẾN VỚI TỈNH TÂY NINH
              </h1>
              <p className="text-xl leading-relaxed">
                Tây Ninh là một tỉnh biên giới thuộc miền Đông Nam Bộ. Nằm trong
                vùng kinh tế trọng điểm phía Nam, Tây Ninh có diện tích tự nhiên
                hơn 4.000km², dân số hơn 1,1 triệu người. Toàn tỉnh chia thành 9
                đơn vị hành chính gồm: một thành phố, 2 thị xã và 6 huyện. Hiện
                nay trên địa bàn tỉnh có bốn dân tộc chính sinh sống đó là dân
                tộc Kinh, Khmer, Hoa và Chăm. Là vùng đất thiêng, nơi đây tập
                trung hầu hết các tôn giáo hiến có của Việt Nam, trong đó có 05
                tôn giáo chính: Phật giáo, Cao Đài, Công giáo, Tin Lành, Hồi
                giáo.
              </p>
            </div>
          </div>
        </div>

        {/* Phần hình ảnh nhỏ dưới */}
        <div className="p-6 text-xl leading-relaxed mb-6">
          Tây Ninh có khí hậu ôn hòa, chia thành 2 mùa rõ rệt, mùa mưa và mùa
          khô. Mặt khác, tỉnh nằm sâu trong lục địa, địa hình cao núp sau dãy
          Trường Sơn, ít chịu ảnh hưởng của bão là những lợi thế để tỉnh phát
          triển kinh tế du lịch. Ngoài ra, Tây Ninh có đường Hồ Chí Minh đi qua;
          nằm trên tuyến đường Xuyên Á – tuyến giao thông huyết mạch đóng vai
          trò kết nối vận chuyển hàng hóa từ Thành phố Hồ Chí Minh, các tỉnh
          miền Đông, Tây Nam Bộ, Tây Nguyên.
        </div>

        {/* Hình ảnh đặc trưng */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Image
            src="/thong_tin_can_biet_1.jpg"
            alt="Ảnh 1"
            width={400}
            height={250}
            className="rounded-lg object-cover"
          />
          <Image
            src="/thong_tin_can_biet_2.jpg"
            alt="Ảnh 2"
            width={400}
            height={250}
            className="rounded-lg object-cover"
          />
          <Image
            src="/thong_tin_can_biet_3.jpg"
            alt="Ảnh 3"
            width={400}
            height={250}
            className="rounded-lg object-cover"
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto mt-20 px-4 flex flex-col justify-center items-center">
        <h1 className="text-5xl mx-auto mb-20 font-bold text-blue-500">
          Câu hỏi thường gặp
        </h1>
        <div className="divide-y divide-gray-300 w-full">
          {infoTayNinh.map((item, index) => (
            <div key={item.key ?? index}>
              <button
                onClick={() => toggle(index)}
                className="w-full flex justify-between items-center py-4 text-left font-medium text-gray-800 hover:text-blue-600"
              >
                <span className="text-2xl  leading">{item.label}</span>
                <span
                  className={`transition-transform duration-200 ${openIndex === index ? "rotate-180" : ""
                    }`}
                >
                  ▼
                </span>
              </button>
              {openIndex === index && (
                <div className="pb-4 text-gray-600">{item.children}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DestinationGrid />
    </div>
  );
}

export default EventPage;
