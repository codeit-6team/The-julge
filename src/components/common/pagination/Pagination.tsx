import ArrowLeft from '../../../assets/icons/arrow-left.svg';
import ArrowLeftGray from '../../../assets/icons/arrow-left-gray.svg';
import ArrowRight from '../../../assets/icons/arrow-right.svg';

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
  const renderPageNumbers = () => {
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > 7) {
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 7;
      } else if (currentPage + 3 >= totalPages) {
        startPage = totalPages - 6;
        endPage = totalPages;
      } else {
        startPage = currentPage - 3;
        endPage = currentPage + 3;
      }
    }

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
              ? 'text-white font-bold'
              : 'text-black hover:bg-gray-100'
          }`}
        style={{
          backgroundColor: currentPage === pageNumber ? '#FF8D72' : '#ffffff',
        }}
      >
        {pageNumber}
      </button>
    ));
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* ← 이전 버튼 */}
      {totalPages > 7 && (
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
      )}

      {/* 페이지 번호 버튼 */}
      <div className="flex gap-1">{renderPageNumbers()}</div>

      {/* → 다음 버튼 (마지막 페이지일 때 숨김) */}
      {totalPages > 7 && currentPage < totalPages && (
        <button type="button" onClick={() => onChangePage(currentPage + 1)}>
          <img src={ArrowRight} alt="다음 페이지" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
