import React from 'react';
import { Slide } from '@/app/page';
import Image from 'next/image';

interface SidebarProps {
    slides: Slide[];
    selectedSlide: number;
    onSelectSlide: (index: number) => void;
    onAddSlideAt: (index: number) => void;
    onRemoveSlide: (index: number) => void;
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    slides,
    selectedSlide,
    onSelectSlide,
    onAddSlideAt,
    onRemoveSlide,
    isOpen,
    onClose
}) => {
    return (
        <div
            className={`fixed top-0 left-0 h-full w-full bg-background p-4 transform transition-transform duration-300 ease-in-out z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:static md:translate-x-0 md:w-1/6 overflow-y-auto`}
        >
            <button onClick={onClose} className="md:hidden text-white mb-4">
                Zamknij
            </button>

            <h1 className="text-xl font-bold mb-4">Slides</h1>

            <ul className="space-y-4 max-h-[calc(100vh-100px)] overflow-y-auto">
                <li key="add-slide-top">
                    <button
                        onClick={() => onAddSlideAt(0)}
                        className="w-full p-2 bg-green-500 text-white rounded"
                    >
                        Dodaj slajd
                    </button>
                </li>
                {slides.map((slide, index) => (
                    <React.Fragment key={index}>
                        <li
                            key={`slide-${index}`}
                            className="mb-2 rounded cursor-pointer"
                        >
                            <div className="flex w-full items-center">
                              <span className="font-bold text-md mr-2 shrink-0">{index + 1}</span>
                                <div className="w-full">
                                    {slide.image ? (
                                        <Image
                                            src={slide.image}
                                            alt={`Podgląd slajdu ${index + 1}`}
                                            width={500}
                                            height={80}
                                            className={`h-auto w-full bg-lightbackground p-2 rounded cursor-pointer border-2 ${
                                                selectedSlide === index ? 'border-blue-500' : 'border-transparent'
                                            }`}
                                            onClick={() => onSelectSlide(index)}
                                        />
                                    ) : (
                                        <div
                                            className={`h-40 w-full bg-lightbackground p-2 rounded cursor-pointer border-2 ${
                                                selectedSlide === index ? 'border-blue-500' : 'border-transparent'
                                            }`}
                                            onClick={() => onSelectSlide(index)}
                                        >
                                            <p className="text-center text-gray-500">Brak obrazu</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2 space-x-2">
                                <button
                                    onClick={() => onAddSlideAt(index + 1)}
                                    className="w-full p-2 bg-green-500 text-white rounded"
                                >
                                    Dodaj slajd
                                </button>
                                {index > 0 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveSlide(index);
                                        }}
                                        disabled={slides.length === 1}
                                        className="w-full p-2 bg-red-500 text-white rounded"
                                    >
                                        Usuń slajd
                                    </button>
                                )}
                            </div>
                        </li>
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
};

export default Sidebar;
