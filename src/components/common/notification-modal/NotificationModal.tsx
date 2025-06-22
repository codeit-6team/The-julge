import NotificationCard from './NotificationCard';
import close from '@/assets/icons/close.svg';
import type { AlertListItem } from '@/api/alertApi';

interface NotificationModalProps {
  data?: AlertListItem[]; // 알림 데이터 배열
  onClose: () => void; // x 버튼을 누를때 실행할 함수
  onMarkAsRead: (alertId: string) => void;
}

/*
 * 알림 모달 컴포넌트입니다.
 * 알림 데이터들을 카드로 표시하며, 스크롤 가능합니다.
 * PC/Tablet에서는 모달 형식으로, 바깥을 클릭하거나 esc를 통해 창을 닫을 수 있습니다.
 * 모바일에서는 닫기 버튼으로 창을 닫을 수 있습니다.
 */

export default function NotificationModal({
  data = [],
  onClose,
  onMarkAsRead,
}: NotificationModalProps) {
  const unreadData = data.filter((alertItem) => alertItem.item.read === false);
  return (
    <div className="flex h-screen w-screen flex-col gap-16 bg-red-10 px-20 py-40 md:h-420 md:w-368 md:rounded-[10px] md:border-1 md:border-gray-30 md:py-24 md:shadow-custom">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-bold">알림 {unreadData.length}개</h1>
        <button onClick={onClose} className="md:hidden">
          <img src={close} alt="닫기" />
        </button>
      </div>
      <div className="scrollbar-hide flex flex-col gap-8 overflow-y-auto">
        {unreadData.length > 0 &&
          unreadData.map((alertItem) => (
            <NotificationCard
              key={alertItem.item.id}
              onMarkAsRead={onMarkAsRead}
              alertId={alertItem.item.id}
              shopId={alertItem.item.shop.item.id}
              noticeId={alertItem.item.notice.item.id}
              status={alertItem.item.result}
              restaurantName={alertItem.item.shop.item.name}
              startsAt={alertItem.item.notice.item.startsAt}
              workhour={alertItem.item.notice.item.workhour}
              createdAt={alertItem.item.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
