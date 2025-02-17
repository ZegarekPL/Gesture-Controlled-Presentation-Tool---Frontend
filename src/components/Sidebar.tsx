import React from 'react';
import { Slide } from '@/app/page';

interface SidebarProps {
	slides: Slide[];
	selectedSlide: number;
	onSelectSlide: (index: number) => void;
	onAddSlideAt: (index: number) => void;
	onRemoveSlide: (index: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
																					 slides,
																					 selectedSlide,
																					 onSelectSlide,
																					 onAddSlideAt,
																					 onRemoveSlide
																				 }) => {


	return (
		<div className="w-1/6 bg-background p-4 min-h-screen">
			<h1 className="text-xl font-bold mb-4">Slides</h1>
			<ul className="space-y-4 overflow-y-auto max-h-[calc(100vh-100px)]">
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
						<li key={`slide-${index}`} className="mb-2 rounded cursor-pointer">
							<div className="flex items-center">
								<span className="mr-2 font-bold text-md">{index + 1}</span>
								{slide.image && (
									<img
										src={slide.image}
										alt={`Podgląd slajdu ${index + 1}`}
										className={`w-[90%] h-auto bg-lightbackground object-cover p-2 mb-2 rounded cursor-pointer border-2 ${
											selectedSlide === index ? 'border-blue-500' : 'border-transparent'
										}`}
										onClick={() => onSelectSlide(index)}
									/>
								)}
							</div>
							<div className="flex justify-between items-center mt-2">
								<button
									onClick={(e) => {
										e.stopPropagation();
										onRemoveSlide(index);
									}}
									disabled={slides.length === 1}
								>
									🗑️
								</button>
							</div>
						</li>
						<li key={`add-slide-${index}`}>
							<button
								onClick={() => onAddSlideAt(index + 1)}
								className="w-full p-2 bg-green-500 text-white rounded"
							>
								Dodaj slajd
							</button>
						</li>
					</React.Fragment>
				))}
			</ul>
		</div>
	)
		;
};

export default Sidebar;
