import { Routes, Route } from 'react-router-dom';
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
  return (
    <Routes>
      <Route path="/" element={<PostList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/owner/store" element={<Store />} />
      <Route path="/owner/store/edit" element={<StoreEdit />} />
      <Route path="/owner/post" element={<StoreForm />} />
      <Route path="/owner/post/:id" element={<StorePost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/profile/edit" element={<ProfileForm />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
}
