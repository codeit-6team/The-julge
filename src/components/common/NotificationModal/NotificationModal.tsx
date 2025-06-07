import { useNavigate } from 'react-router-dom';
import NotificationCard from './NotificationCard';
import close from '@/assets/icons/ic_close.svg';

/**
 * 개별 알림 항목을 나타내는 인터페이스입니다.
 */
interface NotificationItem {
  item: {
    /** 생성 일시 (ISO 8601 문자열) */
    createdAt: string;

    /** 결과 상태 ('accepted' 또는 'rejected') */
    result: 'accepted' | 'rejected';

    /** 읽음 여부 */
    read: boolean;

    /** 가게 정보 */
    shop: {
      item: {
        /** 가게 이름 */
        name: string;
      };
    };

    /** 공고 정보 */
    notice: {
      item: {
        /** 근무 시작 시간 (ISO 8601 문자열) */
        startsAt: string;

        /** 근무 시간 (시간 단위) */
        workhour: number;
      };
    };
  };
}

/**
 * NotificationModal 컴포넌트에 전달되는 props의 타입입니다.
 */
interface NotificationModalProps {
  /** 알림 데이터 배열 */
  data: NotificationItem[];

  /** 알림 개수 */
  count: number;
}

/**
 * 알림 모달 컴포넌트입니다.
 * 알림 데이터들을 카드로 표시하며, 스크롤 가능합니다. 
 * PC/Tablet에서는 모달 형식으로, 바깥을 클릭하거나 esc를 통해 창을 닫을 수 있습니다.
 * 모바일에서는 닫기 버튼으로 창을 닫을 수 있습니다.
 *
 * @component
 * @param {NotificationModalProps} props - 컴포넌트 props
 * @param {NotificationItem[]} props.data - 알림 항목 배열
 * @param {number} props.count - 알림 개수
 * @returns {JSX.Element} 알림 모달 UI
 */
export default function NotificationModal({ data, count }: NotificationModalProps) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col px-5 py-10 bg-red-10 gap-4 h-screen md:py-6 md:border-1 md:border-gray-30 md:rounded-[10px] md:shadow-custom md:h-[420px] md:w-[368px]">
      <div className="flex justify-between items-center">
        <h1 className="text-h3 font-bold">알림 {count}개</h1>
        <button onClick={()=> navigate(-1)} className="cursor-pointer md:hidden">
          <img src={close} alt="닫기" />
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto scrollbar-hide">
        {data.map((data, index) => (
          <NotificationCard
            key={index}
            status={data.item.result}
            restaurantName={data.item.shop.item.name}
            startsAt={data.item.notice.item.startsAt}
            workHour={data.item.notice.item.workhour}
            createdAt={data.item.createdAt}
          />
        ))}
      </div>
    </div>
  );
}
