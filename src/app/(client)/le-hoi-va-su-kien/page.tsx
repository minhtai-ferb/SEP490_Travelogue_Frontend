'use client'
import 'swiper/css';
import 'swiper/css/pagination';
import { ExploreEvent } from "./components";
import DiscoverMore from "./components/discover-more";
import Header from './components/header-event';
import { HandmadeProductTayNinh } from './components/product-TayNinh';


function EventPage() {


	return (
		<div>
			<Header />

			<HandmadeProductTayNinh />

			<div className="w-4/5 mx-auto my-10">
				<ExploreEvent />
			</div>
			<div>
				<DiscoverMore />
			</div>
		</div>
	);
}

export default EventPage;
