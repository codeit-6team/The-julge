import { useEffect, useState } from 'react';
import Button from '../Button';

interface Props {
  index: number;
  click: (dataIndex: number, status: 'accepted' | 'rejected') => void;
}

export default function TableButtons({ index, click }: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex gap-8 md:gap-12">
      <Button
        solid={false}
        size={isMobile ? 'small' : 'medium'}
        className="w-69 md:w-92"
        value="rejected"
        onClick={() => click(index, 'rejected')}
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
        value="accepted"
        onClick={() => click(index, 'accepted')}
      >
        승인하기
      </Button>
    </div>
  );
}
