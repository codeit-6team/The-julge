import { useNavigate, useLocation } from 'react-router-dom';
import formatWorkTime from '@/utils/formatWorkTime';
import ClockRed from '@/assets/icons/clock-red.svg';
import ClockGray from '@/assets/icons/clock-gray.svg';
import LocationRed from '@/assets/icons/location-red.svg';
import LocationGray from '@/assets/icons/location-gray.svg';
import ArrowUpWhite from '@/assets/icons/arrow-up-white.svg';
import ArrowUpGray from '@/assets/icons/arrow-up-gray.svg';
import ArrowUpRed40 from '@/assets/icons/arrow-up-red40.svg';
import ArrowUpRed30 from '@/assets/icons/arrow-up-red30.svg';
import ArrowUpRed20 from '@/assets/icons/arrow-up-red20.svg';
import PostImg from '@/assets/images/post-default.png';
import type { NoticeShopItem } from '@/api/noticeApi';

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

export default function Post({ data }: { data: NoticeShopItem }) {
  const {
    id: noticeId,
    hourlyPay,
    workhour,
    startsAt,
    closed,
    shop: {
      item: { id: shopId, name, address1, imageUrl, originalHourlyPay },
    },
  } = data;
  const navigate = useNavigate();
  const location = useLocation();
  const status = getStatus(startsAt, closed);
  const isInactive = status !== 'ACTIVE';
  const overlayText = isInactive
    ? status === 'CLOSED'
      ? '마감 완료'
      : '지난 공고'
    : '';

  const dateTime = `${formatWorkTime({ startsAt, workhour })} (${workhour}시간)`;

  const percent = Math.floor(
    ((hourlyPay - originalHourlyPay) / originalHourlyPay) * 100,
  );
  const isHigherPay = percent > 0; // 이전 시급보다 높을 때만 표시

  const clockIcon = isInactive ? ClockGray : ClockRed;
  const locationIcon = isInactive ? LocationGray : LocationRed;

  const background = imageUrl ?? PostImg;

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

  const handleClick = () => {
    const isOwnerPage = location.pathname.startsWith('/owner');

    const path = isOwnerPage
      ? `/owner/post/${shopId}/${noticeId}`
      : `/${shopId}/${noticeId}`;

    navigate(path);
  };
  return (
    <button
      onClick={handleClick}
      className="flex h-261 w-full cursor-pointer flex-col gap-12 rounded-xl border border-gray-20 bg-white p-12 md:h-359 md:gap-20 md:p-16 lg:h-348"
    >
      <div className="relative">
        <div
          className="relative h-84 w-full rounded-xl bg-cover bg-center md:h-171 lg:h-160"
          style={{ backgroundImage: `url(${background})` }}
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
            title={`${name}`}
          >
            {name}
          </div>
          <div
            className={`${isInactive ? 'text-gray-30' : 'text-gray-50'} flex flex-col gap-8 text-caption/16 font-regular md:text-body2/22`}
          >
            <div className="flex gap-6 md:items-center">
              <img
                src={clockIcon}
                alt="시계 아이콘"
                className="size-16 md:size-20"
              />
              <span>{dateTime}</span>
            </div>
            <div className="flex items-center gap-6">
              <img
                src={locationIcon}
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
    </button>
  );
}
