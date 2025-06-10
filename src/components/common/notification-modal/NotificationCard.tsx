import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import calculateTimeDifference from '@/utils/calculateTimeDefference';
import formatWorkTime from '@/utils/formatWorkTime';

interface NotificationCardProps {
  id: string;                                   // 가게 id
  status: 'accepted' | 'rejected';              // 공고 지원 상태
  restaurantName: string;                       // 음식점 이름 
  startsAt: string;                             // 공고 시작 시간 (ISO 8601 문자열)
  workHour: number;                             // 근무 시간 (시간 단위) 
  createdAt: string;                            // 알림 생성 시간 (ISO 8601 문자열) 
}

/*
 * 사용자가 공고에 지원한 결과를 알리는 알림 카드 컴포넌트입니다.
 * 상태에 따라 '승인' 혹은 '거절'로 표시되며,
 * 가게 이름과 알바 시간, 생성 시간을 보여줍니다.
 */

export default function NotificationCard({
  id,
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
  const { role } = useContext(AuthContext);
  const formattedCreatedAt = calculateTimeDifference(createdAt);
  const formattedStatus = status === 'accepted' ? '승인' : '거절';
  const formattedStatusClass =
    status === 'accepted' ? 'text-blue-20' : 'text-red-20';
  return (
    <Link to={role === 'employee' ? '/profile' : `/owner/post/${id}`}>
      <div className="flex flex-col gap-4 md:w-328 py-16 px-12 bg-white border border-gray-20 rounded-[5px] ">
        {status === 'accepted' ? (
          <div className="w-5 h-5 rounded-full bg-blue-20"></div>
        ) : (
          <div className="w-5 h-5 rounded-full bg-red-20"></div>
        )}
        <h2 className="text-body2/22 font-regular">
          {restaurantName} ({formattedTime}) 공고 지원이{' '}
          <span className={formattedStatusClass}>{formattedStatus}</span>
          되었어요.
        </h2>
        <p className="text-caption/16 text-gray-40">{formattedCreatedAt}</p>
      </div>
    </Link>
  );
}
