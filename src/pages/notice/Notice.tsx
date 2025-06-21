import Post from '@/components/common/Post';
import Footer from '@/components/layout/Footer';
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed';

export default function Notice() {
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <div className="flex min-h-[calc(100vh-102px)] flex-col justify-between bg-gray-5 md:min-h-[calc(100vh-70px)]">
      <div className="h-500 bg-gray-50">식당정보</div>
      <div className="flex-1">
        <div className="mx-12 flex flex-col gap-16 pt-40 pb-80 md:mx-32 md:gap-24 md:pt-60 md:pb-120 lg:mx-auto lg:w-964">
          <h1 className="text-h3 font-bold md:text-h1 md:font-bold">
            최근에 본 공고
          </h1>
          {recentlyViewed.length === 0 ? (
            <div className="flex h-120 items-center justify-center rounded-lg bg-gray-10 text-gray-40">
              최근에 본 공고가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:gap-x-14 md:gap-y-32 lg:grid-cols-3">
              {recentlyViewed.map((postData) => (
                <Post key={postData.id} data={postData} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
