
import { NumberTicker } from '@/components/magicui/number-ticker';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/pagination';
import hinh from '../../../../public/Hình.png';
import nuibaden from '../../../../public/image_intro.png';


export const SectionIntroduce = () => {
	return (
		<section id='section-introduce' className='h-full lg:h-screen flex flex-col md:py-10 py-5 relative'>
			<div className='absolute top-0 left-0 right-0 h-1/3 md:h-full overflow-hidden'>
				<Image
					src={hinh}
					alt='background'
					fill
					className='object-cover md:object-contain lg:object-center'
					priority
				/>
			</div>
			<div className='md:flex lg:flex-row items-center justify-center h-full gap-10 sm:flex-col relative'>
				<div className='flex flex-col gap-4 h-full justify-around md:mt-0 '>
					<section className='flex flex-col md:gap-10 gap-3'>
						<span className='flex flex-col md:gap-2 justify-center'>
							<h1 className='text-4xl font-bold text-blue-500 md:text-start text-center'>Tây Ninh</h1>
							<p className='md:text-2xl text-xl font-bold text-yellow-400 md:text-start text-center'>Điểm sáng của du lịch cả nước trong năm 2024</p>
						</span>

						<span className='flex flex-col gap-2 md:px-0 px-3'>

							<h3 className='flex md:justify-start justify-center items-center md:text-4xl text-xl font-bold gap-1 text-blue-600 align-middle md:gap-2'>
								<NumberTicker
									value={5600000}
									className="whitespace-pre-wrap md:justify-start justify-center md:text-5xl text-2xl font-medium tracking-tighter text-blue-500"
								/>
								<p className=''> +</p>
							</h3>

							<p className='text-center md:text-left'>Lượt du khách tham quan khu, điểm du lịch trong tỉnh</p>
						</span>
						<span className='flex flex-col gap-2 md:px-0 px-3'>
							<NumberTicker
								value={26}
								className="whitespace-pre-wrap md:justify-start justify-center md:mx-0 mx-auto md:text-5xl text-2xl font-medium tracking-tighter text-blue-500"
							/>
							<p className='text-center md:text-left'>Chương trình du lịch mới gắn với chương trình phát triển du lịch nông thôn</p>
						</span>
						<span className='flex flex-col md:mx-0 mx-auto gap-2 md:px-0 px-3'>
							<h3 className='text-4xl font-bold text-blue-500'>
								<NumberTicker
									value={2500}
									className="whitespace-pre-wrap md:text-5xl text-2xl font-medium tracking-tighter text-blue-500"
								/><span className='text-2xl font-medium'> tỷ đồng</span></h3>
							<p>Doanh thu du lịch</p>
						</span>
					</section>
				</div>
				<div className='flex flex-col-reverse md:flex-col md:gap-10 gap-2 w-fit mx-3 lg:w-1/2 md:mt-0 mt-6'>
					<p className='text-lg md:text-xl text-justify rounded'>
						Để có được kết quả nêu trên, theo Sở Văn hoá Thể thao và Du lịch Tây Ninh, toàn ngành du lịch tỉnh đã phấn đấu,
						tổ chức thành công các hoạt động như: Chương trình nghệ thuật "Hương sắc Tây Ninh"; kết nối du lịch Bình Phước
						với Tây Ninh; khảo sát điểm đến du lịch trong tỉnh; Chương trình nghệ thuật, bắn pháo hoa chào mừng 49 năm
						giải phóng miền Nam 30.4, du lịch hè 2024; triển khai ứng dụng mã QR - mã phản hồi nhanh tại các điểm tham
						quan du lịch và di tích trên địa bàn tỉnh, phục vụ nhu cầu tìm hiểu thông tin của khách du lịch thông qua mạng xã hội.
					</p>
					<div className='w-full'>
						<Image src={nuibaden} alt='hinh' width={500} height={300} className='object-fit w-full md:h-full rounded-xl' />
					</div>
				</div>
			</div>
		</section>
	)
}
