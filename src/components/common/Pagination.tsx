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
    <div className="flex items-center justify-center gap-20 py-12">
      {/* 왼쪽 화살표 */}
      {totalPages > 7 && (
        <button type="button" onClick={() => handleClick(1)}>
          <img
            src={currentPage === 1 ? ArrowLeftGray : ArrowLeft}
            alt="이전"
            className="size-20"
          />
        </button>
      )}

      {/* 페이지 버튼들 */}
      <div className="flex gap-4 md:gap-2">
        {pageNumbers.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => handleClick(page)}
            className={`flex size-32 items-center justify-center rounded-sm text-caption md:size-40 md:text-body2 ${
              currentPage === page
                ? 'bg-red-30 text-white'
                : 'bg-white text-black'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* 오른쪽 화살표 */}
      {totalPages > 7 && currentPage < totalPages && (
        <button type="button" onClick={() => handleClick(totalPages)}>
          <img src={ArrowRight} alt="다음" className="size-20" />
        </button>
      )}
    </div>
  );
}
