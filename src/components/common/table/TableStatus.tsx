import { useEffect, useState } from 'react';
import Button from '../Button';

export default function TableStatus({
  mode,
  status,
}: {
  mode: 'user' | 'notice';
  status: 'pending' | 'accepted' | 'rejected' | 'canceled';
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return status === 'pending' ? (
    mode === 'notice' ? (
      <div className="flex gap-8 md:gap-12">
        <Button
          solid={false}
          size={isMobile ? 'small' : 'medium'}
          className="w-69 md:w-92"
        >
          거절하기
        </Button>
        <Button
          solid={false}
          size={isMobile ? 'small' : 'medium'}
          className="w-69 md:w-92"
          style={{
            color: 'var(--color-blue-20)',
            borderColor: 'var(--color-blue-20)',
          }}
        >
          승인하기
        </Button>
      </div>
    ) : (
      <div className="inline-block rounded-full bg-green-10 px-10 py-6 text-caption/16 text-green-20 md:text-body2/17 md:font-bold">
        대기중
      </div>
    )
  ) : status === 'accepted' ? (
    <div className="inline-block rounded-full bg-blue-10 px-10 py-6 text-caption/16 text-blue-20 md:text-body2/17 md:font-bold">
      승인 완료
    </div>
  ) : status === 'rejected' ? (
    <div className="inline-block rounded-full bg-red-10 px-10 py-6 text-caption/16 text-red-40 md:text-body2/17 md:font-bold">
      거절
    </div>
  ) : status === 'canceled' ? (
    <div className="inline-block rounded-full bg-gray-20 px-10 py-6 text-caption/16 text-gray-50 md:text-body2/17 md:font-bold">
      취소
    </div>
  ) : null;
}
