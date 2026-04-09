
import React, { useRef, useState } from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    images: string[],
}

export const Carousel = React.memo<Props>(function Carousel({
    images,
}) {
    const sliderRef = useRef<Slider>(null)
    const [currentSlide, setCurrentSlide] = useState(0)
    const settings = {
        dots: true,
        // infinite: true,
        infinite: images.length > 1,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        beforeChange: (current: number, next: number) => setCurrentSlide(next),
    }

    return (
        <div className="relative w-full">
            <Slider ref={sliderRef} {...settings}>
                {images?.map((image, index) => (
                    <div key={index} className="flex items-center justify-center">
                        <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                            <img
                                src={image}
                                alt={`Slide ${index + 1}`}
                                className="absolute left-0 top-0 h-full w-full rounded object-contain"
                            />
                            <div className="absolute left-0 top-0 h-full w-full bg-gray-300" style={{ display: image ? 'none' : 'block' }}></div> {/* 背景色 */}
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 transform">
                <button
                    className="rounded bg-gray-800 bg-opacity-50 p-2 text-white hover:bg-opacity-100"
                    onClick={() => sliderRef.current?.slickPrev()}
                >
                    ＜
                </button>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 transform">
                <button
                    className="rounded bg-gray-800 bg-opacity-50 p-2 text-white hover:bg-opacity-100"
                    onClick={() => sliderRef.current?.slickNext()}
                >
                    ＞
                </button>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform">
                <span className="text-white">
                    {currentSlide + 1} / {images.length}
                </span>
            </div>
        </div>
    )
})
export default Carousel
