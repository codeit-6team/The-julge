import { useEffect, useState } from 'react';
import TableStatus from './TableStatus';
import TableButtons from './TableButtons';
import Pagination from '../Pagination';
import Modal from '../Modal';
import formatWorkTime from '@/utils/formatWorkTime';
import {
  getNoticeApplications,
  getUserApplications,
  putNoticeApplications,
} from '@/api/applicationApi';

interface UserProps {
  className?: string;
  mode: 'user';
  userId: string;
}

interface NoticeProps {
  className?: string;
  mode: 'notice';
  shopId: string;
  noticeId: string;
}

export default function Table(props: UserProps | NoticeProps) {
  const { className, mode } = props;
  const headers =
    mode === 'notice'
      ? ['신청자', '소개', '전화번호', '상태']
      : ['가게', '일자', '시급', '상태'];
  const [datas, setDatas] = useState<(string | undefined)[][]>(
    Array(5).fill(['', '', '', '']),
  );
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    status: 'accepted' | 'rejected';
    dataIndex: number;
  }>({
    isOpen: false,
    status: 'accepted',
    dataIndex: 0,
  });

  const closeModal = () =>
    setModal((prev) => {
      return { ...prev, isOpen: false };
    });

  const clickButton = (dataIndex: number, status: 'accepted' | 'rejected') => {
    setModal({
      isOpen: true,
      status,
      dataIndex,
    });
  };

  const handleModalClick = async () => {
    closeModal();
    if (mode === 'user') return;

    setDatas((prev) => {
      prev[modal.dataIndex][3] = modal.status;
      return prev;
    });
    try {
      await putNoticeApplications(
        props.shopId,
        props.noticeId,
        datas[modal.dataIndex][4] ?? '',
        {
          status: modal.status,
        },
      );
    } catch {
      setDatas((prev) => {
        prev[modal.dataIndex][3] = 'pending';
        return prev;
      });
    }
  };

  useEffect(() => {
    (async () => {
      try {
        if (mode === 'notice') {
          const { items, count } = await getNoticeApplications(
            props.shopId,
            props.noticeId,
            {
              offset: (page - 1) * 5,
              limit: 5,
            },
          );

          setTotalPage(count ? Math.ceil(count / 5) : 1);
          setDatas(
            [...items, ...[null, null, null, null, null]]
              .slice(0, 5)
              .map((element) => {
                if (!element) return ['', '', '', ''];

                return [
                  element.item.user.item.name,
                  element.item.user.item.bio,
                  element.item.user.item.phone,
                  element.item.status,
                  element.item.id,
                ];
              }),
          );
        } else {
          const { items, count } = await getUserApplications(props.userId, {
            offset: (page - 1) * 5,
            limit: 5,
          });

          setTotalPage(count ? Math.ceil(count / 5) : 1);
          setDatas(
            [...items, ...[null, null, null, null, null]]
              .slice(0, 5)
              .map((element) => {
                if (!element) return ['', '', '', ''];

                return [
                  element.item.shop.item.name,
                  `${formatWorkTime({
                    startsAt: element.item.notice.item.startsAt,
                    workhour: element.item.notice.item.workhour,
                  })} (${element.item.notice.item.workhour}시간)`,
                  element.item.notice.item.hourlyPay.toLocaleString('ko-KR') +
                    '원',
                  element.item.status,
                ];
              }),
          );
        }
      } catch {
        setDatas(Array(5).fill(['', '', '', '']));
        setPage(1);
        setTotalPage(1);
      }
    })();
  }, [mode, page]);

  return (
    <>
      <div
        className={`@container scrollbar-hide overflow-x-auto rounded-[10px] border border-gray-20 bg-white ${className}`}
      >
        <table className="w-full min-w-888 border-separate border-spacing-0 text-left md:min-w-946">
          <thead className="h-39 bg-red-10 text-caption/16 md:h-49 md:text-body2/22">
            <tr>
              <th className="w-227 border-b border-gray-20 px-7 font-regular md:px-11">
                {headers[0]}
              </th>
              <th className="w-300 border-b border-gray-20 px-8 font-regular md:px-12">
                {headers[1]}
              </th>
              <th className="w-200 border-b border-gray-20 px-8 font-regular md:px-12">
                {headers[2]}
              </th>
              <th className="sticky right-0 border-b border-l border-gray-20 bg-red-10 px-7 font-regular md:px-11 @min-[947px]:border-l-transparent">
                {headers[3]}
              </th>
            </tr>
          </thead>
          <tbody className="text-body2/22 font-regular md:text-body1/26">
            {datas.map((data, index) => (
              <tr key={index}>
                <td className="border-b border-gray-20 pt-12 pr-8 pb-11 pl-7 md:pt-20 md:pr-12 md:pb-19 md:pl-11">
                  <div className="line-clamp-1 max-h-22 overflow-hidden md:line-clamp-2 md:max-h-51">
                    {data[0]}
                  </div>
                </td>
                <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
                  <div className="line-clamp-1 max-h-22 overflow-hidden md:line-clamp-2 md:max-h-51">
                    {data[1]}
                  </div>
                </td>
                <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
                  <div className="line-clamp-1 max-h-22 overflow-hidden md:line-clamp-2 md:max-h-51">
                    {data[2]}
                  </div>
                </td>
                <td className="sticky right-0 border-b border-l border-gray-20 bg-white px-7 pt-1 md:px-11 @min-[947px]:border-l-transparent">
                  <div className="min-h-44 content-center md:min-h-67">
                    {mode === 'notice' && data[3] === 'pending' ? (
                      <TableButtons index={index} click={clickButton} />
                    ) : (
                      <TableStatus status={data[3] ?? ''} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="sticky right-0 bottom-0 left-0">
          <Pagination
            currentPage={page}
            setCurrentPage={setPage}
            totalPages={totalPage}
          />
        </div>
      </div>
      {modal.isOpen && (
        <Modal
          option="action"
          yesButtonContent="예"
          onYesButtonClick={handleModalClick}
          onButtonClick={closeModal}
          onClose={closeModal}
        >
          신청을 {modal.status === 'accepted' ? '승인' : '거절'}하시겠어요?
        </Modal>
      )}
    </>
  );
}
