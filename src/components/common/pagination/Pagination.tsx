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
  const groupSize = 7;
  const currentGroup = Math.floor((currentPage - 1) / groupSize);
  const groupStart = currentGroup * groupSize + 1;
  const groupEnd = Math.min(groupStart + groupSize - 1, totalPages);

  const renderPageNumbers = () => {
    return Array.from(
      { length: groupEnd - groupStart + 1 },
      (_, index) => groupStart + index,
    ).map((pageNumber) => (
      <button
        key={pageNumber}
        type="button"
        onClick={() => onChangePage(pageNumber)}
        className={`w-10 h-10 rounded flex items-center justify-center text-sm ${
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
      {/* 이전 그룹 이동 */}
      {totalPages > groupSize && groupStart > 1 && (
        <button type="button" onClick={() => onChangePage(groupStart - 1)}>
          <img
            src={groupStart - 1 === 1 ? ArrowLeftGray : ArrowLeft}
            alt="이전 페이지 그룹"
            className="w-5 h-5"
          />
        </button>
      )}

      {/* 페이지 번호 */}
      <div className="flex gap-1">{renderPageNumbers()}</div>

      {/* 다음 그룹 이동 */}
      {totalPages > groupSize && groupEnd < totalPages && (
        <button type="button" onClick={() => onChangePage(groupEnd + 1)}>
          <img src={ArrowRight} alt="다음 페이지 그룹" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
