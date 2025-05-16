import { Card, CardFooter, Image as ImageHero } from "@heroui/react";
import { Calendar } from "lucide-react";
import defaultImage from "../../../../public/image_intro.png";
import eventevent from "../../../../public/image/event_1.png";

import { format } from "date-fns";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


// Define a proper interface for the item prop

interface FeaturedCardProps {
	item: any;
	isFeatured: boolean;
}

function FeaturedCard({ item, isFeatured }: FeaturedCardProps) {

	const navigate = useRouter()

	useEffect(() => {
		console.log(item)
	}, [item, isFeatured])


	const backgroundImageUrl =
		item?.medias?.[0]?.mediaUrl || defaultImage;

	return (
		<Card
			className="w-full h-full bg-white rounded-xl shadow-md overflow-hidden"
			radius="lg"
			style={{
				backgroundImage: `url(${backgroundImageUrl})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
			}}
			key={item.id}
		>
			<Link href={`/le-hoi-va-su-kien/${item.id}`} >
				<CardFooter
					className="flex flex-col justify-between items-start text-start absolute z-10 bottom-0 left-0 right-0 rounded-lg p-3 cursor-pointer"
					style={{
						background: isFeatured
							? "rgba(75, 85, 99, 0.3)" // Slightly more opaque for featured
							: "rgba(75, 85, 99, 0.7)", // Darker for non-featured
						backdropFilter: "blur(0.2px) saturate(150%)", // Consistent background blur
						WebkitBackdropFilter: "blur(0.1px) saturate(150%)",
						transition: "background 0.2s ease",
					}}
					onMouseEnter={(e) =>
					(e.currentTarget.style.background = isFeatured
						? "rgba(75, 85, 99, 1)"
						: "rgba(75, 85, 99, 0.9)")
					}
					onMouseLeave={(e) =>
					(e.currentTarget.style.background = isFeatured
						? "rgba(75, 85, 99, 0.3)"
						: "rgba(75, 85, 99, 0.7)")
					}
				>
					{isFeatured && (
						<div className="flex gap-3 items-center text-sm font-medium text-white text-wrap w-full">
							<Calendar className="w-5 h-5" />
							<div>
								<p>{format(new Date(item.date), "dd/MM/yyyy")}</p>
							</div>
						</div>
					)}
					<div>
						<p className={`${isFeatured ? "text-2xl" : "text-sm"} font-medium text-white text-wrap w-full`}>
							{item.title}
						</p>
					</div>
				</CardFooter>
			</Link>
		</Card>
	);
}

export default FeaturedCard;