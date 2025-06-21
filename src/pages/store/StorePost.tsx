import Footer from '@/components/layout/Footer';

export default function StorePost() {
  return (
    <div className="flex min-h-[calc(100vh-108px)] flex-col justify-between bg-gray-5 md:min-h-[calc(100vh_-_70px)]">
      <section className="w-full px-12 py-40 md:px-32 md:py-60"></section>
      <section className="w-full flex-1 px-12 pt-40 pb-80 md:px-32 md:py-60"></section>
      <Footer />
    </div>
  );
}
