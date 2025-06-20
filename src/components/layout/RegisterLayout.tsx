import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const TEXT_MAP = {
  profile: {
    content: '내 프로필을 등록하고 원하는 가게에 지원해 보세요.',
    buttonText: '내 프로필 등록하기',
    link: '/profile/edit',
  },
  store: {
    content: '내 가게를 소개하고 공고도 등록해 보세요.',
    buttonText: '가게 등록하기',
    link: '/owner/store/edit',
  },
  application: {
    content: '아직 신청 내역이 없어요.',
    buttonText: '공고 보러가기',
    link: '/',
  },
  notice: {
    content: '공고를 등록해 보세요.',
    buttonText: '공고 등록하기',
    link: '/owner/post',
  },
};

export default function RegisterLayout({
  type,
}: {
  type: 'profile' | 'store' | 'application' | 'notice';
}) {
  const navigate = useNavigate();
  const { content, buttonText, link } = TEXT_MAP[type];

  return (
    <div className="flex flex-col items-center gap-16 rounded-[12px] border border-gray-20 px-24 py-60 md:gap-24">
      <p className="text-body2/22 md:text-body1/26">{content}</p>
      <Button
        size="medium"
        className="px-20 py-10 md:h-48 md:w-344 md:text-body1 md:font-bold"
        onClick={() => navigate(link)}
      >
        {buttonText}
      </Button>
    </div>
  );
}
