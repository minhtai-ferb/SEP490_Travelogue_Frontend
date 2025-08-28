'use client'
import { Button } from '@mui/material'
import TextField from '@mui/material/TextField'
import Image from 'next/image'
import Link from 'next/link'
import bannerBg from '../../../public/Banner.png'
import logo from '../../../public/Logo.png'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'


const FOOTER_LINK = {
	ABOOUT_TAY_NINH: [
		{
			text: "Về thành phố Tây Ninh",
			href: '#'
		},
		{
			text: "Đăng ký đối tác",
			href: '/ho-so/gia-nhap'
		},
		{
			text: "Liên hệ",
			href: '#'
		},
		{
			text: "Điều khoản sử dụng",
			href: '#'
		},
		{
			text: "Cam kết bảo mật",
			href: '#'
		},
	],
	end: [
		{
			text: 'Trang chủ',
			href: '/'
		},
		{
			text: 'Khám phá',
			href: '#'
		},
		{
			text: 'Kế hoạch chuyến đi',
			href: '#'
		},
		{
			text: 'Lễ hội & Sự kiện',
			href: '#'
		},
		{
			text: 'Trải nghiệm',
			href: '#'
		},
		{
			text: 'Tin tức',
			href: '#'
		},
		{
			text: 'Thông tin cần biết',
			href: '#'
		},
	]
}

function Footer() {
	const route = useRouter()

	return (
		<footer>
			<section className='md:py-10 px-4 md:px-0 flex flex-col md:flex-row justify-around items-center gap-8 md:gap-0 bg-cover bg-center md:h-[300px] h-full'
				style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bannerBg.src})` }}>

				<Image src='/mascot.png' alt='logo_travelogue' width={200} height={200} className="md:max-w-[150px] md:w-auto max-w-[150px] md:mt-0 mt-6" />

				<div className='text-white flex justify-center items-center flex-col gap-4 px-4 md:px-0'>
					<h1 className='uppercase text-white text-xl md:text-2xl font-bold text-center font-sans tracking-wide'>đăng ký nhận tin</h1>
					<p className='text-center text-sm md:text-base uppercase font-medium font-sans'>Cập nhật tin du lịch Tây Ninh – Sẵn sàng cho hành trình mới !</p>
					<section className='flex items-center gap-0 w-full md:w-auto'>
						<TextField
							variant="filled"
							placeholder="Nhập địa chỉ Email của bạn"
							InputProps={{
								disableUnderline: true,
								sx: {
									'& .MuiFilledInput-input': {
										padding: '16px 40px',
										fontSize: '16px',
										'@media (max-width: 600px)': {  // Media query for small screens
											padding: '12px 16px',         // Adjust padding
											fontSize: '14px',             // Smaller font size
										},
									},
								},
							}}
							sx={{
								width: '100%',
								maxWidth: '600px',
								backgroundColor: 'white',
								borderTopLeftRadius: '40px',
								borderBottomLeftRadius: '40px',
								'& .MuiInputBase-root': {
									borderRadius: '40px 0 0 40px',
									height: '56px',
								},
								'@media (max-width: 600px)': {   // Media query for input height adjustment on small screens
									height: '48px',
								},
							}}
						/>
						<Button
							sx={{
								backgroundColor: '#2563eb',
								color: 'white',
								borderTopRightRadius: '40px',
								borderBottomRightRadius: '40px',
								height: '56px',
								padding: '0 40px',
								fontSize: '1rem',
								whiteSpace: 'nowrap',
								fontWeight: 500,
								'@media (max-width: 600px)': {   // Media query for input height adjustment on small screens
									height: '48px',
								},
							}}
						>
							Đăng ký
						</Button>
					</section>
				</div>

				<div className='flex md:flex-col justify-center items-center gap-1 md:gap-4'>
					<div className='flex gap-4 items-center'>
						<Link href='https://www.facebook.com/TinhDoanTayNinh' target='_blank'>
							<Image src="/fb-ic.png" alt='facebook' width={100} height={100} className='rounded-full w-8 h-8 cursor-pointer' />
						</Link>
						<Link href='https://tinhdoan.tayninh.gov.vn/vi/' target='_blank'>
							<Globe className='md:w-8 md:h-8 w-6 h-6 text-gray-300 cursor-pointer' />
						</Link>
						{/* <Image src="/it-ic.png" alt='instagram' width={24} height={24} className='rounded-full w-8 h-8 cursor-pointer' /> */}
						<Link href='https://www.youtube.com/@tuoitretayninh4761' target='_blank'>
							<Image src="/yt-ic.png" alt='youtube' width={24} height={24} className='rounded-full md:w-8 md:h-8 w-8 h-8 cursor-pointer' />
						</Link>
						{/* <Image src="/tt-ic.png" alt='tiktok' width={24} height={24} className='rounded-full w-8 h-8 cursor-pointer' /> */}
					</div>
					<section className='flex md:flex-col align-middle justify-center items-center'>
						<Image src="/Q5OhYIrTxr_.png" alt='googleplay' width={130} height={40} className='cursor-pointer' />
						{/* <Image src='/traveloge.png' alt='team' width={150} height={40} className='' /> */}
					</section>
					<Link href='https://www.facebook.com/TravelogueDukhaoveNguon' target='_blank'>
						<section className='relative h-[80px] w-[150px]'>
							<Image
								src='/traveloge.png'
								alt='team'
								fill
								className='object-contain cursor-pointer'
							/>
						</section>
					</Link>
				</div>
			</section>

			<section className='flex flex-wrap justify-center gap-4 md:gap-16 py-3 px-4'>
				{FOOTER_LINK.ABOOUT_TAY_NINH.map((item) => (
					<span key={item.text} className='text-xs md:text-lg hover:text-slate-800 text-slate-500'>
						<Link href={item.href}>{item.text}</Link>
					</span>
				))}
			</section>

			<section className='bg-slate-300 w-full flex flex-wrap py-3 justify-center md:justify-around px-4'>
				{FOOTER_LINK.end.map((item, index) => (
					<span key={index} className='text-xs md:text-lg hover:text-white px-2 md:border-x-2'>
						<Link href={item.href} className='hover:text-white'>
							{item.text}
						</Link>
					</span>
				))}
			</section>
		</footer>
	)
}

export default Footer
