export default function TableStatus({ status }: { status: string }) {
  return status === 'pending' ? (
    <div className="inline-block rounded-full bg-green-10 px-10 py-6 text-caption/16 text-green-20 md:text-body2/17 md:font-bold">
      대기중
    </div>
  ) : status === 'accepted' ? (
    <div className="inline-block rounded-full bg-blue-10 px-10 py-6 text-caption/16 text-blue-20 md:text-body2/17 md:font-bold">
      승인 완료
    </div>
  ) : status === 'rejected' ? (
    <div className="inline-block rounded-full bg-red-10 px-10 py-6 text-caption/16 text-red-40 md:text-body2/17 md:font-bold">
      거절
    </div>
  ) : status === 'canceled' ? (
    <div className="inline-block rounded-full bg-gray-20 px-10 py-6 text-caption/16 text-gray-50 md:text-body2/17 md:font-bold">
      취소
    </div>
  ) : null;
}
