import { Link } from 'react-router-dom';
import { useState } from 'react';
import logo from '@/assets/images/logo.png';
import search from '@/assets/icons/search.svg';
import alarmActive from '@/assets/icons/alarm-active.svg';
import alarmInactive from '@/assets/icons/alarm-inactive.svg';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alarms, setAlarms] = useState([]);
  return (
    <header className="bg-white ">
      <nav className="flex flex-wrap items-center justify-between gap-y-[22px] py-2.5 md:py-[15px] mx-5 md:mx-8 lg:max-w-[1023px] lg:mx-auto">
        <img
          src={logo}
          alt="더줄게 로고 이미지"
          className="h-[30px] md:h-[40px] order-1"
        />

        <div className="relative order-5 w-full md:flex-1 md:order-2 md:ml-10 ">
          <img
            src={search}
            className="absolute -translate-y-1/2 left-2.5 top-1/2"
          />
          <input
            type="text"
            placeholder="가게 이름으로 찾아보세요"
            className="w-full md:w-[344px] lg:w-[450px] h-9 md:h-10 bg-gray-10 pl-10 pt-2.5 pb-2.5 rounded-[10px] placeholder:text-body2 placeholder:text-gray-40"
          />
        </div>
        {isLoggedIn ? (
          <div className="flex gap-4 font-bold text-body2 md:gap-10 md:text-body1 order-3">
            <Link>내 가게</Link>
            <Link>로그아웃</Link>
            <button>
              {alarms.length > 0 ? (
                <img src={alarmActive} />
              ) : (
                <img src={alarmInactive} />
              )}
            </button>
          </div>
        ) : (
          <div className="flex gap-4 font-bold text-body2 md:gap-10 md:text-body1 order-4">
            <Link>로그인</Link>
            <Link>회원가입</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
