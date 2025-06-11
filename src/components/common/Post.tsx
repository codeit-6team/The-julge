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

export default function Post() {}
