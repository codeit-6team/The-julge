import { useEffect, useState } from 'react';
import Button from '../Button';
import TableStatus from './TableStatus';

export default function TableButtons() {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(
    'pending',
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const handleClickReject = () => {
    setStatus('rejected');
  };
  const handleClickAccept = () => {
    setStatus('accepted');
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return status === 'pending' ? (
    <div className="flex gap-8 md:gap-12">
      <Button
        solid={false}
        size={isMobile ? 'small' : 'medium'}
        className="w-69 md:w-92"
        onClick={handleClickReject}
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
        onClick={handleClickAccept}
      >
        승인하기
      </Button>
    </div>
  ) : (
    <TableStatus status={status} />
  );
}
