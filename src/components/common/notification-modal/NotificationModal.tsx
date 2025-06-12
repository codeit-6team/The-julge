import NotificationCard from './NotificationCard';
import close from '@/assets/icons/close.svg';

interface NotificationItem {
  item: {
    id: string; // 가게 id
    createdAt: string; // 생성 일시 (ISO 8601 문자열)
    result: 'accepted' | 'rejected'; // 결과 상태
    read: boolean; // 읽음 여부
    shop: {
      item: {
        name: string; // 가게 이름
      };
    };
    notice: {
      item: {
        startsAt: string; // 근무 시작 시간 (ISO 8601 문자열)
        workhour: number; // 근무 시간 (시간 단위)
      };
    };
  };
}
interface NotificationModalProps {
  data?: NotificationItem[]; // 알림 데이터 배열
  count?: number; // 알림 개수
  onClose: () => void; // x 버튼을 누를때 실행할 함수
}

/*
 * 알림 모달 컴포넌트입니다.
 * 알림 데이터들을 카드로 표시하며, 스크롤 가능합니다.
 * PC/Tablet에서는 모달 형식으로, 바깥을 클릭하거나 esc를 통해 창을 닫을 수 있습니다.
 * 모바일에서는 닫기 버튼으로 창을 닫을 수 있습니다.
 */

export default function NotificationModal({
  data = [],
  count = 0,
  onClose,
}: NotificationModalProps) {
  return (
    <div className="flex h-screen w-screen flex-col gap-16 bg-red-10 px-20 py-40 md:h-420 md:w-368 md:rounded-[10px] md:border-1 md:border-gray-30 md:py-24 md:shadow-custom">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-bold">알림 {count}개</h1>
        <button onClick={onClose} className="md:hidden">
          <img src={close} alt="닫기" />
        </button>
      </div>
      <div className="scrollbar-hide flex flex-col gap-8 overflow-y-auto">
        {data.length > 0 &&
          data.map((data) => (
            <NotificationCard
              key={data.item.id}
              id={data.item.id}
              status={data.item.result}
              restaurantName={data.item.shop.item.name}
              startsAt={data.item.notice.item.startsAt}
              workhour={data.item.notice.item.workhour}
              createdAt={data.item.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
