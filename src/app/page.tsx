"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import SlideContent from "../components/SlideContent";

export interface Slide {
    title: string;
    content: string;
    image?: string;
}

export default function Home() {
    const [selectedSlide, setSelectedSlide] = useState<number>(0);
    const [slides, setSlides] = useState<Slide[]>([
        { title: "Slide 1", content: "This is the content of slide 1.", image: "" },
    ]);

    const saveImageForSlide = (imageUrl: string) => {
        const newSlides = [...slides];
        newSlides[selectedSlide] = { ...newSlides[selectedSlide], image: imageUrl };
        setSlides(newSlides);
    };

    const addSlide = () => {
        setSlides([
            ...slides,
            {
                title: `Slide ${slides.length + 1}`,
                content: `This is the content of slide ${slides.length + 1}`,
                image: "",
            },
        ]);
        setSelectedSlide(slides.length);
    };

    const removeSlide = (index: number) => {
        if (slides.length > 1) {
            const newSlides = slides.filter((_, i) => i !== index);
            setSlides(newSlides);

            if (selectedSlide === index) {
                if (index > 0) {
                    setSelectedSlide(index - 1);
                } else {
                    setSelectedSlide(0);
                }
            }
        }
    };

    return (
        <div className="flex h-screen">
            <Sidebar
                slides={slides}
                selectedSlide={selectedSlide}
                onSelectSlide={setSelectedSlide}
                onAddSlide={addSlide}
                onRemoveSlide={removeSlide}
            />

            <SlideContent slide={slides[selectedSlide]} onSaveImage={saveImageForSlide} />
        </div>
    );
}
