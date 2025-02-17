'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import SlideContent from '../components/SlideContent';
import { IoMdMenu } from "react-icons/io";

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
		if (typeof window === 'undefined' || window.innerWidth >= 768) return;

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
			if (selectedSlide === index) {
				setSelectedSlide(index > 0 ? index - 1 : 0);
			}
		}
	};

	return (
		<div className="flex h-svh">
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
					onClick={() => setIsSidebarOpen(false)}
				></div>
			)}

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

			<div className="flex-1 md:w-5/6 h-full bg-lightbackground">
				<div className="md:hidden p-2">
					<button onClick={() => setIsSidebarOpen(true)}>
						<IoMdMenu size={24} />
					</button>
				</div>

				<SlideContent
					slide={slides[selectedSlide]}
					onSaveImage={saveImageForSlide}
				/>
			</div>
		</div>
	);
}
