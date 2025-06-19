import { useEffect, useState } from 'react';
import type { NoticeWithShopItem } from '@/api/noticeApi';
import Post from '@/components/common/Post';
import Dropdown from '@/components/common/Dropdown';
import { SORT_OPTIONS } from '@/constants/dropdownOptions';
import Pagination from '@/components/common/Pagination';
import Filter from '@/components/common/Filter';

const dummyNotices: NoticeWithShopItem[] = [
  {
    id: '1',
    hourlyPay: 12000,
    startsAt: '2025-07-01T12:00:00Z',
    workhour: 5,
    description: '김밥천국 강남점 공고',
    closed: false,
    shop: {
      item: {
        id: 'shop-1',
        name: '김밥천국 강남점',
        category: '한식',
        address1: '서울시 종로구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 11000,
      },
      href: '',
    },
  },
  {
    id: '2',
    hourlyPay: 11000,
    startsAt: '2025-07-05T09:00:00Z',
    workhour: 6,
    description: '맥도날드 강남점 공고',
    closed: false,
    shop: {
      item: {
        id: 'shop-2',
        name: '맥도날드 강남점',
        category: '패스트푸드',
        address1: '서울시 중구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 10500,
      },
      href: '',
    },
  },
  {
    id: '3',
    hourlyPay: 10000,
    startsAt: '2025-07-10T13:00:00Z',
    workhour: 4,
    description: '스타벅스 역삼점 공고',
    closed: true,
    shop: {
      item: {
        id: 'shop-3',
        name: '스타벅스 역삼점',
        category: '카페',
        address1: '서울시 강북구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 9500,
      },
      href: '',
    },
  },
  {
    id: '3',
    hourlyPay: 10000,
    startsAt: '2025-07-10T13:00:00Z',
    workhour: 4,
    description: '스타벅스 역삼점 공고',
    closed: true,
    shop: {
      item: {
        id: 'shop-3',
        name: '스타벅스 역삼점',
        category: '카페',
        address1: '서울시 도봉구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 9510,
      },
      href: '',
    },
  },
  {
    id: '3',
    hourlyPay: 10000,
    startsAt: '2025-07-10T13:00:00Z',
    workhour: 4,
    description: '스타벅스 역삼점 공고',
    closed: true,
    shop: {
      item: {
        id: 'shop-3',
        name: '스타벅스 역삼점',
        category: '카페',
        address1: '서울시 노원구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 7500,
      },
      href: '',
    },
  },
  {
    id: '3',
    hourlyPay: 10000,
    startsAt: '2025-07-10T13:00:00Z',
    workhour: 4,
    description: '스타벅스 역삼점 공고',
    closed: true,
    shop: {
      item: {
        id: 'shop-3',
        name: '스타벅스 역삼점',
        category: '카페',
        address1: '서울시 종로구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 9505,
      },
      href: '',
    },
  },
  {
    id: '3',
    hourlyPay: 10000,
    startsAt: '2025-07-10T13:00:00Z',
    workhour: 4,
    description: '스타벅스 역삼점 공고',
    closed: true,
    shop: {
      item: {
        id: 'shop-3',
        name: '스타벅스 역삼점',
        category: '카페',
        address1: '서울시 용산구',
        address2: '',
        description: '',
        imageUrl: null,
        originalHourlyPay: 12000,
      },
      href: '',
    },
  },
];

const ITEMS_PER_PAGE = 6;

function sortNotices(notices: NoticeWithShopItem[], sort: string) {
  if (sort === '마감임박순') {
    return [...notices].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  }
  if (sort === '시급많은순') {
    return [...notices].sort((a, b) => b.hourlyPay - a.hourlyPay);
  }
  if (sort === '시간적은순') {
    return [...notices].sort((a, b) => a.workhour - b.workhour);
  }
  if (sort === '가나다순') {
    return [...notices].sort((a, b) =>
      a.shop.item.name.localeCompare(b.shop.item.name),
    );
  }
  return notices;
}

export default function NoticeList() {
  const [allNotices, setAllNotices] = useState<NoticeWithShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>(
    SORT_OPTIONS[0],
  );
  // ↓ 정렬도 이렇게
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterValues, setFilterValues] = useState({});

  useEffect(() => {
    setAllNotices(dummyNotices);
    setLoading(false);
  }, []);

  // 정렬은 렌더링 때마다 계산 (필터 추가시에도 적용 편함)
  const sortedNotices = sortNotices(allNotices, sort); // sort는 string!
  const totalPages = Math.ceil(sortedNotices.length / ITEMS_PER_PAGE);
  const pageNotices = sortedNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleApplyFilter = (values: any) => {
    setFilterValues(values);
    // 여기에 조건 맞게 allNotices를 setAllNotices로 변경해주면 됨(필터 완성 시)
    setCurrentPage(1);
  };

  if (loading) return <div>로딩 중...</div>;
  if (sortedNotices.length === 0) return <div>공고가 없습니다.</div>;

  return (
    <main>
      {/* 맞춤 공고 */}
      <article className="bg-red-10 py-60">
        <section className="mx-auto flex max-w-964 flex-col">
          <h2 className="mb-32 text-h1 font-bold">맞춤 공고</h2>
          <div className="flex gap-14 overflow-hidden">
            {sortedNotices.slice(0, 3).map((notice) => (
              <Post key={notice.id + Math.random()} data={notice} />
            ))}
          </div>
        </section>
      </article>

      {/* 전체 공고 */}
      <article className="py-60">
        <section className="mx-auto flex max-w-964 flex-col gap-32">
          <div className="flex justify-between">
            <h2 className="mb-32 text-h1 font-bold">전체 공고</h2>
            <div className="flex items-center gap-10">
              <Dropdown
                options={SORT_OPTIONS}
                placeholder="마감임박순"
                variant="filter"
                selected={sort}
                setSelect={setSort}
              />
              <button
                className="rounded-md bg-red-30 px-12 py-8 text-body2 text-white"
                type="button"
                onClick={() => setFilterOpen(true)}
              >
                상세필터
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-14 gap-y-32">
            {pageNotices.map((notice) => (
              <Post key={notice.id + Math.random()} data={notice} />
            ))}
          </div>
          <div className="mt-24">
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </section>
      </article>
      {filterOpen && (
        <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center bg-black/20">
          <Filter
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={handleApplyFilter}
            defaultValues={filterValues}
          />
        </div>
      )}
    </main>
  );
}
