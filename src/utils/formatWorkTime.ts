interface WorkTime {
  startsAt: string | number; // 근무 시작 시간 (ISO 8601 형식 문자열)
  workHour: number; // 근무 시간 (시간 단위)
}

/* 주어진 근무 시작 시간과 근무 시간을 기반으로 근무 시작~종료 시간을 "YYYY-MM-DD HH:mm~HH:mm" 형식의 문자열로 반환하는 함수  */
export default function formatWorkTime({
  startsAt,
  workHour,
}: WorkTime): string {
  const date = new Date(startsAt);
  if (isNaN(date.getTime())) {
    return '날짜 정보가 올바르지 않습니다';
  }
  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  /* 시각이 24시를 넘으면 다음날로 설정되어 자동으로 처리  */
  const endDate = new Date(kstDate);
  endDate.setHours(endDate.getHours() + workHour);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const startHours = String(kstDate.getHours()).padStart(2, '0');
  const startMinutes = String(kstDate.getMinutes()).padStart(2, '0');

  const endHours = String(endDate.getHours()).padStart(2, '0');
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${startHours}:${startMinutes}~${endHours}:${endMinutes} `;
}
