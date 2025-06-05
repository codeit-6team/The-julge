import calculateTimeDifference from '@/utils/calculateTimeDefference';
import formatWorkTime from '@/utils/formatWorkTime';

export default function NotificationCard({
  status,
  restaurantName,
  startsAt,
  workHour,
  createdAt,
}) {
  const formattedTime = formatWorkTime({
    startsAt,
    workHour,
  });
  const formattedCreatedAt = calculateTimeDifference(createdAt);
  const formattedStatus = status === 'accepted' ? '승인' : '거절';
  const formattedStatusClass =
    status === 'accepted' ? 'text-blue-20' : 'text-red-20';
  return (
    <div className="flex flex-col gap-1 w-[328px] py-4 px-3 ">
      {status === 'accepted' ? (
        <div className="w-[5px] h-[5px] rounded-full bg-blue-20"></div>
      ) : (
        <div className="w-[5px] h-[5px] rounded-full bg-red-20"></div>
      )}
      <h2 className="text-body2/[22px] font-regular">
        {restaurantName} {formattedTime} 공고 지원이{' '}
        <span className={formattedStatusClass}>{formattedStatus}</span>
        되었어요.
      </h2>
      <p className="text-caption/4 text-gray-40">{formattedCreatedAt}</p>
    </div>
  );
}
