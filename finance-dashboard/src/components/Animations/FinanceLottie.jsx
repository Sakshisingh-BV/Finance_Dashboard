import { useEffect, useRef, useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export const FINANCE_LOTTIE_SRC =
  'https://lottie.host/6089388f-077f-4757-b996-f6ed9add2639/NcHSg7Nz7T.lottie';

const FinanceLottie = ({
  src = FINANCE_LOTTIE_SRC,
  className = '',
  loop = true,
  speed = 1,
  autoplay = true,
  onPlay,
  onPause,
  onComplete,
  onFrameChange,
}) => {
  const dotLottieRef = useRef(null);
  const [dotLottieInstance, setDotLottieInstance] = useState(null);

  useEffect(() => {
    if (!dotLottieInstance) return;

    dotLottieInstance.setFrame(0);

    if (autoplay) {
      dotLottieInstance.play();
    }
  }, [autoplay, dotLottieInstance]);

  useEffect(() => {
    if (!dotLottieInstance) return;

    const handlePlay = () => onPlay?.();
    const handlePause = () => onPause?.();
    const handleComplete = () => onComplete?.();
    const handleFrame = (event) => onFrameChange?.(event);

    if (onPlay) dotLottieInstance.addEventListener('play', handlePlay);
    if (onPause) dotLottieInstance.addEventListener('pause', handlePause);
    if (onComplete) dotLottieInstance.addEventListener('complete', handleComplete);
    if (onFrameChange) dotLottieInstance.addEventListener('frame', handleFrame);

    return () => {
      if (onPlay) dotLottieInstance.removeEventListener('play', handlePlay);
      if (onPause) dotLottieInstance.removeEventListener('pause', handlePause);
      if (onComplete) dotLottieInstance.removeEventListener('complete', handleComplete);
      if (onFrameChange) dotLottieInstance.removeEventListener('frame', handleFrame);
    };
  }, [dotLottieInstance, onComplete, onFrameChange, onPause, onPlay]);

  return (
    <DotLottieReact
      src={src}
      className={className}
      loop={loop}
      autoplay
      speed={speed}
      renderConfig={{ autoResize: true }}
      dotLottieRefCallback={(dotLottie) => {
        dotLottieRef.current = dotLottie;
        setDotLottieInstance(dotLottie);
      }}
    />
  );
};

export default FinanceLottie;
