import { useState, useEffect } from 'react';
import type { NoticeShopItem } from '@/api/noticeApi';

const loadFromStorage = (): NoticeShopItem[] => {
  try {
    const storedData = localStorage.getItem('recentlyViewedPosts');
    return storedData ? JSON.parse(storedData) : [];
  } catch (error) {
    console.error(
      'Failed to parse recently viewed posts from localStorage',
      error,
    );
    return [];
  }
};

const saveToStorage = (posts: NoticeShopItem[]) => {
  try {
    localStorage.setItem('recentlyViewedPosts', JSON.stringify(posts));
  } catch (error) {
    console.error(
      'Failed to save recently viewed posts to localStorage',
      error,
    );
  }
};

export function useRecentlyViewed() {
  const [recentlyViewed, setRecentlyViewed] = useState<NoticeShopItem[]>([]);

  useEffect(() => {
    setRecentlyViewed(loadFromStorage());
  }, []);

  const addRecentlyViewed = (post: NoticeShopItem) => {
    const currentPosts = loadFromStorage();
    const filteredPosts = currentPosts.filter((item) => item.id !== post.id);
    const newPosts = [post, ...filteredPosts];
    const limitedPosts = newPosts.slice(0, 6);

    saveToStorage(limitedPosts);
    setRecentlyViewed(limitedPosts);
  };

  return { recentlyViewed, addRecentlyViewed };
}
