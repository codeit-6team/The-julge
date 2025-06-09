import { useNavigate } from 'react-router-dom';
import NotificationCard from './NotificationCard';
import close from '@/assets/icons/close.svg';

interface NotificationItem {
  createdAt: string;                          // 생성 일시 (ISO 8601 문자열) 
  result: 'accepted' | 'rejected';            // 결과 상태 
  read: boolean;                              // 읽음 여부 
  shop: {
    item: {
      name: string;                           // 가게 이름
    };
  };
  notice: {
    item: {
      startsAt: string;                       // 근무 시작 시간 (ISO 8601 문자열) 
      workhour: number;                       // 근무 시간 (시간 단위) 
    };
  };
}
interface NotificationModalProps {
  data: NotificationItem[];                   // 알림 데이터 배열
  count: number;                              // 알림 개수
}

/*
 * 알림 모달 컴포넌트입니다.
 * 알림 데이터들을 카드로 표시하며, 스크롤 가능합니다. 
 * PC/Tablet에서는 모달 형식으로, 바깥을 클릭하거나 esc를 통해 창을 닫을 수 있습니다.
 * 모바일에서는 닫기 버튼으로 창을 닫을 수 있습니다.
 */

export default function NotificationModal({ data, count }: NotificationModalProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col px-20 py-40 bg-red-10 gap-16 h-screen md:py-24 md:border-4 md:border-gray-30 md:rounded-10 md:shadow-custom md:h-420 md:w-368">
      <div className="flex justify-between items-center">
        <h1 className="text-h3 font-bold">알림 {count}개</h1>
        <button onClick={()=> navigate(-1)} className="md:hidden">
          <img src={close} alt="닫기" />
        </button>
      </div>
      <div className="flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        {data.map((data, index) => (
          <NotificationCard
            key={index}
            status={data.result}
            restaurantName={data.shop.item.name}
            startsAt={data.notice.item.startsAt}
            workHour={data.notice.item.workhour}
            createdAt={data.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
