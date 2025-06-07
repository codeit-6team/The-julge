import ArrowLeft from '../../../assets/icons/arrow-left.svg';
import ArrowLeftGray from '../../../assets/icons/arrow-left-gray.svg';
import ArrowRight from '../../../assets/icons/arrow-right.svg';
import ArrowRightGray from '../../../assets/icons/arrow-right-gray.svg';

interface Props {
  totalPages: number;
  currentPage: number;
  onChangePage: (pageNumber: number) => void;
}

export default function Pagination({
  totalPages,
  currentPage,
  onChangePage,
}: Props) {
  // 페이지 번호 버튼 렌더링 함수
  const renderPageNumbers = () => {
    let startPage = 1;

    // 현재 페이지가 4보다 크고 전체 페이지가 7 초과일 경우 앞에서 3개 잘라서 보여줌
    if (totalPages > 7 && currentPage > 4) {
      startPage = currentPage - 3;
    }

    // 최대 7개까지만 보임
    const endPage = Math.min(startPage + 6, totalPages);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index,
    ).map((pageNumber) => (
      <button
        key={pageNumber}
        type="button"
        onClick={() => onChangePage(pageNumber)}
        className={`w-10 h-10 rounded flex items-center justify-center text-sm
          ${
            currentPage === pageNumber
              ? 'bg-red-500 text-white font-bold'
              : 'bg-white text-black hover:bg-gray-100'
          }
        `}
      >
        {pageNumber}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* 이전 버튼 */}
      <button
        type="button"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <img
          src={currentPage === 1 ? ArrowLeftGray : ArrowLeft}
          alt="이전 페이지"
          className="w-5 h-5"
        />
      </button>

      {/* 페이지 번호 버튼 */}
      <div className="flex gap-1">{renderPageNumbers()}</div>

      {/* 다음 버튼 */}
      <button
        type="button"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <img
          src={currentPage === totalPages ? ArrowRightGray : ArrowRight}
          alt="다음 페이지"
          className="w-5 h-5"
        />
      </button>
    </div>
  );
}
