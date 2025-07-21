'use client'

import Image from 'next/image';
import { useEffect, useState } from 'react';
import arrowUp from '../../../public/arrowUp.png'

const ScrollToTop = () => {
	const [isVisible, setIsVisible] = useState(false);
	const [lastScrollPos, setLastScrollPos] = useState(0);

	const toggleVisibility = () => {
		const currentScrollPos = window.scrollY;

		// If user is scrolling up (currentScrollPos < lastScrollPos), show the button
		if (currentScrollPos < lastScrollPos && currentScrollPos > 300) {
			setIsVisible(true);
		} else {
			setIsVisible(false);
		}

		// Update the last scroll position
		setLastScrollPos(currentScrollPos);
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};

	useEffect(() => {
		// Add scroll event listener
		window.addEventListener("scroll", toggleVisibility);
		return () => {
			// Clean up event listener
			window.removeEventListener("scroll", toggleVisibility);
		};
	}, [lastScrollPos]); // Ensure that lastScrollPos updates properly


	return (
		<>
			{isVisible &&
				<button
					onClick={scrollToTop}
					className="fixed bottom-4 right-4 hover:bg-secondary-50 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-50"
					aria-label="Scroll to top"
				>
					<Image src={arrowUp.src} alt="icon" width={30} height={30} className="w-6 h-6" />
				</button>
			}
		</>
	);
};

export default ScrollToTop;