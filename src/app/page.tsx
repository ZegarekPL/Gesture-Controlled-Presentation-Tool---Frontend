'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import SlideContent from '../components/SlideContent';

export interface Slide {
	image: string;
}

export default function Home() {
	const [selectedSlide, setSelectedSlide] = useState<number>(0);
	const [slides, setSlides] = useState<Slide[]>([{ image: '' }]);

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
		<div className="flex h-screen">
			<Sidebar
				slides={slides}
				selectedSlide={selectedSlide}
				onSelectSlide={setSelectedSlide}
				onAddSlideAt={addSlideAt}
				onRemoveSlide={removeSlide}
			/>
			<SlideContent slide={slides[selectedSlide]} onSaveImage={saveImageForSlide} />
		</div>
	);
}
