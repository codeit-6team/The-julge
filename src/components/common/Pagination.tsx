import ArrowLeft from '@/assets/icons/arrow-left.svg';
import ArrowLeftGray from '@/assets/icons/arrow-left-gray.svg';
import ArrowRight from '@/assets/icons/arrow-right.svg';

interface Props {
  totalPages: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({
  totalPages,
  currentPage,
  setCurrentPage,
}: Props) {
  const handleClick = (page: number) => {
    setCurrentPage(page);
  };

  const range = (start: number, end: number) => {
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  let start = 1;
  let end = 7;

  if (currentPage > 4) {
    start = currentPage - 3;
    end = currentPage + 3;
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(end - 6, 1);
  }

  const pageNumbers = range(start, end);

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 lg:gap-5">
      {/* 왼쪽 화살표 */}
      {totalPages > 7 && (
        <button type="button" onClick={() => handleClick(1)}>
          <img
            src={currentPage === 1 ? ArrowLeftGray : ArrowLeft}
            alt="이전"
            className="size-5"
          />
        </button>
      )}
      {/* 페이지 버튼들 */}
      <div className="flex gap-2 sm:gap-1">
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleClick(page)}
            className={`flex items-center justify-center rounded ${
              currentPage === page ? 'bg-red-30 text-white' : 'text-black'
            } size-8 text-caption md:size-10 md:text-body2`}
          >
            {page}
          </button>
        ))}
      </div>
      {/* 오른쪽 화살표 */}
      {totalPages > 7 && currentPage < totalPages && (
        <button type="button" onClick={() => handleClick(totalPages)}>
          <img src={ArrowRight} alt="다음" className="size-5" />
        </button>
      )}
    </div>
  );
}
