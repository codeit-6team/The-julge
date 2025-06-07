import { useNavigate } from 'react-router-dom';
import NotificationCard from './NotificationCard';
import type { NotificationModalProps } from '@/types/notification';
import close from '@/assets/icons/ic_close.svg';

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
