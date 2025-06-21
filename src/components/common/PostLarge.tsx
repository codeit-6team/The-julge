import formatWorkTime from '@/utils/formatWorkTime';
import ic_clock from '@/assets/icons/clock-red.svg';
import ic_location from '@/assets/icons/location-red.svg';
import ic_arrow from '@/assets/icons/arrow-up-white.svg';
import PostImg from '@/assets/images/post-default.png';
import type { NoticeDetailItem } from '@/api/noticeApi';

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

export default function PostLarge({ data }: { data: NoticeDetailItem }) {
  const {
    hourlyPay,
    workhour,
    startsAt,
    closed,
    shop: {
      item: { name, address1, imageUrl, originalHourlyPay },
    },
  } = data;

  const status = getStatus(startsAt, closed);
  const overlayText =
    status === 'ACTIVE' ? '' : status === 'CLOSED' ? '마감 완료' : '지난 공고';

  const dateTime = `${formatWorkTime({ startsAt, workhour })} (${workhour}시간)`;

  const percent = Math.floor(
    ((hourlyPay - originalHourlyPay) / originalHourlyPay) * 100,
  );
  const isHigherPay = percent > 0; // 이전 시급보다 높을 때만 표시

  const background = imageUrl ?? PostImg;

  let badgeBgColor = '';
  if (percent >= 50) {
    badgeBgColor = 'bg-red-40';
  } else if (percent >= 30) {
    badgeBgColor = 'bg-red-30';
  } else if (percent >= 1) {
    badgeBgColor = 'bg-red-20 ';
  }

  return (
    <div className="flex min-h-356 flex-col items-stretch justify-between rounded-xl border border-gray-20 bg-white p-20 md:p-24 lg:flex-row">
      <div className="relative h-178 md:h-360 lg:h-auto lg:w-539">
        <div
          className="h-full w-full rounded-xl bg-cover bg-center"
          style={{ backgroundImage: `url(${background})` }}
        />
        {status === 'ACTIVE' || (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#000000]/70 text-h3 font-bold text-gray-30 md:text-h1">
            {overlayText}
          </div>
        )}
      </div>
      <div className="mt-12 flex flex-col justify-between gap-24 text-black md:mt-16 md:gap-40 lg:w-346">
        <div className="flex flex-col gap-8">
          <div
            className="truncate text-body1/20 font-bold md:text-h3/24"
            title={`${name}`}
          >
            {name}
          </div>
          <div className="flex flex-col gap-8 text-caption/16 font-regular text-gray-50 md:text-body2/22">
            <div className="flex items-center gap-6">
              <img
                src={ic_clock}
                alt="시계 아이콘"
                className="size-16 md:size-20"
              />
              <span>{dateTime}</span>
            </div>
            <div className="flex items-center gap-6">
              <img
                src={ic_location}
                alt="위치 아이콘"
                className="size-16 md:size-20"
              />
              <span>{address1}</span>
            </div>
          </div>
        </div>
        <div
          className="flex flex-col justify-between md:flex-row md:items-center"
          title={`${hourlyPay.toLocaleString()}원${isHigherPay ? `: 기존 시급보다 ${percent}%` : ''}`}
        >
          <div className="truncate text-lg/23 font-bold md:text-h2/29 lg:max-w-110">
            {hourlyPay.toLocaleString()}원
          </div>
          {isHigherPay && status === 'ACTIVE' && (
            <div
              className={`flex h-36 max-w-168 items-center justify-center gap-2 rounded-[20px] p-12 text-body2 font-bold text-white ${badgeBgColor}`}
            >
              <div className="max-w-168 truncate">기존 시급보다 {percent}%</div>
              <img src={ic_arrow} alt="위 화살표" className="h-20 w-20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
