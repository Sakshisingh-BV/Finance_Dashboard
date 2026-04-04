import { useEffect, useRef } from 'react';
import FinanceLottie from '../Animations/FinanceLottie';

const OVERLAY_DURATION_MS = 2000;

const TransactionSuccessOverlay = ({ isOpen, onClose }) => {
  const dismissTimerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      clearTimeout(dismissTimerRef.current);
      return undefined;
    }

    dismissTimerRef.current = setTimeout(() => {
      onClose?.();
    }, OVERLAY_DURATION_MS);

    return () => {
      clearTimeout(dismissTimerRef.current);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md" />

      <div className="relative h-52 w-52 animate-modal-in">
        <FinanceLottie className="h-full w-full" loop={false} />
      </div>
    </div>
  );
};

export default TransactionSuccessOverlay;
