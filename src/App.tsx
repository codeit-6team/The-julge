import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Store from './pages/store/Store';
import StoreEdit from './pages/store/StoreEdit';
import StoreForm from './pages/store/StoreForm';
import StorePost from './pages/store/StorePost';
import Profile from './pages/profile/Profile';
import ProfileForm from './pages/profile/ProfileForm';
import NoticeList from './pages/notice/NoticeList';
import Notice from './pages/notice/Notice';

export default function App() {
  const { pathname } = useLocation();

  return (
    <>
      {pathname !== '/login' && pathname !== '/signup' && <Navbar />}
      <Routes>
        {/* 공통 페이지 */}
        <Route path="/" element={<NoticeList />} />
        <Route path=":shopId/:userId" element={<Notice />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />

        {/* 사장님 페이지 */}
        <Route path="owner">
          <Route path="store">
            <Route index element={<Store />} />
            <Route path="edit" element={<StoreEdit />} />
          </Route>
          <Route path="post">
            <Route index element={<StoreForm />} />
            <Route path=":shopId/:userId" element={<StorePost />} />
          </Route>
        </Route>

        {/* 알바님 프로필 페이지 */}
        <Route path="profile">
          <Route index element={<Profile />} />
          <Route path="edit" element={<ProfileForm />} />
        </Route>
      </Routes>
    </>
  );
}
