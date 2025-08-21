import Image from "next/image";
import Link from "next/link";

export const CreateDistrictCard = ({ href }: { href: string }) => {
  return (
    <Link href={`${href}/create`} className="w-60 h-50">
      <div
        className="bg-blue-500 text-white flex flex-col items-center justify-center w-full h-40 rounded-lg shadow-lg hover:bg-blue-600 cursor-pointer"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/icon+.png"
          alt="Add Icon"
          width={40}
          height={40}
          className="object-cover"
        />
        <span className="mt-2 text-base font-semibold">
          Tạo quận huyện mới
        </span>
      </div>
    </Link>
  );
};
