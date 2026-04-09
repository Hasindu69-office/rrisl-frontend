import Header from '@/app/components/header/Header';
import NotFoundShowcase from '@/app/components/not-found/NotFoundShowcase';

export default async function Test404ShowcasePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F6F8F3] text-[#0F3F1D]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(32,201,151,0.22),_transparent_36%),radial-gradient(circle_at_85%_15%,_rgba(161,223,10,0.2),_transparent_24%),linear-gradient(180deg,_#133321_0%,_#0B1F16_32%,_#F6F8F3_32%,_#F6F8F3_100%)]" />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1),_transparent_60%)]" />
        <div className="absolute left-[-8%] top-24 h-56 w-56 rounded-full bg-[#20C997]/15 blur-3xl md:h-72 md:w-72" />
        <div className="absolute right-[-6%] top-16 h-48 w-48 rounded-full bg-[#A1DF0A]/20 blur-3xl md:h-64 md:w-64" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[24rem] bg-[radial-gradient(circle_at_bottom,_rgba(15,63,29,0.12),_transparent_60%)]" />

      <div className="relative z-20">
        <Header />
      </div>

      <NotFoundShowcase />
    </div>
  );
}
