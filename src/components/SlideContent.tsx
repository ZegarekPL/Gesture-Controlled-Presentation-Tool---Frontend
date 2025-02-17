import React, { useRef, useEffect, useState } from 'react';
import { Slide } from '@/app/page';

interface SlideContentProps {
	slide: Slide;
	onSaveImage: (imageUrl: string) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({ slide, onSaveImage }) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [drawing, setDrawing] = useState(false);
	const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
	const [tool, setTool] = useState<'pencil' | 'eraser'>('pencil');

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (slide.image) {
			const img = new Image();
			img.src = slide.image;
			img.onload = () => {
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			};
		}
	}, [slide]);

	const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) {
			return { x: 0, y: 0 };
		}
		const rect = canvasRef.current.getBoundingClientRect();
		const scaleX = canvasRef.current.width / rect.width;
		const scaleY = canvasRef.current.height / rect.height;

		return {
			x: (e.clientX - rect.left) * scaleX,
			y: (e.clientY - rect.top) * scaleY
		};
	};

	const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!canvasRef.current) return;

		const pos = getMousePos(e);
		setLastPos(pos);
		setDrawing(true);

		const ctx = canvasRef.current.getContext('2d');
		if (ctx) {
			ctx.beginPath();
			ctx.moveTo(pos.x, pos.y);
		}
	};

	const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
		if (!drawing || !canvasRef.current || !lastPos) return;

		const pos = getMousePos(e);
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
			</div>
		</div>
	);
};

export default SlideContent;
