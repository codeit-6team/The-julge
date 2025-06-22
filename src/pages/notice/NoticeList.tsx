import { useCallback, useContext, useEffect, useState } from 'react';
import Post from '@/components/common/Post';
import Dropdown from '@/components/common/Dropdown';
import { SORT_OPTIONS } from '@/constants/dropdownOptions';
import Pagination from '@/components/common/Pagination';
import Filter from '@/components/common/Filter';
import { getNotices } from '@/api/noticeApi';
import type { NoticeShopItem } from '@/api/noticeApi';
import Footer from '@/components/layout/Footer';
import Modal from '@/components/common/Modal';
import { getUser } from '@/api/userApi';
import { AuthContext } from '@/context/AuthContext';

type FilterValues = {
  address?: string[] | null;
  startsAt?: string | null;
  hourlyPay?: number | null;
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
export default function NoticeList({ search = '' }: { search?: string }) {
  const [allNotices, setAllNotices] = useState<NoticeShopItem[]>([]); // 현재 페이지에 노출할 공고 목록
  const [totalCount, setTotalCount] = useState(0); // 전체 공고 수
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number] | null>(
    SORT_OPTIONS[0],
  ); // 정렬(드롭다운 값)
  const [filterValues, setFilterValues] = useState<FilterValues>({}); // 상세필터 상태값
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지(페이지네이션)
  const [filterOpen, setFilterOpen] = useState(false); // 필터 모달 오픈
  const [loading, setLoading] = useState(false); // 로딩 에러처리
  const [error, setError] = useState<string | null>(null); // 로딩 에러처리
  const [recommendedNotices, setRecommendedNotices] = useState<
    NoticeShopItem[]
  >([]); // 맞춤 공고 보이는 목록
  const [shouldShowEmpty, setShouldShowEmpty] = useState(false); // 깜빡임 방지용
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useContext(AuthContext);

  // 지난 공고 안보이게 처리
  const getTomorrowISOString = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString();
  };

  // 기본 공고 가져오기
  const fetchDefaultNotices = useCallback(async (): Promise<
    NoticeShopItem[]
  > => {
    const result = await getNotices({
      offset: 0,
      limit: 9,
      startsAtGte: getTomorrowISOString(),
      sort: 'shop',
    });
    return result.items.map((i) => i.item).filter((item) => !item.closed);
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      setShouldShowEmpty(false);

      const rawQuery = {
        offset: (currentPage - 1) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
        address: filterValues.address,
        keyword: search,
        startsAtGte: filterValues.startsAt ?? getTomorrowISOString(),
        hourlyPayGte: filterValues.hourlyPay,
        sort: sort ? sortMap[sort] : undefined,
      };

      const cleanedQuery = Object.fromEntries(
        Object.entries(rawQuery).filter(([, v]) => v !== undefined && v !== ''),
      );

      try {
        const data = await getNotices(cleanedQuery);
        setAllNotices(data.items.map((item) => item.item));
        setTotalCount(data.count);
        setShouldShowEmpty(true);
      } catch (error) {
        setError((error as Error).message);
        setShowModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [search, sort, filterValues, currentPage]);

  // 유저 위치 기반 맞춤 공고 추천
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const userId = localStorage.getItem('userId');

        // 로그아웃 상태 -> 기본 공고
        if (!userId || !isLoggedIn) {
          const notices = await fetchDefaultNotices();
          setRecommendedNotices(notices);
          return;
        }

        // 로그인 상태 -> 선호 지역
        const userInfo = await getUser(userId);
        const preferredAddress = userInfo.item.address;

        const result = await getNotices({
          offset: 0,
          limit: 9,
          startsAtGte: getTomorrowISOString(),
          ...(preferredAddress
            ? { address: preferredAddress }
            : { sort: 'shop' }),
        });

        setRecommendedNotices(
          result.items.map((i) => i.item).filter((item) => !item.closed),
        );
      } catch (error) {
        console.error('추천 공고 에러', error);
        setRecommendedNotices([]);
      }
    };

    fetchRecommended();
  }, [search, fetchDefaultNotices, isLoggedIn]);

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
      <div className="flex min-h-[calc(100vh-102px)] items-center justify-center md:min-h-[calc(100vh-70px)]">
        <div className="size-100 animate-spin rounded-full border-8 border-gray-200 border-t-primary" />
      </div>
    );

  return (
    <>
      {showModal && error && (
        <Modal
          onClose={() => setShowModal(false)}
          onButtonClick={() => setShowModal(false)}
        >
          {error}
        </Modal>
      )}
      <main>
        {/* 맞춤 공고 */}
        {!search && (
          <article className="bg-red-10 py-40 pl-12 md:py-60 md:pl-32 lg:px-0">
            <section className="flex flex-col gap-16 md:gap-32 lg:mx-auto lg:max-w-964">
              <h2 className="text-h3/24 font-bold md:text-h1/34">맞춤 공고</h2>
              <div className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth md:gap-14">
                {recommendedNotices.slice(0, 9).map((notice) => (
                  <div
                    key={notice.id}
                    className="block last:pr-12 md:last:pr-32 lg:last:pr-0"
                  >
                    <div data-card className="min-w-171 md:min-w-312">
                      <Post data={notice} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>
        )}

        {/* 전체 공고 */}
        <article className="px-12 pt-40 pb-68 md:px-32 md:pt-60 md:pb-48 lg:mx-auto lg:max-w-964 lg:px-0">
          <section className="flex flex-col gap-16 md:gap-32">
            <div className="flex flex-col gap-16 md:flex-row md:justify-between">
              <h2 className="text-h3/25 font-bold md:text-h1/34">
                {search ? (
                  <>
                    <span className="text-h3/24 font-bold text-primary md:text-h1/34">
                      {search}
                    </span>
                    <span className="text-h3/24 font-bold md:text-h1/34">
                      에 대한 공고 목록
                    </span>
                  </>
                ) : (
                  '전체 공고'
                )}
              </h2>
              <div className="flex items-center gap-10">
                <Dropdown
                  options={SORT_OPTIONS}
                  variant="filter"
                  selected={sort}
                  setSelect={setSort}
                />
                <div className="relative">
                  <button
                    className="min-w-79 rounded-[5px] bg-red-30 px-12 py-6 text-body2/18 text-white"
                    type="button"
                    onClick={() => setFilterOpen(true)}
                  >
                    상세 필터
                    {appliedFilterCount > 0 && (
                      <span className="ml-2">({appliedFilterCount})</span>
                    )}
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 z-50 mt-5">
                      <Filter
                        open={filterOpen}
                        onClose={() => setFilterOpen(false)}
                        onApply={handleApplyFilter}
                        defaultValues={filterValues}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {shouldShowEmpty && allNotices.length === 0 ? (
              <div className="flex h-500 items-center justify-center text-h3 text-black">
                등록된 게시물이 없습니다.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:gap-x-14 md:gap-y-32 lg:grid-cols-3">
                  {allNotices.map((notice) => (
                    <div key={notice.id} className="block">
                      <Post data={notice} />
                    </div>
                  ))}
                </div>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </section>
        </article>
        <Footer />
      </main>
    </>
  );
}
