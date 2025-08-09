"use client";

import { motion, type Transition, type Variants } from "motion/react";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import banner from "../../../public/Banner.png";
import banner1 from "../../../public/Banner1.png";
import banner2 from "../../../public/Banner2.png";
import banner3 from "../../../public/Banner3.png";
import banner4 from "../../../public/Banner4.png";
import arrow from "../../../public/arrowDouble.png";
import { InteractiveHoverButton } from "../ui/interactive-hover-button";
import UnifiedHeader from "../common/common-header";
import { headerConfigs } from "@/config/header";


function Header() {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    banner.src,
    banner1.src,
    banner2.src,
    banner3.src,
    banner4.src,
  ];

  const transition: Transition = {
    repeat: Number.POSITIVE_INFINITY,
    repeatType: "mirror",
    duration: 0.6,
    ease: "easeInOut",
  };

  const jumpVariants: Variants = {
    initial: {
      y: 0,
    },
    animate: {
      y: [-10, 0],
      transition,
    },
  };

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeout(() => {
        setCurrentImage((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change image after 3 seconds of fading
    }, 6000); // Total duration for each image
    return () => clearInterval(interval);
  }, [currentImage, images.length]);

  // Handle header hide on arrow click
  const handleArrowClick = () => {
    // Scroll by the height of the screen (window.innerHeight)
    window.scrollBy({
      top: window.innerHeight, // Scroll down by the height of one screen
      behavior: "smooth", // Smooth scrolling effect
    });
  };

  return (
    <>
      {/* Main Header */}
      <header
        id="navbar"
        className="relative h-screen w-full bg-cover bg-center flex flex-col bg-transparent inset-0 bg-black bg-opacity-40"
      >
        {/* Background Image */}
        <div
          style={{
            backgroundImage: `url(${images[currentImage]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 3s ease-out",
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          className="bg-no-repeat"
        />
        {/* Opacity Overlay */}
        {/* Dark overlay */}
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-black/60 to-transparent"
        ></div>

        <UnifiedHeader
          config={headerConfigs?.home}
        />

        <div className="relative z-10 flex top-1/3 -translate-y-1/2 flex-col gap-20 lg:top-20 lg:mt-0 lg:gap-64 lg:px-60 xxl:top-40 xxl:px-96">
          <section className="text-gray-50 flex flex-col gap-6">
            <h1 className="text-3xl lg:text-left text-balance md:text-nowrap text-center lg:text-3xl font-medium mx-auto lg:mx-0">
              Chào mừng đến với Traveloge
            </h1>
            <p className="font-[400] text-lg lg:text-xl lg:mx-0 mx-auto">
              Traveloge! - "Theo dấu chân lịch sử"
            </p>
            <Link href="/kham-pha" className="w-fit lg:mx-0 mx-auto">
              <InteractiveHoverButton className="md:w-full w-full md:px-5 md:py-2 px-10 py-2 text-lg md:text-xl">
                Khám phá
              </InteractiveHoverButton>
            </Link>
          </section>
        </div>

        <motion.div
          variants={jumpVariants}
          initial="initial"
          animate="animate"
          className="absolute z-10 bottom-6 left-1/2 -translate-x-1/2 cursor-pointer animate-bounce md:bottom-10"
        >
          <Image
            src={arrow.src || "/placeholder.svg"}
            alt="arrow"
            width={40}
            height={20}
            className="relative w-10 h-10 -translate-x-1/2 md:-translate-x-1/2 animate-drip-expand animate-infinite animate-duration-1000 animate-ease-in-out md:animate-none"
            onClick={handleArrowClick}
          />
        </motion.div>
      </header>
    </>
  );
}

export default Header;
