import React, { useState } from "react";
import {
  Calendar,
  Clock3,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Utensils,
} from "lucide-react";

interface TimelineRecord {
  year: number;
  shortTitle: string;
  title: string;
  description: string;
  image: string;
}

const timelineRecords: TimelineRecord[] = [
  {
    year: 1200,
    shortTitle: "Historic Ganga Dynasty Era",
    title: "Historic Ganga Dynasty Era",
    description:
      "During the Eastern Ganga dynasty, the great temple at Puri developed into an important centre of worship and cultural life. The temple became closely associated with Lord Jagannath and traditions that would deeply influence Odisha's religious, artistic and cultural identity.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Old_photo_of_Jagannath_Temple%2C_Puri.jpg/640px-Old_photo_of_Jagannath_Temple%2C_Puri.jpg",
  },
  {
    year: 2026,
    shortTitle: "Present Day – Living Jagannath Heritage",
    title: "Present Day – Living Jagannath Heritage",
    description:
      "Today, Shree Jagannath Temple remains one of Odisha's most important religious and cultural centres. Centuries-old rituals, festivals, Mahaprasad traditions and the annual Rath Yatra continue to keep Jagannath culture alive while connecting generations of devotees with Odisha's living heritage.",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Jagannath_Temple%2C_Puri.jpg/640px-Jagannath_Temple%2C_Puri.jpg",
  },
];

