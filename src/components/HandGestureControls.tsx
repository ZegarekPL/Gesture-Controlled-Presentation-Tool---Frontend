import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';

interface HandGestureControlsProps {
    onNextSlide: () => void;
    onPreviousSlide: () => void;
}

const HandGestureControls: React.FC<HandGestureControlsProps> = ({onNextSlide, onPreviousSlide}) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const lastGestureRef = useRef<string | null>(null);
    const gestureTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(()=> {
        let hands:  any;
        let camera: any;

        const initializeMediaPipe = async () => {
            const {Hands} = await import('@mediapipe/hands');
            const {Camera} = await import('@mediapipe/camera_utils');

            hands = new Hands({
                locateFile: (file) => {
                  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
                },
            });

            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 1,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5,
            });

            const detectGesture = (landmarks: any[]) => {
                if (landmarks.length === 0) return null;
        
                const hand = landmarks[0];
                const thumbTip = hand[4];
                const indexTip = hand[8];
                const middleTip = hand[12];
        
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
                return null;
            };

            hands.onResults((results: any) => {
                if (!results.multiHandLandmarks) return;
        
                const gesture = detectGesture(results.multiHandLandmarks);
        
                if (gesture && gesture !== lastGestureRef.current) {
                  lastGestureRef.current = gesture;
        
                  if (gestureTimeoutRef.current) {
                    clearTimeout(gestureTimeoutRef.current);
                  }
        
                  if (gesture === 'swipeLeft') {
                    onPreviousSlide();
                  } else if (gesture === 'swipeRight') {
                    onNextSlide();
                  }
        
                  gestureTimeoutRef.current = setTimeout(() => {
                    lastGestureRef.current = null;
                  }, 1000);
                }
            });
            
            if (videoRef.current) {
                camera = new Camera(videoRef.current, {
                    onFrame: async () =>{
                        if(videoRef.current){
                            await hands.send({ image: videoRef.current});
                        }
                    },
                    width: 640,
                    height: 480,
                });

                camera.start();
            }
        };

        if(typeof window!== 'undefined'){
            initializeMediaPipe();
        }

        return () => {
            if(gestureTimeoutRef.current){
                clearTimeout(gestureTimeoutRef.current);
            }

            if(camera){
                camera.stop();
            }

            if(hands){
                hands.close();
            }
        };
    }, [onNextSlide, onPreviousSlide]);

    return (
        <video 
            ref={videoRef}
            className="fixed bottom-4 right-4 w-48 h-36 rounded-lg object-cover transform scale-x-[-1]"
            playsInline
        />
    )
}

export default dynamic(() => Promise.resolve(HandGestureControls), {
    ssr: false
  });