import Image from "next/image";

export const InfoSection = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto rounded-lg w-full">
      <h2 className="text-2xl font-bold text-black mb-1">
        Tạo quận huyện mới
      </h2>
      <p className="text-gray-600 mb-6 text-sm">
        Nơi để bạn quản lý thông tin của quận huyện một cách dễ dàng và
        nhanh chóng.
      </p>

      <div className="bg-white flex flex-col justify-start p-6 rounded-lg shadow-lg mb-6">
        <div className="flex items-center mb-4 w-8/12">
          <div className="rounded-full w-1/4 h-20 flex justify-center items-center">
            <Image
              src="/mascot.png"
              alt="Icon"
              width={120}
              height={120}
            />
          </div>
          <div className="ml-4 w-3/4">
            <p className="text-sm text-black font-medium mb-2">
              Bạn chưa từng tạo quận huyện mới
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Tạo quận huyện mới để bắt đầu quản lý thông tin của quận
              huyện.
            </p>
            <button className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600">
              Cách Tạo Quận Huyện
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