const ExplorePage: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const activeRecord = timelineRecords[activeIndex];

  const previousEra = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const nextEra = () => {
    if (activeIndex < timelineRecords.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f3] text-[#33261f]">
      <main className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-6 md:px-8 md:py-10">

        {/* =========================================================
            MAIN HERITAGE TIME TRAVEL SECTION
        ========================================================= */}
        <section className="rounded-2xl border border-[#ddd4c8] bg-[#f8f6f0] p-5 shadow-sm sm:p-7 md:p-8">

          {/* =======================================================
              HEADER
          ======================================================= */}
          <div className="flex flex-col gap-6 border-b border-[#e5ddd5] pb-7 md:flex-row md:items-start md:justify-between">

            <div>
              {/* Small heading */}
              <div className="mb-2 flex items-center gap-2">
                <Clock3
                  size={14}
                  strokeWidth={2}
                  className="text-[#9b4b20]"
                />

                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#99512e]">
                  Visual Heritage Time Travel
                </span>
              </div>

              {/* Main heading */}
              <h1 className="font-serif text-[32px] font-bold leading-tight tracking-[-0.02em] text-[#30231c] sm:text-[38px] md:text-[42px]">
                Epochs &amp; Historical Eras
              </h1>

              {/* Subtitle */}
              <p className="mt-2 max-w-[650px] text-[13px] leading-6 text-[#776c65] sm:text-[14px]">
                Journey through different historical epochs and witness the
                living continuity from ancient origins to present day.
              </p>
            </div>

            {/* =====================================================
                YEAR INDICATOR
            ===================================================== */}
            <div className="flex shrink-0 items-center self-start rounded-xl border border-[#ddd4c8] bg-white p-1.5 shadow-sm">

              {/* Historical */}
              <div className="min-w-[86px] rounded-lg bg-[#f3eee8] px-3 py-2.5 text-center">
                <p className="text-[8px] font-medium uppercase tracking-wide text-[#9b8577]">
                  Historical Era
                </p>

                <p className="mt-0.5 text-[13px] font-bold text-[#965024]">
                  {activeRecord.year}
                </p>
              </div>

              {/* Time travel */}
              <div className="flex items-center justify-center px-3">
                <Clock3
                  size={14}
                  className="text-[#a16b4d]"
                  strokeWidth={1.8}
                />
              </div>

              {/* Present */}
              <div className="min-w-[86px] rounded-lg bg-[#e6f5ed] px-3 py-2.5 text-center">
                <p className="text-[8px] font-medium uppercase tracking-wide text-[#789385]">
                  Present Era
                </p>

                <p className="mt-0.5 text-[13px] font-bold text-[#43755d]">
                  2026
                </p>
              </div>
            </div>
          </div>

          {/* =======================================================
              TIMELINE
          ======================================================= */}
          <div className="relative mt-8 px-3 sm:px-8">

            {/* Timeline horizontal line */}
            <div className="absolute left-[38px] right-[38px] top-[24px] h-[2px] bg-[#dccbc0] sm:left-[48px] sm:right-[48px]" />

            <div className="relative flex items-start justify-between">

              {timelineRecords.map((record, index) => {
                const isActive = index === activeIndex;

                return (
                  <button
                    key={record.year}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="group flex w-[120px] flex-col items-center text-center sm:w-[190px]"
                  >
                    {/* Circle */}
                    <div
                      className={[
                        "relative z-10 flex h-[48px] w-[48px] items-center justify-center rounded-full border-[4px] transition-all duration-300",
                        isActive
                          ? "border-white bg-[#9d4b1e] text-white shadow-[0_0_0_1px_#9d4b1e]"
                          : "border-[#faf8f3] bg-white text-[#aaa09a] shadow-[0_0_0_1px_#d9cec5]",
                      ].join(" ")}
                    >
                      <Clock3 size={19} strokeWidth={1.8} />
                    </div>

                    {/* Year */}
                    <div
                      className={[
                        "mt-2 text-[13px] font-bold",
                        isActive ? "text-[#91461d]" : "text-[#8d8179]",
                      ].join(" ")}
                    >
                      {record.year}
                    </div>

                    {/* Label */}
                    <div
                      className={[
                        "mt-1 max-w-[140px] text-[10px] leading-4 sm:max-w-[180px] sm:text-[11px]",
                        isActive ? "text-[#756860]" : "text-[#9d928a]",
                      ].join(" ")}
                    >
                      {record.shortTitle}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* =======================================================
              ACTIVE TIMELINE CARD
          ======================================================= */}
          <div className="mt-9 overflow-hidden rounded-2xl border border-[#d8cec4] bg-white shadow-[0_6px_20px_rgba(74,48,32,0.08)]">

            {/* IMPORTANT:
                EXACTLY TWO COLUMNS ON DESKTOP
            */}
            <div className="grid grid-cols-1 md:grid-cols-2">

              {/* =================================================
                  LEFT IMAGE
              ================================================= */}
              <div className="relative h-[300px] overflow-hidden bg-black sm:h-[360px] md:h-[390px]">

                {/* Image */}
                <img
                  src={activeRecord.image}
                  alt={activeRecord.title}
                  className="absolute inset-0 h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                {/* Year badge */}
                <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 rounded-md bg-[#a14813] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm">
                  <Calendar size={13} />
                  {activeRecord.year}
                </div>
              </div>

              {/* =================================================
                  RIGHT CONTENT
              ================================================= */}
              <div className="flex min-h-[300px] flex-col justify-between p-6 sm:p-8 md:min-h-[390px] md:p-9">

                {/* Text */}
                <div>

                  {/* Active record label */}
                  <div className="mb-3 flex items-center gap-2">
                    <Clock3
                      size={14}
                      strokeWidth={1.8}
                      className="text-[#a25b36]"
                    />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a25b36]">
                      Active Timeline Record
                    </span>
                  </div>

                  {/* Title */}
                  <h2 className="font-serif text-[28px] font-bold leading-[1.15] text-[#30231c] sm:text-[32px]">
                    {activeRecord.title}
                  </h2>

                  {/* Description */}
                  <p className="mt-5 text-[13px] leading-6 text-[#746962] sm:text-[14px]">
                    {activeRecord.description}
                  </p>
                </div>

                {/* =================================================
                    BOTTOM NAVIGATION
                ================================================= */}
                <div className="mt-7">

                  {/* Divider */}
                  <div className="mb-4 h-px w-full bg-[#e5ddd6]" />

                  <div className="flex items-center justify-between">

                    {/* Previous */}
                    <button
                      type="button"
                      onClick={previousEra}
                      disabled={activeIndex === 0}
                      className={[
                        "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all",
                        activeIndex === 0
                          ? "cursor-not-allowed border-[#eee9e5] text-[#c6beb8]"
                          : "border-[#ded5cd] text-[#6d625b] hover:border-[#b98a6e] hover:bg-[#faf6f2] hover:text-[#8f461f]",
                      ].join(" ")}
                    >
                      <ChevronLeft size={14} />
                      Previous Era
                    </button>

                    {/* Counter */}
                    <span className="text-[11px] font-medium text-[#a09791]">
                      {activeIndex + 1} / {timelineRecords.length}
                    </span>

                    {/* Next */}
                    <button
                      type="button"
                      onClick={nextEra}
                      disabled={
                        activeIndex === timelineRecords.length - 1
                      }
                      className={[
                        "inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-[11px] font-semibold transition-all",
                        activeIndex === timelineRecords.length - 1
                          ? "cursor-not-allowed border-[#eee9e5] text-[#c6beb8]"
                          : "border-[#ded5cd] text-[#6d625b] hover:border-[#b98a6e] hover:bg-[#faf6f2] hover:text-[#8f461f]",
                      ].join(" ")}
                    >
                      Next Era
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            LOWER HERITAGE CARDS
        ========================================================= */}
        <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

          {/* Cultural Essence */}
          <div className="rounded-2xl border border-[#ddd4c8] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e9df] text-[#985025]">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a25b36]">
                  Cultural Essence
                </p>

                <h3 className="mt-1 font-serif text-xl font-bold text-[#33261f]">
                  Living Heritage
                </h3>
              </div>
            </div>

            <p className="text-[13px] leading-6 text-[#756960]">
              Odisha's heritage continues through architecture, rituals,
              festivals, crafts, traditions and communities that preserve
              cultural knowledge across generations.
            </p>
          </div>

          {/* Culinary */}
          <div className="rounded-2xl border border-[#ddd4c8] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3e9df] text-[#985025]">
                <Utensils size={19} />
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#a25b36]">
                  Culinary Heritage &amp; Sacred Prasada
                </p>

                <h3 className="mt-1 font-serif text-xl font-bold text-[#33261f]">
                  Mahaprasad
                </h3>
              </div>
            </div>

            <p className="text-[13px] leading-6 text-[#756960]">
              Mahaprasad is more than food; it forms an important part of
              Jagannath culture and Odisha's living culinary heritage.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExplorePage;