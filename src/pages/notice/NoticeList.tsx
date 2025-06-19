import { useEffect, useState } from 'react';
import Post from '@/components/common/Post';
import Dropdown from '@/components/common/Dropdown';
import { SORT_OPTIONS } from '@/constants/dropdownOptions';
import Pagination from '@/components/common/Pagination';
import Filter from '@/components/common/Filter';
import { getNotices } from '@/api/noticeApi';
import type { NoticeWithShopItem } from '@/api/noticeApi';
import { Link } from 'react-router-dom';

// ===================== 타입 선언 ======================
type FilterValues = {
  address?: string[] | null;
  startsAt?: string | null;
  hourlyPay?: number | null;
};

type NoticeListProps = {
  search?: string;
};

// ===================== 상수 =====================
const ITEMS_PER_PAGE = 6;

// ===================== 정렬 맵핑 =====================
const sortMap: Record<
  (typeof SORT_OPTIONS)[number],
  'time' | 'pay' | 'hour' | 'shop'
> = {
  마감임박순: 'time',
  시급많은순: 'pay',
  시간적은순: 'hour',
  가나다순: 'shop',
};

// ===================== 헬퍼 함수 =====================
function countAppliedFilters(filterValues: FilterValues): number {
  let count = 0;
  if (Array.isArray(filterValues.address) && filterValues.address.length > 0)
    count += filterValues.address.length;
  if (filterValues.startsAt) count += 1;
  if (filterValues.hourlyPay) count += 1;
  return count;
}

// ================== 컴포넌트 =========================
export default function NoticeList({ search = '' }: NoticeListProps) {
  const [allNotices, setAllNotices] = useState<NoticeWithShopItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>(
    SORT_OPTIONS[0],
  );
  const [filterValues, setFilterValues] = useState<FilterValues>({});
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const appliedFilterCount = countAppliedFilters(filterValues);

  // ===== 실제 API 호출 useEffect =====
  useEffect(() => {
    setLoading(true);
    setError(null);

    getNotices({
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      limit: ITEMS_PER_PAGE,
      address: filterValues.address?.[0],
      keyword: search,
      startsAtGte: filterValues.startsAt ?? undefined,
      hourlyPayGte: filterValues.hourlyPay ?? undefined,
      sort: sortMap[sort] ?? undefined,
    })
      .then((data) => {
        setAllNotices(data.items.map((item) => item.item));
        setTotalCount(data.count);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search, sort, filterValues, currentPage]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // 필터 적용
  const handleApplyFilter = (values: FilterValues) => {
    setFilterValues(values);
    setCurrentPage(1);
  };

  // ===== 렌더 =====
  if (loading)
    return (
      <div className="flex h-500 items-center justify-center text-h3 text-black">
        로딩 중...
      </div>
    );
  if (error)
    return (
      <div className="flex h-500 items-center justify-center text-h3 text-red-500">
        {error}
      </div>
    );

  return (
    <main>
      {/* 맞춤 공고 (검색 아닐 때만 노출) */}
      {!search && (
        <article className="bg-red-10 px-32 py-60">
          <section className="mx-auto flex max-w-964 flex-col">
            <h2 className="mb-32 text-h1 font-bold">맞춤 공고</h2>
            <div className="flex gap-14 overflow-hidden">
              {allNotices.slice(0, 3).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/shops/${notice.shop.item.id}/notices/${notice.id}`}
                  className="block"
                >
                  <Post data={notice} />
                </Link>
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
          {allNotices.length === 0 ? (
            <div className="flex h-500 items-center justify-center text-h3 text-black">
              등록된 게시물이 없습니다.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-2 sm:gap-x-14 sm:gap-y-32 lg:grid-cols-3">
                {allNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    to={`/shops/${notice.shop.item.id}/notices/${notice.id}`}
                    className="block"
                  >
                    <Post data={notice} />
                  </Link>
                ))}
              </div>
              <div className="mt-24">
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </>
          )}
        </section>
      </article>
    </main>
  );
}
