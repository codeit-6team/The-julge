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

  const renderButtons = () => {
    const buttons: React.ReactNode[] = [];

    if (totalPages <= 7) {
      for (let page = 1; page <= totalPages; page++) {
        buttons.push(
          <button
            key={page}
            type="button"
            onClick={() => handleClick(page)}
            className={`flex h-10 w-10 items-center justify-center rounded text-sm ${
              currentPage === page
                ? 'bg-[#FF8D72] font-bold text-white'
                : 'text-black hover:bg-gray-100'
            }`}
            disabled={currentPage === page}
          >
            {page}
          </button>,
        );
      }
      return buttons;
    }

    let start = 1;
    let end = 7;

    if (currentPage > 4) {
      start = currentPage - 3;
      end = currentPage + 3;
    }

    if (currentPage + 3 > totalPages) {
      start = totalPages - 6;
      end = totalPages;
    }

    const buttonRange = range(start, end);

    if (totalPages > 7) {
      buttons.push(
        <button
          key="first"
          type="button"
          onClick={() => handleClick(1)}
          className="h-5 w-5"
        >
          <img
            src={currentPage === 1 ? ArrowLeftGray : ArrowLeft}
            alt="First Page"
          />
        </button>,
      );
    }

    buttonRange.forEach((page) => {
      buttons.push(
        <button
          key={page}
          type="button"
          onClick={() => handleClick(page)}
          className={`flex h-10 w-10 items-center justify-center rounded text-sm ${
            currentPage === page
              ? 'bg-[#FF8D72] font-bold text-white'
              : 'text-black hover:bg-gray-100'
          }`}
        >
          {page}
        </button>,
      );
    });

    if (end < totalPages) {
      buttons.push(
        <button
          key="last"
          type="button"
          onClick={() => handleClick(totalPages)}
          className="h-5 w-5"
        >
          <img src={ArrowRight} alt="Last Page" />
        </button>,
      );
    }

    return buttons;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {renderButtons()}
    </div>
  );
}
