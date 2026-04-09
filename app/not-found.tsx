import Image from 'next/image';
import Header from './components/header/Header';
import GradientTag from './components/ui/GradientTag';
import GradientTitle from './components/ui/GradientTitle';
import NotFoundActions from './components/not-found/NotFoundActions';

export default async function NotFound() {
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

      <section className="relative z-10 px-4 pb-[300px] pt-8 sm:px-6 md:px-8 md:pb-[340px] lg:px-10 lg:pb-[390px]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(420px,0.9fr)] lg:gap-12">
          <div className="max-w-[760px] justify-self-center text-center lg:justify-self-start lg:text-left">
            <GradientTag
              text="Error 404"
              className="inline-block"
              backgroundColor="rgba(255,255,255,0.9)"
              gradientFrom="#20C997"
              gradientTo="#A1DF0A"
              textColor="#1B5E20"
              padding="px-5 py-2"
            />

            <div className="mt-8">
              <span className="inline-block rounded-full border border-white/10 bg-[#0D271B] px-5 py-2 text-sm font-semibold tracking-[0.28em] text-white/70 shadow-[0_14px_40px_rgba(0,0,0,0.24)]">
                404
              </span>
            </div>

            <div className="mt-8">
              <GradientTitle
                part1="The page you are"
                part2="looking for took root elsewhere."
                part1Color="custom"
                customPart1Color="#F4FFF6"
                align="left"
                size="custom"
                className="mx-auto max-w-[14ch] text-center font-bold leading-[1.05] lg:mx-0 lg:text-left"
                customSize="clamp(2.8rem, 6vw, 5.4rem)"
                gradientFrom="#20C997"
                gradientTo="#A1DF0A"
              />
            </div>

            <p className="mx-auto mt-6 max-w-[42rem] text-base leading-8 text-[#D9E5DD] lg:mx-0 lg:text-lg">
              The link may be outdated or the page may have been moved, but the institute&apos;s
              research, services, and contact information are still within reach.
            </p>

            <div className="mt-10">
              <NotFoundActions />
            </div>
          </div>

          <div className="relative mx-auto flex w-full max-w-[560px] items-center justify-center">
            <div className="absolute inset-0 rounded-[36px] bg-[linear-gradient(135deg,rgba(32,201,151,0.18),rgba(161,223,10,0.08))] blur-2xl" />

            <div className="relative w-full overflow-hidden rounded-[32px] border border-white/60 bg-white/72 p-5 shadow-[0_28px_80px_rgba(6,28,18,0.18)] backdrop-blur-xl sm:p-7">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent" />

              <div className="grid gap-4">
                <div className="grid grid-cols-[1.2fr_0.8fr] gap-4">
                  <div className="relative min-h-[250px] overflow-hidden rounded-[26px] bg-[#123826]">
                    <Image
                      src="/images/section3_bg.jpg"
                      alt="Rubber plantation scenery"
                      fill
                      sizes="(min-width: 1024px) 360px, 100vw"
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#042012]/10 via-[#042012]/45 to-[#042012]/82" />

                    <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold tracking-[0.22em] text-white/80 backdrop-blur-sm">
                      RRISL
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 rounded-[24px] bg-white/12 p-4 backdrop-blur-md">
                      <p className="text-sm font-medium text-white/80">Suggested next step</p>
                      <p className="mt-2 text-xl font-semibold leading-tight text-white">
                        Return to the main portal and continue browsing.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    <div className="relative overflow-hidden rounded-[24px] bg-[#E8F4EA] p-4">
                      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#20C997]/18 blur-2xl" />
                      <p className="relative text-sm font-medium uppercase tracking-[0.22em] text-[#2E7D32]/70">
                        Directory
                      </p>
                      <p className="relative mt-4 text-5xl font-semibold leading-none text-[#0F3F1D]">
                        04
                      </p>
                      <p className="relative mt-3 text-sm leading-6 text-[#45624D]">
                        Home, contact, departments, and publications remain available.
                      </p>
                    </div>

                    <div className="relative min-h-[140px] overflow-hidden rounded-[24px] bg-[#0F3F1D] p-4 text-white">
                      <Image
                        src="/images/section3_plant.png"
                        alt=""
                        fill
                        sizes="220px"
                        className="object-contain object-right-bottom opacity-30"
                      />
                      <div className="relative">
                        <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/60">
                          Navigation
                        </p>
                        <p className="mt-4 max-w-[12rem] text-lg font-semibold leading-7">
                          A clean restart is one click away.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[#DDE7DF] bg-white/75 px-4 py-4 text-sm text-[#45624D]">
                  <span className="rounded-full bg-[#E7F7EB] px-3 py-1 font-semibold text-[#2E7D32]">
                    Home
                  </span>
                  <span className="rounded-full bg-[#EEF5EF] px-3 py-1 font-semibold">
                    Contact
                  </span>
                  <span className="rounded-full bg-[#EEF5EF] px-3 py-1 font-semibold">
                    FAQ
                  </span>
                  <span className="rounded-full bg-[#EEF5EF] px-3 py-1 font-semibold">
                    Downloads
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
