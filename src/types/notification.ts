export interface NotificationItem {
  item: {
    createdAt: string;
    result: 'accepted' | 'rejected';
    read: boolean;
    shop: {
      item: {
        name: string;
      };
    };
    notice: {
      item: {
        startsAt: string;
        workhour: number;
      };
    };
  };
}

export interface NotificationModalProps {
  data: NotificationItem[];
  count: number;
}

export interface NotificationCardProps {
  status: 'accepted' | 'rejected';
  restaurantName: string;
  startsAt: string;
  workHour: number;
  createdAt: string;
}