'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

interface HandGestureControlsProps {
  onNextSlide: () => void;
  onPreviousSlide: () => void;
}

const HandGestureControls: React.FC<HandGestureControlsProps> = ({
  onNextSlide,
  onPreviousSlide,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastGestureTimeRef = useRef<number>(0);
  const isProcessingGestureRef = useRef<boolean>(false);
  const [currentGesture, setCurrentGesture] = useState<string | null>(null);

  useEffect(() => {
    let hands: any;
    let camera: any;

    const initializeMediaPipe = async () => {
      const { Hands } = await import('@mediapipe/hands');
      const { Camera } = await import('@mediapipe/camera_utils');

      hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });

      hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConficiency: 0.5,
      });

      const drawHand = (landmarks: any[]) => {
        if (!canvasRef.current || !landmarks || landmarks.length === 0) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const connections = [
          [0, 1], [1, 2], [2, 3], [3, 4],
          [0, 5], [5, 6], [6, 7], [7, 8],
          [0, 9], [9, 10], [10, 11], [11, 12],
          [0, 13], [13, 14], [14, 15], [15, 16],
          [0, 17], [17, 18], [18, 19], [19, 20],
          [0, 5], [5, 9], [9, 13], [13, 17]
        ];

        try {
          ctx.beginPath();
          ctx.strokeStyle = '#00ff00';
          ctx.lineWidth = 2;
          
          connections.forEach(([start, end]) => {
            if (landmarks[start] && landmarks[end]) {
              const startPoint = landmarks[start];
              const endPoint = landmarks[end];
              ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
              ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
            }
          });
          ctx.stroke();

          landmarks.forEach((point) => {
            if (point) {
              ctx.beginPath();
              ctx.arc(
                point.x * ctx.canvas.width,
                point.y * ctx.canvas.height,
                3,
                0,
                2 * Math.PI
              );
              ctx.fillStyle = '#ff0000';
              ctx.fill();
            }
          });
        } catch (error) {
          console.error('Błąd podczas rysowania punktów dłoni:', error);
        }
      };

      const detectGesture = (landmarks: any[]) => {
        if (!landmarks || landmarks.length === 0) return null;

        try {
          const hand = landmarks[0];
          const thumbTip = hand[4];
          const indexTip = hand[8];
          const middleTip = hand[12];

          if (!thumbTip || !indexTip || !middleTip) return null;

          const isSwipeLeft =
            thumbTip.x < indexTip.x &&
            Math.abs(thumbTip.y - indexTip.y) < 0.1 &&
            middleTip.y > indexTip.y;

          const isSwipeRight =
            thumbTip.x > indexTip.x &&
            Math.abs(thumbTip.y - indexTip.y) < 0.1 &&
            middleTip.y > indexTip.y;

          if (isSwipeLeft) return 'swipeLeft';
          if (isSwipeRight) return 'swipeRight';
        } catch (error) {
          console.error('Błąd podczas wykrywania gestu:', error);
        }
        
        return null;
      };

      const handleGesture = (gesture: string | null, landmarks: any[]) => {
        if (landmarks && landmarks.length > 0) {
          drawHand(landmarks);
        }
        
        setCurrentGesture(gesture);

        const now = Date.now();
        const timeSinceLastGesture = now - lastGestureTimeRef.current;
        
        if (timeSinceLastGesture < 2000 || isProcessingGestureRef.current) {
          return;
        }

        if (gesture) {
          isProcessingGestureRef.current = true;
          lastGestureTimeRef.current = now;

          if (gesture === 'swipeLeft') {
            onPreviousSlide();
          } else if (gesture === 'swipeRight') {
            onNextSlide();
          }

          setTimeout(() => {
            isProcessingGestureRef.current = false;
          }, 500);
        }
      };

      hands.onResults((results: any) => {
        if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) {
          if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
          }
          setCurrentGesture(null);
          return;
        }
        
        const gesture = detectGesture(results.multiHandLandmarks);
        handleGesture(gesture, results.multiHandLandmarks[0]);
      });

      if (videoRef.current) {
        camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await hands.send({ image: videoRef.current });
            }
          },
          width: 1280,
          height: 960,
        });

        camera.start();
      }
    };

    if (typeof window !== 'undefined') {
      initializeMediaPipe();
    }

    return () => {
      if (camera) {
        camera.stop();
      }
      if (hands) {
        hands.close();
      }
    };
  }, [onNextSlide, onPreviousSlide]);

  return (
    <div className="fixed bottom-4 right-4 w-96 h-72">
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover transform scale-x-[-1]"
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={1280}
        height={960}
        className="absolute w-full h-full transform scale-x-[-1]"
      />
      {currentGesture && (
        <div className="absolute top-0 left-0 w-full text-center bg-black bg-opacity-50 text-white p-1">
          {currentGesture === 'swipeLeft' ? 'Poprzedni Slajd' : 'Następny Slajd'}
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(HandGestureControls), {
  ssr: false
});