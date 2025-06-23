import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';

// 페이지 컴포넌트 lazy import
const NoticeList = lazy(() => import('@/pages/notice/NoticeList'));
const Notice = lazy(() => import('@/pages/notice/Notice'));
const Login = lazy(() => import('@/pages/account/Login'));
const Signup = lazy(() => import('@/pages/account/Signup'));
const NotFound = lazy(() => import('@/pages/error/NotFound'));

const Store = lazy(() => import('@/pages/store/Store'));
const StoreEdit = lazy(() => import('@/pages/store/StoreEdit'));
const StoreForm = lazy(() => import('@/pages/store/StoreForm'));
const StorePost = lazy(() => import('@/pages/store/StorePost'));

const Profile = lazy(() => import('@/pages/profile/Profile'));
const ProfileForm = lazy(() => import('@/pages/profile/ProfileForm'));

import { useSearchParams } from 'react-router-dom';

// 검색 쿼리용 페이지
function SearchPage() {
  const [params] = useSearchParams();
  const query = params.get('query') || '';
  return <NoticeList search={query} />;
}

// 로딩 스피너
function LoadingSpinner() {
  return (
    <div className="flex min-h-[calc(100vh-102px)] items-center justify-center md:min-h-[calc(100vh-70px)]">
      <div className="size-100 animate-spin rounded-full border-8 border-gray-200 border-t-primary" />
    </div>
  );
}

export default function App() {
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {pathname !== '/login' && pathname !== '/signup' && <Navbar />}
      <Routes>
        {/* 공통 페이지 */}
        <Route path="/" element={<NoticeList />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/:shopId/:noticeId" element={<Notice />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* 사장님 페이지 */}
        <Route path="/owner/store" element={<Store />} />
        <Route path="/owner/store/edit" element={<StoreEdit />} />
        <Route path="/owner/post" element={<StoreForm />} />
        <Route path="/owner/post/:shopId/:noticeId" element={<StorePost />} />
        <Route
          path="/owner/post/:shopId/:noticeId/edit"
          element={<StoreForm />}
        />

        {/* 알바님 프로필 */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<ProfileForm />} />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
