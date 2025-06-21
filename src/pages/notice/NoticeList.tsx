import { useEffect, useState } from 'react';
import Post from '@/components/common/Post';
import Dropdown from '@/components/common/Dropdown';
import { SORT_OPTIONS } from '@/constants/dropdownOptions';
import Pagination from '@/components/common/Pagination';
import Filter from '@/components/common/Filter';
import { getNotices } from '@/api/noticeApi';
import type { NoticeWithShopItem } from '@/api/noticeApi';
import { Link } from 'react-router-dom';

type FilterValues = {
  address?: string[] | null;
  startsAt?: string | null;
  hourlyPay?: number | null;
};

type NoticeListProps = {
  search?: string;
};

// 상수
const ITEMS_PER_PAGE = 6;

// 정렬 맵핑
const sortMap: Record<
  (typeof SORT_OPTIONS)[number],
  'time' | 'pay' | 'hour' | 'shop'
> = {
  마감임박순: 'time',
  시급많은순: 'pay',
  시간적은순: 'hour',
  가나다순: 'shop',
};

// 필터가 몇 개 적용되었는지 계산해서 뱃지 등에 표시해줌
function countAppliedFilters(filterValues: FilterValues): number {
  let count = 0;
  if (Array.isArray(filterValues.address) && filterValues.address.length > 0)
    count += filterValues.address.length;
  if (filterValues.startsAt) count += 1;
  if (filterValues.hourlyPay) count += 1;
  return count;
}

// 컴포넌트
export default function NoticeList({ search = '' }: NoticeListProps) {
  const [allNotices, setAllNotices] = useState<NoticeWithShopItem[]>([]); // 현재 페이지에 노출할 공고 목록
  const [totalCount, setTotalCount] = useState(0); // 전체 공고 수
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]>(
    SORT_OPTIONS[0],
  ); // 정렬(드롭다운 값)
  const [filterValues, setFilterValues] = useState<FilterValues>({}); // 상세필터 상태값
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지(페이지네이션)
  const [filterOpen, setFilterOpen] = useState<boolean>(false); // 필터 모달 오픈
  const [loading, setLoading] = useState(false); // 로딩 에러처리
  const [error, setError] = useState<string | null>(null); // 로딩 에러처리

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

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE); // 페이지네이션
  const appliedFilterCount = countAppliedFilters(filterValues); // 필터 적용

  // 필터 적용
  const handleApplyFilter = (values: FilterValues) => {
    setFilterValues(values);
    setCurrentPage(1);
  };

  // 렌더
  if (loading)
    return (
      <div className="flex h-500 items-center justify-center text-h3 text-black">
        잠시만 기다려주세요
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
      {/* 맞춤 공고 */}
      {!search && (
        <article className="bg-red-10 py-40 pl-12">
          <section className="flex flex-col gap-16">
            <h2 className="text-h3/24 font-bold">맞춤 공고</h2>
            <div className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth">
              {allNotices.slice(0, 9).map((notice) => (
                <Link
                  key={notice.id}
                  to={`/shops/${notice.shop.item.id}/notices/${notice.id}`}
                  className="block last:pr-12"
                >
                  <Post data={notice} />
                </Link>
              ))}
            </div>
          </section>
        </article>
      )}

      {/* 전체 공고 */}
      <article className="px-12 pt-40 pb-80">
        <section className="flex flex-col gap-16">
          <div className="flex flex-col gap-16">
            <h2 className="text-h3/25 font-bold">
              {search ? (
                <>
                  <span className="text-h3/24 font-bold text-primary">
                    {search}
                  </span>
                  <span className="text-h3/24 font-bold">
                    에 대한 공고 목록
                  </span>
                </>
              ) : (
                '전체 공고'
              )}
            </h2>
            <div className="flex gap-10">
              <Dropdown
                options={SORT_OPTIONS}
                variant="filter"
                selected={sort}
                setSelect={setSort}
              />
              <div className="relative">
                <button
                  className="rounded-[5px] bg-red-30 px-12 py-6 text-body2/18 text-white"
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
