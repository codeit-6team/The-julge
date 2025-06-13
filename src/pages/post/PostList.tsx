import Pagination from '@/components/common/Pagination';
import { useState } from 'react';

export default function PostList() {
  const [currentPage, setCurrentPage] = useState(1);
  // 예시 - 실제 데이터에 맞게 수정
  return (
    <Pagination
      totalPages={20}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
}
