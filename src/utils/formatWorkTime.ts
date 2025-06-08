/**
 * 근무 시간 정보를 담은 객체 타입
 */
interface workTime {
  /** 공고 시작 시간 (ISO 8601 형식 문자열) */
  startsAt: string | number;

  /** 근무 시간 (시간 단위) */
  workHour: number;
}

/**
 * 주어진 근무 시작 시간과 근무 시간을 기반으로
 * KST(한국 표준시) 기준의 근무 시작~종료 시간을
 * "YYYY-MM-DD HH:mm~HH:mm" 형식의 문자열로 반환합니다.
 * 
 * @param {workTime} param0 - 근무 시간 정보
 * @param {string} param0.startsAt - 공고 시작 시간 (ISO 문자열) (예: "2025-06-07T02:00:00.000Z")
 * @param {number} param0.workHour - 근무 시간 (시간 단위) (예: 6)
 * @returns {string} 포맷팅된 근무 시간 문자열 (예: "2025-06-07 11:00~17:00")
 */

export default function formatWorkTime({
  startsAt,
  workHour,
}: workTime): string {
  const date = new Date(startsAt);

  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  /** 시각이 24시를 넘으면 다음날로 설정되어 자동으로 처리  */
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
