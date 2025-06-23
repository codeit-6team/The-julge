import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="mb-20 text-8xl font-bold text-primary">404</h1>
      <p className="mb-40 text-4xl text-primary">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="text-xl text-[#5534DA] underline">
        홈으로 돌아가기
      </Link>
    </div>
  );
}
