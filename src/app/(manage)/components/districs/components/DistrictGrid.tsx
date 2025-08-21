import { District } from "@/types/District";
import { useRouter } from "next/navigation";
import { CreateDistrictCard } from "./CreateDistrictCard";
import CityCard from "./CityCard";

interface DistrictGridProps {
  districts: District[];
  href: string;
}

export const DistrictGrid = ({ districts, href }: DistrictGridProps) => {
  const router = useRouter();

  return (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center w-fit h-fit">
      <CreateDistrictCard href={href} />

      {/* Map districts data into CityCard components */}
      {districts.map((district) => (
        <div
          key={`district-${district.id}`}
          onClick={() => router.push(`${href}/${district.id}`)}
          className="cursor-pointer"
        >
          <CityCard
            cityImage={
              district.medias && district.medias.length > 0
                ? district?.medias[0]?.mediaUrl
                : "/thanh_pho_tay_ninh.jpg"
            }
            cityName={district.name}
          />
        </div>
      ))}
    </div>
  );
};
