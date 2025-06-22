import { useEffect, useState, type MouseEvent } from 'react';
import Button from '../Button';
import TableStatus from './TableStatus';
import { putNoticeApplications } from '@/api/applicationApi';

interface Props {
  click: (dataIndex: number, status: 'accepted' | 'rejected') => void;
}

export default function TableButtons({ click }: Props) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>(
    'pending',
  );
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: 'accepted' | 'rejected';
  }>({
    isOpen: false,
    status: 'accepted',
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const closeModal = () =>
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });

  const handleModalClick = async () => {
    closeModal();
    setStatus(modal.status);
    try {
      await putNoticeApplications(shopId, noticeId, applicaitonId, {
        status: modal.status,
      });
    } catch {
      setStatus('pending');
    }
  };

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setModal({
      isOpen: true,
      status: e.currentTarget.value as 'accepted' | 'rejected',
    });
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
        value="rejected"
        onClick={handleClick}
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
        onClick={handleClick}
      >
        승인하기
      </Button>
    </div>
  ) : (
    <TableStatus status={status} />
  );
}
