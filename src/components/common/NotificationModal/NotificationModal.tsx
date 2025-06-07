import NotificationCard from './NotificationCard';
import close from '@/assets/icons/ic_close.svg';

export default function NotificationModal({ data, count }) {
  return (
    <div className="flex flex-col px-5 py-10 bg-red-10 gap-4">
      <div className="flex justify-between">
        <h1>알람 {count}개</h1>
        <button>
          <img src={close} alt="닫기" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <NotificationCard
          status="accepted"
          restaurantName="Mock Data"
          startsAt="2025-05-05T13:30:00.000Z"
          workHour={2}
          createdAt="2025-05-05T13:30:00.000Z"
        />
        <NotificationCard
          status="rejected"
          restaurantName="Mock Data"
          startsAt="2025-05-06T13:30:00.000Z"
          workHour={3}
          createdAt="2025-05-06T13:30:00.000Z"
        />
        <NotificationCard
          status="accepted"
          restaurantName="Mock Data"
          startsAt="2025-05-13T13:30:00.000Z"
          workHour={4}
          createdAt="2025-05-12T13:30:00.000Z"
        />
      </div>
    </div>
  );
}
