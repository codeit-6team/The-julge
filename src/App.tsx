import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './pages/account/Login';
import Signup from './pages/account/Signup';
import Store from './pages/myprofile/Store';
import StoreEdit from './pages/myprofile/StoreEdit';
import StoreForm from './pages/myprofile/StoreForm';
import StorePost from './pages/myprofile/StorePost';
import Profile from './pages/mystore/Profile';
import ProfileForm from './pages/mystore/ProfileForm';
import PostList from './pages/post/PostList';
import Post from './pages/post/Post';

export default function App() {
  return (<>
    <Navbar />
    <Routes>
      {/* 공통 페이지 */}
      <Route path="/" element={<PostList />} />
      <Route path=":id" element={<Post />} />
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
          <Route path=":id" element={<StorePost />} />
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
