import { useState, useRef, useEffect, useCallback } from 'react';

export function useToast(duration: number = 2000) {
  const [toast, setToast] = useState<{
    message: string;
    isVisible: boolean;
  }>({
    message: '',
    isVisible: false,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 토스트를 보여주는 함수
  const showToast = useCallback(
    (message: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      setToast({ message, isVisible: true });
      timerRef.current = setTimeout(() => {
        setToast({ message, isVisible: false });
      }, duration);
    },
    [duration],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return { toast, showToast };
}
