import { useEffect, useState } from 'react';
import type { NoticeWithShopItem } from '@/api/noticeApi';
import Post from '@/components/common/Post';
import Dropdown from '@/components/common/Dropdown';
import { SORT_OPTIONS } from '@/constants/dropdownOptions';
import Pagination from '@/components/common/Pagination';
import Filter from '@/components/common/Filter';

// ===================== 타입 선언 ======================
type FilterValues = {
  address?: string[] | null;
  startsAt?: string | null;
  hourlyPay?: number | null;
};

type NoticeListProps = {
  search?: string;
};

// ===================== 데이터 ========================
const dummyNotices: NoticeWithShopItem[] = [
  {
    id: '1',
    hourlyPay: 12000,
    startsAt: '2025-07-01T12:00:00Z',
    workhour: 5,
    description: '서울시 종로구',
    closed: false,
    shop: {
      item: {
        id: 'shop-1',
        name: '이승민',
        category: '한식',
        address1: '서울시 종로구',
        address2: '서울시 종로구',
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

// ===================== 헬퍼 함수 =====================
const ITEMS_PER_PAGE = 6;

function sortNotices(
  notices: NoticeWithShopItem[],
  sort: string,
): NoticeWithShopItem[] {
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

function countAppliedFilters(filterValues: FilterValues): number {
  let count = 0;
  if (Array.isArray(filterValues.address) && filterValues.address.length > 0)
    count += filterValues.address.length;
  if (filterValues.startsAt) count += 1;
  if (filterValues.hourlyPay) count += 1;
  return count;
}

function filterNotices(
  notices: NoticeWithShopItem[],
  filter: FilterValues,
  search: string,
): NoticeWithShopItem[] {
  return notices.filter((n) => {
    if (filter.address && filter.address.length > 0) {
      if (!filter.address.includes(n.shop.item.address1)) return false;
    }
    if (filter.startsAt) {
      if (new Date(n.startsAt) < new Date(filter.startsAt)) return false;
    }
    if (filter.hourlyPay) {
      if (n.hourlyPay < filter.hourlyPay) return false;
    }
    if (search && !n.shop.item.name.includes(search)) return false;
    return true;
  });
}

// ================== 컴포넌트 =========================
export default function NoticeList({ search = '' }: NoticeListProps) {
  const [allNotices, setAllNotices] = useState<NoticeWithShopItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>(
    SORT_OPTIONS[0],
  );
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const appliedFilterCount = countAppliedFilters(filterValues);

  useEffect(() => {
    setAllNotices(dummyNotices);
    setLoading(false);
  }, []);

  const filteredNotices = filterNotices(allNotices, filterValues, search);
  const sortedNotices = sortNotices(filteredNotices, sort);
  const totalPages = Math.ceil(sortedNotices.length / ITEMS_PER_PAGE);
  const pageNotices = sortedNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleApplyFilter = (values: FilterValues) => {
    setFilterValues(values);
    setCurrentPage(1);
  };

  if (loading) return <div>로딩 중...</div>;
  if (sortedNotices.length === 0) return <div>공고가 없습니다.</div>;

  return (
    <main>
      {/* 맞춤 공고 */}
      {!search && (
        <article className="bg-red-10 px-32 py-60">
          <section className="mx-auto flex max-w-964 flex-col">
            <h2 className="mb-32 text-h1 font-bold">맞춤 공고</h2>
            <div className="flex gap-14 overflow-hidden">
              {sortedNotices.slice(0, 3).map((notice) => (
                <Post key={notice.id + Math.random()} data={notice} />
              ))}
            </div>
          </section>
        </article>
      )}

      {/* 전체 공고 */}
      <article className="px-32 py-60">
        <section className="mx-auto flex max-w-full flex-col gap-32 sm:max-w-964">
          <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
            <h2 className="mb-4 text-h1 font-bold sm:mb-0">
              {search ? (
                <>
                  <span className="text-h1 font-bold text-primary">
                    {search}
                  </span>
                  <span className="text-h1 font-bold">에 대한 공고 목록</span>
                </>
              ) : (
                '전체 공고'
              )}
            </h2>
            <div className="flex gap-10">
              <Dropdown
                options={SORT_OPTIONS}
                placeholder="마감임박순"
                variant="filter"
                selected={sort}
                setSelect={setSort}
              />
              <div className="relative">
                <button
                  className="rounded-md bg-red-30 px-12 py-8 text-body2 text-white"
                  type="button"
                  onClick={() => setFilterOpen(true)}
                >
                  상세필터
                  {appliedFilterCount > 0 && (
                    <span className="ml-2">({appliedFilterCount})</span>
                  )}
                </button>
                {filterOpen && (
                  <div className="absolute top-full right-365 z-50 mt-8">
                    <div className="absolute z-50 mt-2">
                      <Filter
                        open={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        onApply={handleApplyFilter}
                        defaultValues={filterValues}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-32 lg:grid-cols-3">
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
    </main>
  );
}
