import calculateTimeDifference from '@/utils/calculateTimeDefference';
import formatWorkTime from '@/utils/formatWorkTime';

/**
 * 알림 카드에 필요한 props 정의
 */
interface NotificationCardProps {
  /** 공고 지원 상태 ('accepted' | 'rejected') */
  status: 'accepted' | 'rejected';

  /** 음식점 이름 */
  restaurantName: string;

  /** 공고 시작 시간 (ISO 8601 문자열) */
  startsAt: string;

  /** 근무 시간 (시간 단위) */
  workHour: number;

  /** 알림 생성 시간 (ISO 8601 문자열) */
  createdAt: string;
}

/**
 * 사용자가 공고에 지원한 결과를 알리는 알림 카드 컴포넌트입니다.
 *
 * 상태에 따라 '승인' 혹은 '거절'로 표시되며,
 * 가게 이름과 알바 시간, 생성 시간을 보여줍니다.
 * 
 * @component
 * @param {NotificationCardProps} props - 알림 카드에 전달되는 props
 * @returns {JSX.Element} 렌더링된 알림 카드
 */
export default function NotificationCard({
  status,
  restaurantName,
  startsAt,
  workHour,
  createdAt,
}: NotificationCardProps) {
  const formattedTime = formatWorkTime({
    startsAt,
    workHour,
  });
  const formattedCreatedAt = calculateTimeDifference(createdAt);
  const formattedStatus = status === 'accepted' ? '승인' : '거절';
  const formattedStatusClass =
    status === 'accepted' ? 'text-blue-20' : 'text-red-20';
  return (
    <div className="flex flex-col gap-1 md:w-[328px] py-4 px-3 bg-white border border-gray-20 rounded-[5px] ">
      {status === 'accepted' ? (
        <div className="w-[5px] h-[5px] rounded-full bg-blue-20"></div>
      ) : (
        <div className="w-[5px] h-[5px] rounded-full bg-red-20"></div>
      )}
      <h2 className="text-body2/[22px] font-regular">
        {restaurantName} ({formattedTime}) 공고 지원이{' '}
        <span className={formattedStatusClass}>{formattedStatus}</span>
        되었어요.
      </h2>
      <p className="text-caption/4 text-gray-40">{formattedCreatedAt}</p>
    </div>
  );
}
