import React, { useRef, useEffect, useState } from 'react';
import { Slide } from '@/app/page';

interface SlideContentProps {
    slide: Slide;
    onSaveImage: (imageUrl: string) => void;
    tool: 'pencil' | 'eraser' | 'pointer';
    setTool: (tool: 'pencil' | 'eraser' | 'pointer') => void;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, onSaveImage, tool, setTool }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [pointerPos, setPointerPos] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (slide && slide.image) {
            const img = new Image();
            img.src = slide.image;
            img.onload = () => {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
        }
    }, [slide]);

    const getPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) {
            return { x: 0, y: 0 };
        }
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;

        let x = 0, y = 0;
        if ('touches' in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }

        return {
            x: (x - rect.left) * scaleX,
            y: (y - rect.top) * scaleY,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();

        if (!canvasRef.current) return;

        const pos = getPos(e);
        setLastPos(pos);
        setDrawing(true);

        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        e.preventDefault();
        const pos = getPos(e);

        if(tool === 'pointer'){
            setPointerPos(pos);
            return;
        }

        if (!drawing || !canvasRef.current || !lastPos) return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (tool === 'pencil') {
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.lineTo(pos.x, pos.y);
            ctx.stroke();
        } else if (tool === 'eraser') {
            ctx.clearRect(pos.x - 10, pos.y - 10, 20, 20);
        }

        setLastPos(pos);
    };

    const stopDrawing = () => {
        setDrawing(false);
        setLastPos(null);

        if (canvasRef.current) {
            const imageUrl = canvasRef.current.toDataURL();
            onSaveImage(imageUrl);
        }
    };

    useEffect(() => {
        if (!canvasRef.current || !pointerPos || tool !== 'pointer') return;

        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        
        ctx.beginPath();
        ctx.arc(pointerPos.x, pointerPos.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();

        const timeout = setTimeout(() => {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            if (slide && slide.image) {
                const img = new Image();
                img.src = slide.image;
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
                };
            }
        }, 100);

        return () => clearTimeout(timeout);
    }, [pointerPos, tool, slide]);

    return (
        <div className="w-full p-6 bg-lightbackground">
            <div className="relative w-full aspect-video border border-gray-400">
                <canvas
                    ref={canvasRef}
                    width={1600}
                    height={900}
                    className="absolute top-0 left-0 w-full h-full"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    onTouchCancel={stopDrawing}
                />
            </div>

            <div className="mt-4">
                <button
                    onClick={() => setTool('pencil')}
                    className={`mr-2 p-2 rounded ${
                        tool === 'pencil' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                    Ołówek
                </button>
                <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded ${
                        tool === 'eraser' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                    Gumka
                </button>
                <button 
                    onClick={() => setTool('pointer')}
                    className={`ml-2 p-2 rounded ${
                        tool === 'pointer' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
                    }`}
                >
                    Wskaźnik
                </button>
            </div>
        </div>
    );
};

export default SlideContent;
