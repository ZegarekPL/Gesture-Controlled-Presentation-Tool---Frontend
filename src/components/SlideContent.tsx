import React, { useRef, useEffect, useState } from "react";
import { Slide } from "../app/page";

interface SlideContentProps {
    slide: Slide;
    onSaveImage: (imageUrl: string) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, onSaveImage }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [drawing, setDrawing] = useState<boolean>(false);
    const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
    const [tool, setTool] = useState<"pencil" | "eraser">("pencil");

    // Za każdym razem, gdy zmienia się slajd, ładujemy zapisany obraz (jeśli istnieje)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (slide.image) {
                    const img = new Image();
                    img.src = slide.image;
                    img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                }
            }
        }
    }, [slide]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setLastPos({ x, y });
        setDrawing(true);
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
            ctx.beginPath();
            ctx.moveTo(x, y);
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing || !canvasRef.current || !lastPos) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        if (tool === "pencil") {
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.lineTo(x, y);
            ctx.stroke();
        } else if (tool === "eraser") {
            ctx.clearRect(x - 10, y - 10, 20, 20);
        }
        setLastPos({ x, y });
    };

    // Po zakończeniu rysowania zapisujemy zawartość canvasu jako URL obrazu
    const stopDrawing = () => {
        setDrawing(false);
        setLastPos(null);
        if (canvasRef.current) {
            const imageUrl = canvasRef.current.toDataURL();
            onSaveImage(imageUrl);
        }
    };

    return (
        <div className="w-5/6 p-6 bg-lightbackground">
            <h1 className="text-2xl font-bold mb-2">{slide.title}</h1>
            <p className="mb-4">{slide.content}</p>
            <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border border-gray-400"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
            />
            <div className="mt-4">
                <button
                    onClick={() => setTool("pencil")}
                    className={`mr-2 p-2 rounded ${
                        tool === "pencil" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                    Ołówek
                </button>
                <button
                    onClick={() => setTool("eraser")}
                    className={`p-2 rounded ${
                        tool === "eraser" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                    }`}
                >
                    Gumka
                </button>
            </div>
        </div>
    );
};

export default SlideContent;
