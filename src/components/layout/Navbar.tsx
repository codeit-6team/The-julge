import { Link } from 'react-router-dom';
import { useRef, useState, useEffect, useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import NotificationModal from '../common/notification-modal/NotificationModal';
import logo from '@/assets/images/logo.svg';
import search from '@/assets/icons/search.svg';
import alarmActive from '@/assets/icons/alarm-active.svg';
import alarmInactive from '@/assets/icons/alarm-inactive.svg';

export default function Navbar() {
  const { isLoggedIn, role, alarms, logout } = useContext(AuthContext);
  const [isShowModal, setIsShowModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 바깥 클릭 시 모달 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent): void {
      const target = event.target as Node;
      if (
        isShowModal &&
        modalRef.current &&
        !modalRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsShowModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isShowModal]);

  // esc로 닫기
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') setIsShowModal(false);
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="bg-white">
      <nav className="relative mx-20 flex flex-wrap items-center justify-between gap-y-22 py-10 md:mx-32 md:py-15 lg:mx-auto lg:max-w-1023">
        <Link
          to="/"
          className="order-1 flex h-30 items-center justify-center md:h-40"
        >
          <img src={logo} alt="더줄게 로고 이미지" className="h-15 md:h-20" />
        </Link>

        <div className="relative order-4 w-full md:order-2 md:ml-40 md:flex-1">
          <img
            src={search}
            className="absolute top-1/2 left-10 -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="가게 이름으로 찾아보세요"
            className="h-36 w-full rounded-[10px] bg-gray-10 pt-10 pb-10 pl-40 placeholder:text-body2 placeholder:text-gray-40 md:h-40 md:w-344 lg:w-450"
          />
        </div>
        {isLoggedIn ? (
          <div className="order-3 flex items-center gap-16 text-body2 font-bold md:gap-12 md:text-body1 lg:gap-40">
            <Link to={role === 'employer' ? '/owner/store' : '/profile'}>
              {role === 'employer' ? '내 가게' : '내 프로필'}
            </Link>
            <button onClick={logout}>로그아웃</button>
            <button
              ref={buttonRef}
              onClick={() => setIsShowModal((prev) => !prev)}
            >
              {alarms.count > 0 ? (
                <img src={alarmActive} />
              ) : (
                <img src={alarmInactive} />
              )}
            </button>
          </div>
        ) : (
          <div className="order-3 flex gap-16 text-body2 font-bold md:gap-40 md:text-body1">
            <Link to="/login">로그인</Link>
            <Link to="/signup">회원가입</Link>
          </div>
        )}

        {isShowModal && (
          <div
            className="absolute top-0 -left-20 z-100 md:top-56 md:right-0 md:left-auto"
            ref={modalRef}
          >
            <NotificationModal
              data={alarms.items}
              count={alarms.count}
              onClose={() => setIsShowModal(false)}
            />
          </div>
        )}
      </nav>
    </header>
  );
}
