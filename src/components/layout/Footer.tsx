import Envelope from '@/assets/icons/envelope.svg';
import Instagram from '@/assets/icons/instagram.svg';
import Facebook from '@/assets/icons/facebook.svg';

export default function Footer() {
  return (
    <div className="h-126 w-full bg-gray-10 px-20 pt-32 pb-16 font-regular text-gray-50 md:h-100 md:px-32 md:py-37 lg:flex lg:justify-center lg:px-238">
      <div className="grid h-78 grid-cols-[1fr_auto] grid-rows-1 gap-x-59 gap-y-40 md:flex md:h-26 md:items-center md:justify-between lg:w-964">
        <p className="order-3 text-caption/16 md:order-1 md:text-body1/26">
          ©codeit - 2025
        </p>
        <ul className="order-1 flex items-center gap-30 justify-self-start text-body2/22 md:order-2 md:text-body1/26">
          <li className="whitespace-nowrap">Privacy Policy</li>
          <li>FAQ</li>
        </ul>
        <div className="order-2 flex gap-10 md:order-3">
          <img src={Envelope} alt="email" className="size-25" />
          <img src={Instagram} alt="facebook" className="size-25" />
          <img src={Facebook} alt="instagram" className="size-25" />
        </div>
      </div>
    </div>
  );
}
