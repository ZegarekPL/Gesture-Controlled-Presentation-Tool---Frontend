import React from "react";
import { Slide } from "../app/page";

interface SidebarProps {
    slides: Slide[];
    selectedSlide: number;
    onSelectSlide: (index: number) => void;
    onAddSlide: () => void;
    onRemoveSlide: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
                                             slides,
                                             selectedSlide,
                                             onSelectSlide,
                                             onAddSlide,
                                             onRemoveSlide,
                                         }) => {
    return (
        <div className="w-1/6 bg-background p-4 min-h-screen">
            <h1 className="text-xl font-bold mb-4">Slides</h1>
            <ul className="overflow-y-auto max-h-[calc(100vh-100px)]">
                {slides.map((slide, index) => (
                    <li
                        key={index}
                        className={`p-2 mb-2 rounded cursor-pointer ${
                            selectedSlide === index ? "bg-blue-500 text-white" : "bg-lightbackground text-white"
                        }`}
                        onClick={() => onSelectSlide(index)}
                    >
                        <div className="flex justify-between items-center">
                            <span>{slide.title}</span>
                            <button
                                className="ml-2 text-red-500"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveSlide(index);
                                }}
                                disabled={slides.length === 1}
                            >
                                🗑️
                            </button>
                        </div>
                        {slide.image && (
                            <img
                                src={slide.image}
                                alt="Slide Preview"
                                className="mt-2 rounded w-full h-auto object-cover"
                            />
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={onAddSlide} className="w-full mt-4 p-2 bg-green-500 text-white rounded">
                Dodaj Slajd
            </button>
        </div>
    );
};

export default Sidebar;
