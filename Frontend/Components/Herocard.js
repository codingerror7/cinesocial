
import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from 'next/image';
import "swiper/css";
import "swiper/css/effect-fade";

const images = [
  "/banner1.png",
  "/banner2.jpg",
  "/banner3.jpg",
];

const Herocard = () => {
  return (
    <>
     <div className="relative h-[180px] sm:h-[200px] w-full sm:w-[85vw] md:w-[60vw] lg:w-[50vw] mt-10 sm:mt-16 lg:mt-21 rounded-2xl overflow-hidden mb-5 sm:mb-7 cursor-pointer group font-[gilroy] lg:block hidden">
  
  {/* BG Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] via-[#2d0a1a] to-[#0a1a2e]" />

  {/* Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />

  {/* Content */}
  <Swiper
    modules={[Autoplay, EffectFade]}
    effect="fade"
    loop
    speed={1800}
    autoplay={{ delay: 3200, disableOnInteraction: false }}
    className="h-full w-full"
  >
    {images.map((img, i) => (
      <SwiperSlide key={img}>
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={img}
            fill
            priority={i === 0}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 85vw, (max-width: 1024px) 60vw, 50vw"
            className="ed-ken-burns object-cover"
            alt="banner-image"
          />
        </div>
      </SwiperSlide>
    ))}
  </Swiper>
</div>
    </>
  )
}

export default Herocard