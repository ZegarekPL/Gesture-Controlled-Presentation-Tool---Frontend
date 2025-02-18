'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SlideContent from '../components/SlideContent';
import { IoMdMenu } from "react-icons/io";
import dynamic from 'next/dynamic';

const HandGestureControls = dynamic(
    () => import('../components/HandGestureControls'),
    {ssr: false}
)

export interface Slide {
    image: string;
}

export default function Home() {
    const [selectedSlide, setSelectedSlide] = useState<number>(0);
    const [slides, setSlides] = useState<Slide[]>([{ image: '' }]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50;

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleTouchStart = (e: TouchEvent) => {
            if (e.touches.length > 1) return;
            startX = e.touches[0].clientX;
        };

        const handleTouchMove = (e: TouchEvent) => {
            endX = e.touches[0].clientX;
        };

        const handleTouchEnd = () => {
            const distance = endX - startX;

            if (distance > swipeThreshold) {
                setIsSidebarOpen(true);
            }
            else if (distance < -swipeThreshold) {
                setIsSidebarOpen(false);
            }
            startX = 0;
            endX = 0;
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const saveImageForSlide = (imageUrl: string) => {
        const newSlides = [...slides];
        newSlides[selectedSlide] = { ...newSlides[selectedSlide], image: imageUrl };
        setSlides(newSlides);
    };

    const addSlideAt = (index: number) => {
        setSlides((prevSlides) => {
            const newSlides = [...prevSlides];
            newSlides.splice(index, 0, { image: '' });
            return newSlides;
        });
        setSelectedSlide(index);
        setIsSidebarOpen(false);
    };

    const removeSlide = (index: number) => {
        if (slides.length > 1) {
            const newSlides = slides.filter((_, i) => i !== index);
            setSlides(newSlides);
            if (selectedSlide >= newSlides.length) {
                setSelectedSlide(newSlides.length - 1);
            }
        }
    };

    const handleNextSlide = () => {
        if (selectedSlide < slides.length - 1) {
            setSelectedSlide(prev => prev + 1);
        }
    };

    const handlePreviousSlide = () => {
        if (selectedSlide > 0) {
            setSelectedSlide(prev => prev - 1);
        }
    };

    return (
        <div className="flex w-full h-full">
            <Sidebar
                slides={slides}
                selectedSlide={selectedSlide}
                onSelectSlide={(index) => {
                    setSelectedSlide(index);
                    setIsSidebarOpen(false);
                }}
                onAddSlideAt={addSlideAt}
                onRemoveSlide={removeSlide}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div className="flex-1 md:w-5/6 h-svh bg-lightbackground">
                <div className="md:hidden p-2">
                    <button onClick={() => setIsSidebarOpen(true)}>
                        <IoMdMenu size={24} />
                    </button>
                </div>

                <SlideContent
                    slide={slides[selectedSlide]}
                    onSaveImage={saveImageForSlide}
                />

                <HandGestureControls
                    onNextSlide={handleNextSlide}
                    onPreviousSlide={handlePreviousSlide}                
                />
            </div>
        </div>
    );
}
