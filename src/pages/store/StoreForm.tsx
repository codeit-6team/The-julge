import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getUser } from '@/api/userApi';
import {
  getShopNotice,
  postShopNotice,
  putShopNotice,
  type NoticeUpsertRequest,
} from '@/api/noticeApi';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import close from '@/assets/icons/close.svg';

export default function StoreForm() {
  const navigate = useNavigate();
  const [noticeInfo, setNoticeInfo] = useState<Partial<NoticeUpsertRequest>>({
    hourlyPay: undefined,
    startsAt: '',
    workhour: undefined,
    description: '',
  });
  const params = useParams();
  const shopId = useRef(params.shopId ?? '');
  const noticeId = useRef(params.noticeId ?? '');

  const [modal, setModal] = useState({
    isOpen: false,
    message: '',
  });

  useEffect(() => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setModal({
        isOpen: true,
        message: '로그인이 필요합니다.',
      });
      return;
    }

    (async () => {
      try {
        if (shopId.current) {
          const { item } = await getShopNotice(
            shopId.current,
            noticeId.current,
          );
          setNoticeInfo({
            ...item,
            startsAt: new Date(
              new Date(item.startsAt).getTime() + 1000 * 60 * 60 * 9,
            )
              .toISOString()
              .slice(0, 16),
          });
        } else {
          const userInfo = await getUser(userId);
          shopId.current = userInfo.item.shop?.item.id ?? '';
        }
      } catch (error) {
        setModal({
          isOpen: true,
          message: (error as Error).message,
        });
      }
    })();
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    const sanitized =
      name === 'hourlyPay' ? Number(value.replace(/[^0-9]/g, '')) : value;

    setNoticeInfo((prev) => ({
      ...prev,
      [name]: sanitized,
    }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    // 로그인이 안된 상태에 대한 처리
    if (!userId) {
      setModal({
        isOpen: true,
        message: '로그인이 필요합니다.',
      });
      return;
    }

    if (!noticeInfo?.startsAt) {
      setModal({
        isOpen: true,
        message: '시작 일시를 설정해주세요',
      });
      return;
    }

    try {
      const startsTime = new Date(noticeInfo?.startsAt).toISOString();
      const body = {
        hourlyPay: noticeInfo?.hourlyPay ?? 0,
        startsAt: startsTime,
        workhour: noticeInfo?.workhour ?? 0,
        description: noticeInfo?.description ?? '',
      };
      if (noticeId.current) {
        await putShopNotice(shopId.current, noticeId.current, body);
      } else {
        const { item } = await postShopNotice(shopId.current, body);
        noticeId.current = item.id;
      }
      setModal({
        isOpen: true,
        message: '등록이 완료되었습니다.',
      });
    } catch (error) {
      setModal({
        isOpen: true,
        message: (error as Error).message,
      });
    }
  }

  const handleModalConfirm = useCallback(() => {
    if (modal.message === '등록이 완료되었습니다.') {
      setModal({ isOpen: false, message: '' });
      navigate(`/owner/post/${shopId.current}/${noticeId.current}`);
    } else if (modal.message.includes('로그인')) {
      setModal({ isOpen: false, message: '' });
      navigate('/login');
    } else {
      setModal({ isOpen: false, message: '' });
    }
  }, [modal.message, navigate]);

  return (
    <div className="min-h-[calc(100vh-102px)] bg-gray-5 md:min-h-[calc(100vh-70px)]">
      <div className="mx-12 flex flex-col gap-24 pt-40 pb-80 md:mx-32 md:gap-32 md:py-60 lg:mx-auto lg:w-964">
        <div className="flex items-center justify-between">
          <h1 className="text-h3/24 font-bold md:text-h1/34">공고 등록</h1>
          <Link to="/owner/store">
            <img src={close} alt="닫기" className="md:size-32" />
          </Link>
        </div>
        <form
          className="flex flex-col gap-24 md:gap-32"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-20 md:gap-24">
            <div className="grid grid-cols-1 gap-20 md:grid-cols-2 md:gap-y-24 lg:grid-cols-3">
              <Input
                label="시급*"
                name="hourlyPay"
                unit="원"
                value={noticeInfo.hourlyPay?.toLocaleString('ko-KR')}
                onChange={handleChange}
              />
              <Input
                label="시작 일시*"
                type="datetime-local"
                name="startsAt"
                value={noticeInfo.startsAt}
                onChange={handleChange}
              />
              <Input
                label="업무 시간*"
                type="number"
                name="workhour"
                unit="시간"
                value={noticeInfo.workhour}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col gap-8 text-body1/26 font-regular">
              <label htmlFor="description">공고 설명</label>
              <textarea
                name="description"
                id="description"
                className="h-153 resize-none rounded-[5px] border border-gray-30 bg-white px-20 py-16 placeholder-gray-40"
                placeholder="입력"
                value={noticeInfo.description}
                onChange={handleChange}
              />
            </div>
          </div>
          <Button type="submit" className="md:mx-auto md:w-312">
            등록하기
          </Button>
        </form>
      </div>
      {modal.isOpen && (
        <Modal onClose={handleModalConfirm} onButtonClick={handleModalConfirm}>
          {modal.message}
        </Modal>
      )}
    </div>
  );
}
