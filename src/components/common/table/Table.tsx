import formatWorkTime from '@/utils/formatWorkTime';
import TableStatus from './TableStatus';
import TableButtons from './TableButtons';

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

  return (
    <div
      className={`overflow-x-auto rounded-[10px] border border-gray-20 bg-white ${className}`}
    >
      <table className="w-full min-w-890 border-separate border-spacing-0 text-left md:min-w-948">
        <thead className="h-39 bg-red-10 text-caption/16 md:h-49 md:text-body2/22">
          <tr>
            <th className="w-228 border-b border-gray-20 px-8 font-regular md:px-12">
              {headers[0]}
            </th>
            <th className="w-300 border-b border-gray-20 px-8 font-regular md:px-12">
              {headers[1]}
            </th>
            <th className="w-200 border-b border-gray-20 px-8 font-regular md:px-12">
              {headers[2]}
            </th>
            <th className="sticky right-0 min-w-162 border-b border-gray-20 bg-red-10 px-8 font-regular md:min-w-220 md:px-12">
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
              <td className="sticky right-0 border-b border-gray-20 bg-white px-8 pt-1 md:px-12">
                <div className="min-h-44 content-center md:min-h-67">
                  {mode === 'notice' && data[3] === 'pending' ? (
                    <TableButtons />
                  ) : (
                    <TableStatus status={data[3]} />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-55 w-full md:h-63"></div>
    </div>
  );
}
