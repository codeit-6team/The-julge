import { useEffect, useState } from 'react';
import Button from './Button';
import formatWorkTime from '@/utils/formatWorkTime';

interface User {
  item: {
    id: string;
    email: string;
    type: 'employer' | 'employee';
    name?: string;
    phone?: string;
    address?: string;
    bio?: string;
  };
  href: string;
}

interface Shop {
  item: {
    id: string;
    name: string;
    category: string;
    address1: string;
    address2: string;
    description: string;
    imageUrl: string;
    originalHourlyPay: number;
  };
  href: string;
}

interface Notice {
  item: {
    id: string;
    hourlyPay: number;
    description: string;
    startsAt: string;
    workhour: number;
    closed: boolean;
  };
  href: string;
}

interface Link {
  rel: string;
  description: string;
  method: string;
  href: string;
}

interface Application {
  item: {
    id: string;
    status: 'pending' | 'accepted' | 'rejected' | 'canceled';
    createdAt: string;
    user?: User;
    shop: Shop;
    notice: Notice;
  };
  links: Link[];
}

interface Props {
  className?: string;
  mode: 'user' | 'notice';
  applications: Application[];
}

export default function Table({
  className = '',
  mode,
  applications: initialApplications,
}: Props) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const applications = [
    ...initialApplications,
    ...[null, null, null, null, null],
  ].slice(0, 5);

  const headers =
    mode === 'notice'
      ? ['신청자', '소개', '전화번호', '상태']
      : ['가게', '일자', '시급', '상태'];

  const datas = applications.map((app) => {
    if (!app) return Array(5).fill([null, null, null, null]);

    const { item } = app;

    return [
      ...(mode === 'notice'
        ? [
            item?.user?.item?.name,
            item?.user?.item?.bio,
            item?.user?.item?.phone,
          ]
        : [
            item.shop.item.name,
            `${formatWorkTime({
              startsAt: item.notice.item.startsAt,
              workHour: item.notice.item.workhour,
            })} (${item.notice.item.workhour}시간)`,
            item.notice.item.hourlyPay.toLocaleString('ko-KR') + '원',
          ]),
      item.status,
    ];
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <table className="border-separate border-spacing-0 overflow-hidden rounded-[10px] bg-white text-left inset-ring inset-ring-gray-20">
      <thead className="h-40 rounded-t-[10px] bg-red-10 text-caption/16 inset-ring inset-ring-gray-20 md:h-50 md:text-body2/22">
        <tr>
          <th className="w-228 px-8 font-regular md:px-12">{headers[0]}</th>
          <th className="w-300 px-8 font-regular md:px-12">{headers[1]}</th>
          <th className="w-200 px-8 font-regular md:px-12">{headers[2]}</th>
          <th className="min-w-162 px-8 font-regular md:min-w-220 md:px-12">
            {headers[3]}
          </th>
        </tr>
      </thead>
      <tbody className="text-body2/22 font-regular md:text-body1/26">
        {datas.map((data, index) => (
          <tr key={index}>
            <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
              {data[0]}
            </td>
            <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
              {data[1]}
            </td>
            <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
              {data[2]}
            </td>
            <td className="border-b border-gray-20 px-8 pt-1 md:px-12">
              {data[3] === 'pending' ? (
                mode === 'notice' ? (
                  <div className="flex gap-8 md:gap-12">
                    <Button
                      solid={false}
                      size={isMobile ? 'small' : 'medium'}
                      className="w-69 md:w-92"
                    >
                      거절하기
                    </Button>
                    <Button
                      solid={false}
                      size={isMobile ? 'small' : 'medium'}
                      className="w-69 md:w-92"
                      style={{
                        color: 'var(--color-blue-20)',
                        borderColor: 'var(--color-blue-20)',
                      }}
                    >
                      승인하기
                    </Button>
                  </div>
                ) : (
                  <div>대기중</div>
                )
              ) : data[3] === 'accepted' ? (
                <div>승인 완료</div>
              ) : data[3] === 'rejected' ? (
                <div>거절</div>
              ) : data[3] === 'canceled' ? (
                <div>취소</div>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot></tfoot>
    </table>
  );
}
