import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/images/logo.png';
import search from '@/assets/icons/search.svg';
import alarmActive from '@/assets/icons/alarm-active.svg';
import alarmInactive from '@/assets/icons/alarm-inactive.svg';

export default function Navbar() {
  const {pathname} = useLocation();
  const { isLoggedIn, role, alarms, logout } = useAuth();

  // 로그인/회원가입 페이지에서는 Navbar 숨김
  if (pathname === '/login' || pathname === '/signup') return null;

  return (
    <header className="bg-white ">
      <nav className="flex flex-wrap items-center justify-between gap-y-22 py-10 md:py-15 mx-20 md:mx-32 lg:max-w-1023 lg:mx-auto">
        <Link to="/">
          <img
            src={logo}
            alt="더줄게 로고 이미지"
            className="h-30 md:h-40 order-1"
          />
        </Link>

        <div className="relative order-5 w-full md:flex-1 md:order-2 md:ml-40 ">
          <img
            src={search}
            className="absolute -translate-y-1/2 left-10 top-1/2"
          />
          <input
            type="text"
            placeholder="가게 이름으로 찾아보세요"
            className="w-full md:w-344 lg:w-450 h-36 md:h-40 bg-gray-10 pl-40 pt-10 pb-10 rounded-[10px] placeholder:text-body2 placeholder:text-gray-40"
          />
        </div>
        {isLoggedIn ? (
          <div className="flex items-center gap-16 font-bold text-body2 md:gap-40 md:text-body1 order-3">
            {role === 'employer' ? (
              <Link to="/owner/store">내 가게</Link>
            ):(
              <Link to="/profile">내 프로필</Link>
            )
            }
            
            <button onClick={logout}>로그아웃</button>
            <button>
              {alarms.length > 0 ? (
                <img src={alarmActive} />
              ) : (
                <img src={alarmInactive} />
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-16 font-bold text-body2 md:gap-40 md:text-body1 order-4">
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
