interface PostProps {
  imageUrl: string;
  title: string;
  startAt: string; // 근무 시작 시간
  workhour: number; // 근무 시간
  location: string;
  hourlyPay: number; // 시급
  originalHourlyPay: number; // 전에 등록한 시급
  closed: boolean; // 마감 여부
}

// 상태 계산
function getStatus(
  startAt: string,
  closed: boolean,
): 'ACTIVE' | 'CLOSED' | 'EXPIRED' {
  const now = new Date();
  const startDate = new Date(startAt);

  if (closed) return 'CLOSED'; // 인원 다 찼으면 마감
  if (now >= startDate) return 'EXPIRED'; // 기간 종료되면 마감
  return 'ACTIVE';
}

// 날짜 포맷
function formatDate(startAt: string, workhour: number): string {
  const start = new Date(startAt);
  const end = new Date(start.getTime() + workhour * 60 * 60 * 1000);

  const yyyy = start.getFullYear();
  const mm = String(start.getMonth() + 1).padStart(2, '0'); // padStart 자리 수를 맞추는 용도
  const dd = String(start.getDate()).padStart(2, '0');
  const startHour = String(start.getHours()).padStart(2, '0');
  const startMin = String(start.getMinutes()).padStart(2, '0');

  const endHour = String(end.getHours()).padStart(2, '0');
  const endMin = String(end.getMinutes()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${startHour}:${startMin}~${endHour}:${endMin}`;
}

export default function Post() {}
