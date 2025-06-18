import { useEffect } from 'react';
import TableStatus from './TableStatus';
import TableButtons from './TableButtons';
import formatWorkTime from '@/utils/formatWorkTime';
import type {
  ApplicationNoticeInfo,
  ApplicationUserInfo,
} from '@/api/applicationApi';

interface UserProps {
  className?: string;
  mode: 'user';
  applications: ApplicationUserInfo[];
}

interface NoticeProps {
  className?: string;
  mode: 'notice';
  applications: ApplicationNoticeInfo[];
}

export default function Table({
  className = '',
  mode,
  applications: initialApplications,
}: UserProps | NoticeProps) {
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
              workhour: item.notice.item.workhour,
            })} (${item.notice.item.workhour}시간)`,
            item.notice.item.hourlyPay.toLocaleString('ko-KR') + '원',
          ]),
      item.status,
    ];
  });

  useEffect(() => {
    const maxHeight = 52;
    const elements = document.querySelectorAll<HTMLDivElement>('td div.t');

    for (const element of elements) {
      if (element.offsetHeight < maxHeight) continue;

      const originalText = element.textContent ?? '';
      element.textContent = originalText.slice(0, 2);

      for (let i = 2; i < originalText.length; i++) {
        element.textContent += originalText[i];
        if (element.offsetHeight > maxHeight) {
          element.textContent = originalText.slice(0, i - 2) + '...';
          break;
        }
      }
    }
  }, []);

  return (
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
                <div className="t max-h-53 overflow-hidden">{data[0]}</div>
              </td>
              <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
                <div className="t max-h-53 overflow-hidden">{data[1]}</div>
              </td>
              <td className="border-b border-gray-20 px-8 pt-12 pb-11 md:px-12 md:pt-20 md:pb-19">
                <div className="t max-h-53 overflow-hidden">{data[2]}</div>
              </td>
              <td className="sticky right-0 border-b border-l border-gray-20 bg-white px-7 pt-1 md:px-11 @min-[947px]:border-l-transparent">
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
