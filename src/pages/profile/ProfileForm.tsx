import { Link } from 'react-router-dom';
import Dropdown from '@/components/common/Dropdown';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import close from '@/assets/icons/close.svg';
import { ADDRESS_OPTIONS } from '@/constants/dropdownOptions';

export default function ProfileForm() {
  return (
    <form className="mx-12 mt-40 mb-80 flex flex-col gap-24">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-bold">내 프로필</h1>
        <Link to="/profile">
          <img src={close} alt="닫기" />
        </Link>
      </div>
      <div className="flex flex-col gap-20">
        <Input label="이름*" />
        <Input label="연락처*" />
        <div className="flex flex-col gap-8 text-body1/26 font-regular">
          <label htmlFor="region">선호 지역</label>
          <Dropdown id="region" variant="form" options={ADDRESS_OPTIONS} />
        </div>
        <div className="flex flex-col gap-8 text-body1/26 font-regular">
          <label htmlFor="bio">소개</label>
          <textarea
            name="bio"
            id="bio"
            className="h-153 resize-none rounded-[5px] border border-gray-30 px-20 py-16"
            placeholder="입력"
          ></textarea>
        </div>
      </div>
      <Button>등록하기</Button>
    </form>
  );
}
