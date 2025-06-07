import { useState } from 'react';
import Pagination from './components/common/pagination/Pagination'; // 실제 경로에 맞게 수정해줘

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 20;
  return (
    <div className="p-10 space-y-6">
      <h1 className="text-3xl font-bold underline">hi</h1>
      <p className="text-lg">현재 페이지: {currentPage}</p>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onChangePage={setCurrentPage}
      />
    </div>
  );
}
