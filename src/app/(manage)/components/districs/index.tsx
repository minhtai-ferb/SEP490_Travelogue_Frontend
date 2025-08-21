import { District } from "@/types/District";
import { InfoSection } from "./components/InfoSection";
import { DistrictGrid } from "./components/DistrictGrid";

interface MainContentProps {
  districts: District[];
  href: string
}

export const MainContent = ({ districts, href }: MainContentProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full space-y-10">
      <DistrictGrid districts={districts} href={href} />

      <div className="border-b border-gray-300 my-6 w-5/6"></div>
      
      <InfoSection />
    </div>
  );
};
