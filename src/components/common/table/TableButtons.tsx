import { useEffect, useState } from 'react';
import Button from '../Button';
import TableStatus from './TableStatus';
import { putNoticeApplications } from '@/api/applicationApi';
import Modal from '../Modal';

interface Props {
  shopId: string;
  noticeId: string;
  applicaitonId: string;
}

export default function TableButtons({
  shopId,
  noticeId,
  applicaitonId,
}: Props) {
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

  const changeStatus = async (stat: 'accepted' | 'rejected') => {
    setStatus(stat);
    try {
      await putNoticeApplications(shopId, noticeId, applicaitonId, {
        status: stat,
      });
    } catch {
      setStatus('pending');
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return status === 'pending' ? (
    <>
      <div className="flex gap-8 md:gap-12">
        <Button
          solid={false}
          size={isMobile ? 'small' : 'medium'}
          className="w-69 md:w-92"
          onClick={() => changeStatus('rejected')}
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
          onClick={() => changeStatus('accepted')}
        >
          승인하기
        </Button>
      </div>
      {modal.isOpen && (
        <Modal option="action" onClose={() => null}>
          신청을 {modal.status === 'accepted' ? '승인' : '거절'}하시겠어요?
        </Modal>
      )}
    </>
  ) : (
    <TableStatus status={status} />
  );
}
