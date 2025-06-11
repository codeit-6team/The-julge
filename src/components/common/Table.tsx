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
    <table>
      <thead></thead>
      <tbody></tbody>
      <tfoot></tfoot>
    </table>
  );
}
