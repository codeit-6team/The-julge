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

export default function Post() {}
