import { useEffect, useState, type MouseEvent } from 'react';
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

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    setModal({
      isOpen: true,
      status: e.currentTarget.value as 'accepted' | 'rejected',
    });
  };

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

  const closeModal = () =>
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });

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
      {modal.isOpen && (
        <Modal
          option="action"
          onButtonClick={closeModal}
          onYesButtonClick={handleModalClick}
          yesButtonContent="예"
          onClose={closeModal}
        >
          신청을 {modal.status === 'accepted' ? '승인' : '거절'}하시겠어요?
        </Modal>
      )}
    </>
  ) : (
    <TableStatus status={status} />
  );
}
