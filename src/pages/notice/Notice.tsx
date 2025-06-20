import ClockRed from '@/assets/icons/clock-red.svg';
import LocationRed from '@/assets/icons/location-red.svg';
import ArrowUpWhite from '@/assets/icons/arrow-up-white.svg';
import Button from '@/components/common/Button';
import Post from '@/components/common/Post';
import { useState, useEffect } from 'react';

const dummyData: NoticeWithShopItem = {
  id: '1',
  hourlyPay: 15000,
  startsAt: '2025-07-01T12:00:00Z',
  workhour: 4,
  description: '직접 입력한 임시 공고 설명입니다.',
  closed: false,
  shop: {
    item: {
      id: 'shop-1',
      name: '테스트 식당',
      category: '한식',
      address1: '서울시 강남구',
      address2: '상세주소',
      description: '이승민',
      imageUrl: null,
      originalHourlyPay: 13000,
    },
    href: '',
  },
};

// 최근에 본 공고 6개 더미
const recentDummies: NoticeWithShopItem[] = [
  {
    id: 'r1',
    hourlyPay: 12000,
    startsAt: '2025-07-10T09:00:00Z',
    workhour: 4,
    description: '강남역 인근 한식집 서빙 알바',
    closed: false,
    shop: {
      item: {
        id: 's1',
        name: '강남한식당',
        category: '한식',
        address1: '서울시 강남구',
        address2: '테헤란로 123',
        description: '맛집 한식당',
        imageUrl: null,
        originalHourlyPay: 11000,
      },
      href: '',
    },
  },
  {
    id: 'r2',
    hourlyPay: 10500,
    startsAt: '2025-07-09T16:00:00Z',
    workhour: 5,
    description: '카페 아르바이트 모집',
    closed: false,
    shop: {
      item: {
        id: 's2',
        name: '카페24',
        category: '카페',
        address1: '서울시 마포구',
        address2: '',
        description: '분위기 좋은 카페',
        imageUrl: null,
        originalHourlyPay: 10000,
      },
      href: '',
    },
  },
  {
    id: 'r3',
    hourlyPay: 13000,
    startsAt: '2025-07-15T10:00:00Z',
    workhour: 6,
    description: '주방보조 단기 알바',
    closed: false,
    shop: {
      item: {
        id: 's3',
        name: '마포고기집',
        category: '고기집',
        address1: '서울시 마포구',
        address2: '합정동 456',
        description: '고기집',
        imageUrl: null,
        originalHourlyPay: 12000,
      },
      href: '',
    },
  },
  {
    id: 'r4',
    hourlyPay: 14000,
    startsAt: '2025-07-17T13:00:00Z',
    workhour: 7,
    description: '맥도날드 평일 알바',
    closed: false,
    shop: {
      item: {
        id: 's4',
        name: '맥도날드 신촌점',
        category: '패스트푸드',
        address1: '서울시 서대문구',
        address2: '',
        description: '신촌점',
        imageUrl: null,
        originalHourlyPay: 12000,
      },
      href: '',
    },
  },
  {
    id: 'r5',
    hourlyPay: 9500,
    startsAt: '2025-07-11T08:00:00Z',
    workhour: 3,
    description: '편의점 주말 알바',
    closed: false,
    shop: {
      item: {
        id: 's5',
        name: 'GS25 성수점',
        category: '편의점',
        address1: '서울시 성동구',
        address2: '',
        description: 'GS25',
        imageUrl: null,
        originalHourlyPay: 9500,
      },
      href: '',
    },
  },
  {
    id: 'r6',
    hourlyPay: 12500,
    startsAt: '2025-07-20T18:00:00Z',
    workhour: 5,
    description: '야간 근무 단기 알바',
    closed: false,
    shop: {
      item: {
        id: 's6',
        name: '롯데리아 잠실점',
        category: '패스트푸드',
        address1: '서울시 송파구',
        address2: '',
        description: '롯데리아',
        imageUrl: null,
        originalHourlyPay: 11000,
      },
      href: '',
    },
  },
];

export default function NoticeList({ data }: { data?: NoticeWithShopItem }) {
  const [recentNotices, setRecentNotices] = useState<NoticeWithShopItem[]>([]);
  const displayData = data ?? dummyData;

  // 구조분해
  const {
    hourlyPay,
    workhour,
    startsAt,
    closed,
    shop: {
      item: { name, address1, imageUrl, originalHourlyPay, description },
    },
  } = displayData;

  useEffect(() => {
    const raw = localStorage.getItem('RECENT_NOTICES');
    if (raw) setRecentNotices(JSON.parse(raw));
  }, []);

  return (
    <div className="flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col gap-32 py-60">
        <div className="flex flex-col items-start">
          <h2 className="text-body1 font-bold text-primary">식당</h2>
          <div className="text-h1 text-black">{name}</div>
        </div>
        <div className="flex h-356 w-963 gap-30 rounded-xl border border-gray-20 bg-white p-24">
          <div className="h-308 w-539">이미지</div>
          <div className="flex w-346 flex-col justify-between pt-16">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-8">
                <h2 className="text-body1 font-bold text-primary">시급</h2>
                <div className="justify-row flex flex-col gap-8 md:flex-row md:items-center">
                  <div className="text-h1 text-black">
                    {hourlyPay.toLocaleString()}원
                  </div>
                  <div className="flex items-center justify-center rounded-[20px] bg-primary p-12 text-body2 font-bold text-white">
                    <div>기존 시급보다</div>
                    <img
                      src={ArrowUpWhite}
                      alt="위 화살표"
                      className="h-20 w-20"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6 text-gray-50">
                <img src={ClockRed} alt="시계 아이콘" className="size-20" />
                <span>{workhour}</span>
              </div>
              <div className="flex items-center gap-6 text-gray-50">
                <img src={LocationRed} alt="위치 아이콘" className="size-20" />
                <span>{address1}</span>
              </div>
              <div className="text-body1 font-regular text-black">
                {description}
              </div>
            </div>
            <Button size="large" solid={true} className="">
              신청하기
            </Button>
          </div>
        </div>
        <div className="flex w-963 flex-col gap-12 rounded-xl bg-gray-10 p-32">
          <div>공고 설명</div>
          <div>공고 내용</div>
        </div>
      </div>
      <div className="w-963">
        <div className="flex flex-col items-start gap-32 py-60">
          <h2 className="text-h1 text-black">최근에 본 공고</h2>
          <div className="grid grid-cols-3 gap-x-14 gap-y-32">
            {recentNotices.length === 0 ? (
              <div className="text-gray-30">최근 본 공고가 없습니다.</div>
            ) : (
              recentNotices.map((item) => <Post key={item.id} data={item} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
