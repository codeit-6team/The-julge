import ClockRed from '@/assets/icons/clock-red.svg';
import ClockGray from '@/assets/icons/clock-gray.svg';
import LocationRed from '@/assets/icons/location-red.svg';
import LocationGray from '@/assets/icons/location-gray.svg';
import ArrowUpWhite from '@/assets/icons/arrow-up-white.svg';
import ArrowUpGray from '@/assets/icons/arrow-up-gray.svg';
import ArrowUpRed40 from '@/assets/icons/arrow-up-red40.svg';
import ArrowUpRed30 from '@/assets/icons/arrow-up-red30.svg';
import ArrowUpRed20 from '@/assets/icons/arrow-up-red20.svg';

interface PostProps {
  imageUrl: string;
  title: string;
  startsAt: string; // 근무 시작 시간
  workhour: number; // 근무 시간
  location: string;
  hourlyPay: number; // 시급
  originalHourlyPay: number; // 전에 등록한 시급
  closed: boolean; // 마감 여부
}

// 상태 계산
function getStatus(
  startsAt: string,
  closed: boolean,
): 'ACTIVE' | 'CLOSED' | 'EXPIRED' {
  const now = new Date();
  const startDate = new Date(startsAt);

  if (closed) return 'CLOSED'; // 인원 다 찼으면 마감
  if (now >= startDate) return 'EXPIRED'; // 기간 종료되면 마감
  return 'ACTIVE';
}

// 날짜 포맷
function formatDate(startsAt: string, workhour: number): string {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + workhour * 60 * 60 * 1000);

  const yyyy = start.getFullYear();
  const mm = String(start.getMonth() + 1).padStart(2, '0'); // padStart 자리 수를 맞추는 용도
  const dd = String(start.getDate()).padStart(2, '0');
  const startHour = String(start.getHours()).padStart(2, '0');
  const startMin = String(start.getMinutes()).padStart(2, '0');

  const endHour = String(end.getHours()).padStart(2, '0');
  const endMin = String(end.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${startHour}:${startMin}~${endHour}:${endMin} (${workhour}시간)`;
}

export default function Post({
  imageUrl,
  title,
  startsAt,
  workhour,
  location,
  hourlyPay,
  originalHourlyPay,
  closed,
}: PostProps) {
  const status = getStatus(startsAt, closed);
  const isInactive = status === 'CLOSED' || status === 'EXPIRED';
  const overlayText =
    status === 'CLOSED' ? '마감 완료' : status === 'EXPIRED' ? '지난 공고' : '';

  const dateTime = formatDate(startsAt, workhour);

  const payDiff = hourlyPay - originalHourlyPay; // 이전 공고 시급과 현재 시급 차이 계산
  const percent = Math.floor((payDiff / originalHourlyPay) * 100); // 몇 % 올랐는지 계산
  const isHigherPay = percent > 0; // 이전 시급보다 높을 때만 표시

  const clockIcon = isInactive ? ClockGray : ClockRed;
  const locationIcon = isInactive ? LocationGray : LocationRed;

  let badgeBgColor = '';
  let badgeTextColor = '';
  let arrowIcon = '';

  if (isInactive) {
    badgeBgColor = 'bg-gray-20';
    badgeTextColor = 'text-gray-20';
    arrowIcon = ArrowUpGray;
  } else {
    if (percent >= 50) {
      badgeBgColor = 'bg-red-40';
      badgeTextColor = 'text-red-40';
      arrowIcon = ArrowUpRed40;
    } else if (percent >= 30) {
      badgeBgColor = 'bg-red-30';
      badgeTextColor = 'text-red-30';
      arrowIcon = ArrowUpRed30;
    } else if (percent >= 1) {
      badgeBgColor = 'bg-red-20 ';
      badgeTextColor = 'text-red-20';
      arrowIcon = ArrowUpRed20;
    }
  }

  return (
    <div className="flex h-261 w-171 cursor-pointer flex-col gap-12 rounded-xl border border-gray-20 bg-white p-12 md:h-359 md:w-332 md:gap-20 md:p-16 lg:h-348 lg:w-312">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="relative w-full rounded-xl object-cover"
        />
        {isInactive && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#000000]/70 text-h3 font-bold text-gray-30 md:text-h1">
            {overlayText}
          </div>
        )}
      </div>
      <div
        className={` ${isInactive ? 'text-gray-30' : 'text-black'} flex flex-col gap-16`}
      >
        <div className="flex flex-col gap-8">
          <div
            className="truncate text-body1/20 font-bold md:text-h3/24"
            title={`${title}`}
          >
            {title}
          </div>
          <div
            className={`${isInactive ? 'text-gray-30' : 'text-gray-50'} flex gap-6 text-caption/16 font-regular md:items-center md:text-body2/22 lg:items-center lg:text-body2/22`}
          >
            <img
              src={clockIcon}
              alt="시계 아이콘"
              className="h-16 w-16 md:h-20 md:w-20"
            />
            <span>{dateTime}</span>
          </div>
          <div
            className={`${isInactive ? 'text-gray-30' : 'text-gray-50'} flex gap-6 text-caption/16 font-regular md:items-center md:text-body2/22 lg:items-center lg:text-body2/22`}
          >
            <img
              src={locationIcon}
              alt="위치 아이콘"
              className="h-16 w-16 md:h-20 md:w-20"
            />
            <span>{location}</span>
          </div>
        </div>
        <div
          className="flex flex-col justify-between md:flex-row md:items-center"
          title={`${hourlyPay.toLocaleString()}원 : 기존 시급보다 ${percent}%`}
        >
          <div className="truncate text-lg/23 font-bold md:text-h2/29 lg:max-w-110">
            {hourlyPay.toLocaleString()}원
          </div>
          {isHigherPay && (
            <>
              {/*데스크탑, 태블릿*/}
              <div
                className={`hidden h-36 max-w-168 items-center justify-center gap-2 rounded-[20px] p-12 text-body2 font-bold text-white md:flex ${badgeBgColor}`}
              >
                <div className="max-w-168 truncate">
                  기존 시급보다 {percent}%
                </div>
                <img src={ArrowUpWhite} alt="위 화살표" className="h-20 w-20" />
              </div>
              {/*모바일*/}
              <div
                className={`flex items-center gap-2 text-caption/16 md:hidden ${badgeTextColor}`}
              >
                <div className="truncate">기존 시급보다 {percent}%</div>
                <img src={arrowIcon} alt="위 화살표" className="h-16 w-16" />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
