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
  return (
    <div>
      <p>총 페이지 수 : {totalPages}</p>
      <p>현재 페이지: {currentPage}</p>
      <button onClick={() => onChangePage(currentPage + 1)}>다음</button>
    </div>
  );
}
