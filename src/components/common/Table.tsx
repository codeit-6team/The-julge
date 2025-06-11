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
  const applications: (Application | null)[] = initialApplications.concat(
    Array(5 - initialApplications.length).fill(null),
  );

  return (
    <table>
      <thead></thead>
      <tbody></tbody>
      <tfoot></tfoot>
    </table>
  );
}
