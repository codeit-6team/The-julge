interface workTime {
  startsAt: string;
  workHour: number;
}

export default function formatWorkTime({
  startsAt,
  workHour,
}: workTime): string {
  const date = new Date(startsAt);

  const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = kstDate.getFullYear();
  const month = String(kstDate.getMonth() + 1).padStart(2, '0');
  const day = String(kstDate.getDate()).padStart(2, '0');
  const hours = String(kstDate.getHours()).padStart(2, '0');
  const afterhours = String(kstDate.getHours() + workHour).padStart(2, '0');
  const minutes = String(kstDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}~${afterhours}:${minutes} `;
}
