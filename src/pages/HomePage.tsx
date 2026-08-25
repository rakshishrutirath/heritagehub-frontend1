import React, { useEffect, useMemo, useState } from "react";

import { Artifact, NavigationTab } from "../types";
import { DashboardStats, api } from "../services/api";
import { ArtifactCard } from "../components/common/ArtifactCard";
import { useLanguage } from "../context/LanguageContext";

import {
  ArrowRight,
  Box,
  BookOpen,
  Compass,
  Layers,
  Users,
  ShieldCheck,
  Languages,
  Tags,
} from "lucide-react";

interface HomePageProps {
  onSelectTab: (tab: NavigationTab) => void;
  onSelectArtifact: (artifact: Artifact) => void;
  onOpen3D: (artifactId: string) => void;
  featuredArtifacts: Artifact[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onOpenAiDocent: () => void;
}

const EMPTY_STATS: DashboardStats = {
  total_records: 0,
  approved_records: 0,
  pending_records: 0,
  communities_involved: 0,
  languages_documented: 0,
  categories_covered: 0,
};

export const HomePage: React.FC<HomePageProps> = ({
  onSelectTab,
  onSelectArtifact,
  onOpen3D,
  featuredArtifacts,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  // =========================================================
  // LANGUAGE
  // =========================================================

  const { language } = useLanguage();

  const isOdia = language === "or";

  const t = {
    hero: {
      line1: isOdia ? "ଐତିହ୍ୟର" : "Preserving",
      line2: isOdia ? "ସଂରକ୍ଷଣ।" : "Heritage.",
      line3: isOdia ? "ପିଢ଼ିକୁ" : "Connecting",
      line4: isOdia ? "ଯୋଡ଼ିବା।" : "Generations.",

      description: isOdia
        ? "HeritageHub ମାଧ୍ୟମରେ ସାଂସ୍କୃତିକ ଐତିହ୍ୟକୁ ଖୋଜନ୍ତୁ, ଲିପିବଦ୍ଧ କରନ୍ତୁ, ଶିଖନ୍ତୁ, ଯାଞ୍ଚ କରନ୍ତୁ ଏବଂ ସଂରକ୍ଷଣ କରନ୍ତୁ।"
        : "Discover, document, learn, verify and preserve cultural heritage through HeritageHub.",

      button: isOdia ? "ଐତିହ୍ୟ ଖୋଜନ୍ତୁ" : "START EXPLORING",
    },

    stats: {
      heritageRecords: isOdia ? "ଐତିହ୍ୟ ରେକର୍ଡ" : "Heritage Records",
      approvedRecords: isOdia ? "ଅନୁମୋଦିତ ରେକର୍ଡ" : "Approved Records",
      pendingReview: isOdia ? "ଯାଞ୍ଚ ଅପେକ୍ଷାରେ" : "Pending Review",
    },

    heroCard: {
      featured: isOdia ? "ବିଶେଷ ଐତିହ୍ୟ ରେକର୍ଡ" : "Featured Heritage Record",
      archive: isOdia ? "HeritageHub ସଂଗ୍ରହାଳୟ" : "HeritageHub Archive",

      fallbackTitle: isOdia
        ? "ସାଂସ୍କୃତିକ ଐତିହ୍ୟର ସଂରକ୍ଷଣ"
        : "Preserving Cultural Heritage",

      fallbackDescription: isOdia
        ? "HeritageHub ମାଧ୍ୟମରେ ସଂରକ୍ଷିତ ଯାଞ୍ଚିତ ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ରେକର୍ଡଗୁଡ଼ିକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ।"
        : "Explore verified cultural heritage records preserved through the HeritageHub platform.",

      archiveSubtitle: isOdia
        ? "ଡିଜିଟାଲ୍ ଐତିହ୍ୟ ସଂଗ୍ରହ"
        : "Digital Heritage Archive",
    },

    platform: {
      label: isOdia ? "HeritageHub ପ୍ଲାଟଫର୍ମ" : "HeritageHub Platform",
      title: isOdia
        ? "ସଂରକ୍ଷଣ। ଅନ୍ୱେଷଣ। ଶିକ୍ଷା।"
        : "Preserve. Explore. Learn.",
    },

    explore: {
      title: isOdia ? "ଐତିହ୍ୟ ଅନ୍ୱେଷଣ" : "Explore Heritage",
      description: isOdia
        ? "ଐତିହ୍ୟ ସ୍ଥଳ, ସାଂସ୍କୃତିକ ପରମ୍ପରା, ଖାଦ୍ୟ, କାହାଣୀ ଏବଂ ଐତିହାସିକ ଯୁଗ ଖୋଜନ୍ତୁ।"
        : "Discover heritage places, cultural traditions, food, stories and historical eras.",
    },

    learn: {
      title: isOdia ? "ଶିଖନ୍ତୁ" : "Learn",
      description: isOdia
        ? "ନୃତ୍ୟ ଭଙ୍ଗୀ, ଭାଷାର ବାକ୍ୟାଂଶ, ସଙ୍ଗୀତ ଏବଂ ପାରମ୍ପରିକ ରୀତିନୀତି ଶିଖନ୍ତୁ।"
        : "Learn dance poses, language phrases, songs and ritual practices.",
    },

    community: {
      title: isOdia ? "ସମୁଦାୟ ଯାଞ୍ଚ" : "Community Verification",
      description: isOdia
        ? "ସମୁଦାୟ ଦ୍ୱାରା ଦାଖଲ ହୋଇଥିବା ଐତିହ୍ୟ ରେକର୍ଡଗୁଡ଼ିକୁ ସମୀକ୍ଷା ଏବଂ ଯାଞ୍ଚ କରନ୍ତୁ।"
        : "Review and verify contributed heritage records.",
    },

    heritage3D: {
      title: isOdia ? "3D ଐତିହ୍ୟ" : "3D Heritage",
      description: isOdia
        ? "ଅପଲୋଡ୍ କରାଯାଇଥିବା ଛବିରୁ ଏକ ଡିଜିଟାଲ୍ 3D ଐତିହ୍ୟ ମଡେଲ୍ ତିଆରି କରନ୍ତୁ।"
        : "Generate a digital 3D heritage model from an uploaded image.",
    },

    impact: {
      communities: isOdia ? "ସମୁଦାୟ" : "Communities",
      languages: isOdia ? "ଭାଷା" : "Languages",
      categories: isOdia ? "ବର୍ଗ" : "Categories",
      verified: isOdia ? "ଯାଞ୍ଚିତ" : "Verified",
    },

    records: {
      label: isOdia ? "ଐତିହ୍ୟ ରେକର୍ଡ" : "Heritage Records",
      title: isOdia ? "ସଂରକ୍ଷିତ ଐତିହ୍ୟ" : "Preserved Heritage",
      view: isOdia ? "ସମସ୍ତ ରେକର୍ଡ" : "View Records",

      empty: isOdia
        ? "କୌଣସି ଐତିହ୍ୟ ରେକର୍ଡ ଉପଲବ୍ଧ ନାହିଁ।"
        : "No heritage records available.",

      django: isOdia
        ? "Django ରୁ ଐତିହ୍ୟ ରେକର୍ଡ ଏଠାରେ ଦେଖାଯିବ।"
        : "Heritage records from Django will appear here.",
    },

    contribution: {
      label: isOdia ? "ସମୁଦାୟ ସଂରକ୍ଷଣ" : "Community Preservation",

      title: isOdia
        ? "ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ସଂରକ୍ଷଣରେ ସହଯୋଗ କରନ୍ତୁ।"
        : "Help preserve cultural heritage.",

      description: isOdia
        ? "ବର୍ଣ୍ଣନା, ଛବି, ଅଡିଓ, ବର୍ଗ, ଭାଷା ଏବଂ ସ୍ଥାନ ସୂଚନା ସହିତ ଐତିହ୍ୟ ରେକର୍ଡ ଦାଖଲ କରନ୍ତୁ।"
        : "Submit heritage records with descriptions, images, audio, category, language and location information for verification.",

      button: isOdia ? "ଐତିହ୍ୟ ଦାଖଲ କରନ୍ତୁ" : "Contribute Heritage",
    },

    marketplace: {
      title: isOdia ? "ବଜାର" : "Marketplace",
      description: isOdia
        ? "HeritageHub ମାଧ୍ୟମରେ ଉପଲବ୍ଧ ସାଂସ୍କୃତିକ ଉତ୍ପାଦଗୁଡ଼ିକୁ ଖୋଜନ୍ତୁ।"
        : "Discover cultural products available through HeritageHub.",
    },

    canvas: {
      title: isOdia ? "କ୍ୟାନଭାସ୍" : "Canvas",
      description: isOdia
        ? "ଐତିହ୍ୟ ଆଧାରିତ କଳାକୃତି ତିଆରି କରନ୍ତୁ ଏବଂ ସଂରକ୍ଷଣ କରନ୍ତୁ।"
        : "Create and save heritage artwork.",
    },
  };

  // =========================================================
  // REAL DJANGO DASHBOARD STATS
  // =========================================================

  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load dashboard stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, []);

  // =========================================================
  // FEATURED REAL HERITAGE RECORD
  // =========================================================

  const heroArtifact = useMemo(() => {
    return featuredArtifacts[0] || null;
  }, [featuredArtifacts]);

  const heroImage =
    heroArtifact?.imageUrl &&
    !heroArtifact.imageUrl.includes("placehold.co")
      ? heroArtifact.imageUrl
      : null;

  const displayNumber = (value: number) => {
    if (statsLoading) {
      return "...";
    }

    return value.toString();
  };

  return (
    <div
      className="
        w-full min-h-screen
        bg-[#faf9f5] text-[#1b1c1a]
        dark:bg-[#121210] dark:text-[#f5f1e8]
        transition-colors duration-300
      "
    >
      
     {/* =====================================================
    HERO — CINEMATIC ODISHA BACKGROUND
===================================================== */}

<section
  className="
    relative
    min-h-[calc(100vh-80px)]
    w-full
    overflow-hidden
    bg-cover
    bg-center
    bg-no-repeat
  "
  style={{
    backgroundImage: "url('/images/heritage-bg.png')",
  }}
>
  {/* Background darkness */}
  <div
    className="
      absolute
      inset-0
      bg-black/30
      pointer-events-none
    "
  />

  {/* Gradient so text stays readable */}
  <div
    className="
      absolute
      inset-0
      pointer-events-none
      bg-gradient-to-r
      from-black/55
      via-black/20
      to-transparent
    "
  />

  {/* MAIN HERO CONTENT */}
  <div
    className="
      relative
      z-10
      max-w-[1440px]
      mx-auto
      px-5
      md:px-16
      py-12
      md:py-16
      lg:py-20
      grid
      grid-cols-1
      lg:grid-cols-12
      gap-10
      lg:gap-12
      items-center
      min-h-[calc(100vh-80px)]
    "
  > 

    {/* ===================================================
        LEFT SIDE
    =================================================== */}

    <div
      className="
        lg:col-span-5
        flex
        flex-col
        gap-6
        md:gap-7
      "
    >

      {/* Small Odisha label */}

      <div
        className="
          flex
          items-center
          gap-4
          text-[#ff7547]
          text-[11px]
          md:text-[12px]
          uppercase
          tracking-[0.35em]
          font-bold
        "
      >
        <span>
          {isOdia ? "ଓଡ଼ିଶା • ଭାରତ" : "ODISHA • INDIA"}
        </span>

        <div
          className="
            hidden
            sm:block
            w-24
            h-[1px]
            bg-[#ff7547]
          "
        />
      </div>

      {/* =================================================
          HERO TITLE
      ================================================= */}

      <h1
        className="
          text-[45px]
          sm:text-[55px]
          md:text-[65px]
          lg:text-[72px]
          xl:text-[78px]

          font-display
          font-bold

          text-white

          leading-[0.98]
          tracking-[-0.035em]

          drop-shadow-[0_4px_20px_rgba(0,0,0,0.45)]
        "
      >
        {t.hero.line1}

        <br />

        {t.hero.line2}

        <br />

        {t.hero.line3}

        <br />

        {/* Orange final line */}

        <span className="text-[#ff7547]">
          {t.hero.line4}
        </span>
      </h1>

      {/* =================================================
          DESCRIPTION
      ================================================= */}

      <p
        className="
          text-[16px]
          md:text-[18px]

          text-white/85

          max-w-md

          leading-[1.7]

          drop-shadow-md
        "
      >
        {t.hero.description}
      </p>

      {/* =================================================
          BUTTON
      ================================================= */}

      <div className="pt-1">
        <button
          onClick={() => onSelectTab("explore")}
          className="
            bg-[#e85c32]

            text-white

            font-sans
            text-[12px]

            uppercase
            font-bold

            tracking-[0.12em]

            px-8
            py-4

            rounded-lg

            hover:bg-[#ff7045]
            hover:-translate-y-[2px]

            transition-all
            duration-300

            cursor-pointer

            shadow-[0_10px_35px_rgba(232,92,50,0.30)]

            inline-flex
            items-center
            gap-3
          "
        >
          {t.hero.button}

          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* =================================================
          DJANGO STATS
      ================================================= */}

      <div
        className="
          mt-3
          pt-6

          border-t
          border-white/20

          grid
          grid-cols-3
          gap-5
        "
      >
        <div>
          <span
            className="
              font-display
              font-bold
              text-[22px]
              text-white
              block
            "
          >
            {displayNumber(stats.total_records)}
          </span>

          <span
            className="
              text-white/60
              uppercase
              tracking-wider
              text-[9px]
              md:text-[10px]
              font-semibold
            "
          >
            {t.stats.heritageRecords}
          </span>
        </div>

        <div>
          <span
            className="
              font-display
              font-bold
              text-[22px]
              text-[#ff7547]
              block
            "
          >
            {displayNumber(stats.approved_records)}
          </span>

          <span
            className="
              text-white/60
              uppercase
              tracking-wider
              text-[9px]
              md:text-[10px]
              font-semibold
            "
          >
            {t.stats.approvedRecords}
          </span>
        </div>

        <div>
          <span
            className="
              font-display
              font-bold
              text-[22px]
              text-[#e3bd52]
              block
            "
          >
            {displayNumber(stats.pending_records)}
          </span>

          <span
            className="
              text-white/60
              uppercase
              tracking-wider
              text-[9px]
              md:text-[10px]
              font-semibold
            "
          >
            {t.stats.pendingReview}
          </span>
        </div>
      </div>
    </div>

    {/* ===================================================
        RIGHT SIDE — HERITAGE VIDEO
    =================================================== */}

    <div
      className="
        lg:col-span-7

        h-[380px]
        sm:h-[500px]
        lg:h-[600px]

        w-full

        overflow-hidden

        relative

        bg-black

        rounded-[22px]

        border
        border-white/15

        shadow-[0_30px_80px_rgba(0,0,0,0.55)]
      "
    >

      {/* VIDEO */}

      <video
        src="/videos/heritage.mp4"
        autoPlay
        loop
        playsInline
        controls
        className="
          absolute
          inset-0

          w-full
          h-full

          object-cover
        "
      >
        Your browser does not support the video tag.
      </video>

      {/* Very subtle video overlay */}

      <div
        className="
          absolute
          inset-0
          bg-black/5
          pointer-events-none
        "
      />

      {/* =================================================
          VIDEO INFORMATION
      ================================================= */}

      <div
        className="
          absolute
          bottom-5
          left-5
          right-5
          pointer-events-none
        "
      >
        <div
          className="
            inline-block

            bg-black/65

            backdrop-blur-md

            px-4
            py-3

            text-white

            border
            border-white/10

            rounded-lg

            shadow-lg
          "
        >
          <span
            className="
              text-[9px]
              tracking-[0.18em]
              uppercase
              font-bold
              text-[#ff7547]
              block
              mb-1
            "
          >
            {isOdia ? "ଐତିହ୍ୟ ଭିଡିଓ" : "HERITAGE VIDEO"}
          </span>

          <h3
            className="
              font-display
              text-[18px]
              font-bold
              leading-tight
            "
          >
            {isOdia ? "ହେରିଟେଜ୍ ହବ୍" : "HeritageHub"}
          </h3>

          <p
            className="
              text-[11px]
              text-white/70
              mt-1
            "
          >
            {isOdia
              ? "ଓଡ଼ିଶାର ଐତିହ୍ୟକୁ ଦୃଶ୍ୟରେ ଅନୁଭବ କରନ୍ତୁ।"
              : "Experience Odisha's heritage through moving visuals."}
          </p>
        </div>
      </div>
    </div>
  </div>

  {/* =====================================================
      BOTTOM DECORATION
  ===================================================== */}

  <div
    className="
      absolute
      bottom-6
      left-0
      right-0

      z-10

      hidden
      lg:flex

      justify-center

      pointer-events-none
    "
  >
    <div
      className="
        text-white/60
        text-[11px]
        tracking-[0.15em]
        uppercase
      "
    >
      {isOdia ? "ଐତିହ୍ୟ ଅନ୍ୱେଷଣ କରନ୍ତୁ" : "Scroll to explore"}
    </div>
  </div>
</section>

      {/* =====================================================
          PLATFORM MODULES
      ===================================================== */}

      <section
        className="
          w-full
          bg-[#efeeea]
          dark:bg-[#1b1a18]
          border-y border-[#c4c7c7]/40
          dark:border-white/10
          py-12 md:py-16
          transition-colors
        "
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-16">
          <div className="mb-8">
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94492d] dark:text-[#d88667]">
              {t.platform.label}
            </span>

            <h2 className="font-display font-bold text-[30px] md:text-[38px] mt-2 dark:text-white">
              {t.platform.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* EXPLORE */}

            <div
              onClick={() => onSelectTab("explore")}
              className="
                p-6
                bg-[#faf9f5] dark:bg-[#242321]
                border border-[#c4c7c7]/40 dark:border-white/10
                rounded-xl
                hover:border-[#94492d]
                transition-all cursor-pointer group
              "
            >
              <div className="w-10 h-10 rounded-lg bg-[#efeeea] dark:bg-[#33312e] flex items-center justify-center text-[#94492d] mb-4 group-hover:bg-[#94492d] group-hover:text-white transition-colors">
                <Compass className="w-5 h-5" />
              </div>

              <h3 className="text-[17px] font-display font-bold mb-1.5 dark:text-white">
                {t.explore.title}
              </h3>

              <p className="text-[13px] text-[#444748] dark:text-[#b9b5ad] leading-relaxed">
                {t.explore.description}
              </p>
            </div>

            {/* LEARN */}

            <div
              onClick={() => onSelectTab("learn")}
              className="
                p-6
                bg-[#faf9f5] dark:bg-[#242321]
                border border-[#c4c7c7]/40 dark:border-white/10
                rounded-xl
                hover:border-[#94492d]
                transition-all cursor-pointer group
              "
            >
              <div className="w-10 h-10 rounded-lg bg-[#efeeea] dark:bg-[#33312e] flex items-center justify-center text-[#94492d] mb-4 group-hover:bg-[#94492d] group-hover:text-white transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>

              <h3 className="text-[17px] font-display font-bold mb-1.5 dark:text-white">
                {t.learn.title}
              </h3>

              <p className="text-[13px] text-[#444748] dark:text-[#b9b5ad] leading-relaxed">
                {t.learn.description}
              </p>
            </div>

            {/* COMMUNITY */}

            <div
              onClick={() => onSelectTab("community")}
              className="
                p-6
                bg-[#faf9f5] dark:bg-[#242321]
                border border-[#c4c7c7]/40 dark:border-white/10
                rounded-xl
                hover:border-[#94492d]
                transition-all cursor-pointer group
              "
            >
              <div className="w-10 h-10 rounded-lg bg-[#efeeea] dark:bg-[#33312e] flex items-center justify-center text-[#94492d] mb-4 group-hover:bg-[#94492d] group-hover:text-white transition-colors">
                <Users className="w-5 h-5" />
              </div>

              <h3 className="text-[17px] font-display font-bold mb-1.5 dark:text-white">
                {t.community.title}
              </h3>

              <p className="text-[13px] text-[#444748] dark:text-[#b9b5ad] leading-relaxed">
                {t.community.description}
              </p>
            </div>

            {/* 3D */}

            <div
              onClick={() => onSelectTab("3d-heritage")}
              className="
                p-6
                bg-[#faf9f5] dark:bg-[#242321]
                border border-[#c4c7c7]/40 dark:border-white/10
                rounded-xl
                hover:border-[#94492d]
                transition-all cursor-pointer group
              "
            >
              <div className="w-10 h-10 rounded-lg bg-[#efeeea] dark:bg-[#33312e] flex items-center justify-center text-[#94492d] mb-4 group-hover:bg-[#94492d] group-hover:text-white transition-colors">
                <Box className="w-5 h-5" />
              </div>

              <h3 className="text-[17px] font-display font-bold mb-1.5 dark:text-white">
                {t.heritage3D.title}
              </h3>

              <p className="text-[13px] text-[#444748] dark:text-[#b9b5ad] leading-relaxed">
                {t.heritage3D.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          DATABASE IMPACT
      ===================================================== */}

      <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          <div className="border border-[#c4c7c7]/40 dark:border-white/10 p-6">
            <Users className="w-5 h-5 text-[#94492d] mb-3" />

            <div className="font-display text-3xl font-bold">
              {displayNumber(stats.communities_involved)}
            </div>

            <div className="text-xs uppercase tracking-wider text-[#747878] dark:text-[#aaa69e] mt-2">
              {t.impact.communities}
            </div>
          </div>

          <div className="border border-[#c4c7c7]/40 dark:border-white/10 p-6">
            <Languages className="w-5 h-5 text-[#94492d] mb-3" />

            <div className="font-display text-3xl font-bold">
              {displayNumber(stats.languages_documented)}
            </div>

            <div className="text-xs uppercase tracking-wider text-[#747878] dark:text-[#aaa69e] mt-2">
              {t.impact.languages}
            </div>
          </div>

          <div className="border border-[#c4c7c7]/40 dark:border-white/10 p-6">
            <Tags className="w-5 h-5 text-[#94492d] mb-3" />

            <div className="font-display text-3xl font-bold">
              {displayNumber(stats.categories_covered)}
            </div>

            <div className="text-xs uppercase tracking-wider text-[#747878] dark:text-[#aaa69e] mt-2">
              {t.impact.categories}
            </div>
          </div>

          <div className="border border-[#c4c7c7]/40 dark:border-white/10 p-6">
            <ShieldCheck className="w-5 h-5 text-[#94492d] mb-3" />

            <div className="font-display text-3xl font-bold">
              {displayNumber(stats.approved_records)}
            </div>

            <div className="text-xs uppercase tracking-wider text-[#747878] dark:text-[#aaa69e] mt-2">
              {t.impact.verified}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          REAL HERITAGE RECORDS
      ===================================================== */}

      <section className="max-w-[1440px] mx-auto px-5 md:px-16 py-16 md:py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#94492d] dark:text-[#d88667] block mb-1">
              {t.records.label}
            </span>

            <h2 className="text-[32px] md:text-[38px] font-display font-bold text-[#1b1c1a] dark:text-white">
              {t.records.title}
            </h2>
          </div>

          <button
            onClick={() => onSelectTab("explore")}
            className="text-[13px] font-semibold uppercase tracking-wider text-[#1b1c1a] dark:text-white hover:text-[#94492d] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {t.records.view}

            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {featuredArtifacts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArtifacts.slice(0, 4).map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onSelect={onSelectArtifact}
                onOpen3D={onOpen3D}
                isBookmarked={bookmarkedIds.includes(artifact.id)}
                onToggleBookmark={onToggleBookmark}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-[#c4c7c7] dark:border-white/20 p-12 text-center">
            <p className="font-display text-xl font-bold">
              {t.records.empty}
            </p>

            <p className="text-[#747878] dark:text-[#aaa69e] text-sm mt-2">
              {t.records.django}
            </p>
          </div>
        )}
      </section>

      {/* =====================================================
          CONTRIBUTION
      ===================================================== */}

      <section className="max-w-[1440px] mx-auto px-5 md:px-16 pb-20">
        <div className="bg-[#1c1b1b] dark:bg-[#090908] text-white p-8 md:p-12 rounded-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-[#cca730] text-[11px] uppercase tracking-[0.15em] font-bold">
                {t.contribution.label}
              </span>

              <h3 className="font-display text-[30px] md:text-[38px] font-bold mt-3">
                {t.contribution.title}
              </h3>

              <p className="text-[#c4c7c7] mt-4 leading-relaxed max-w-xl">
                {t.contribution.description}
              </p>

              <button
                onClick={() => onSelectTab("contribute")}
                className="mt-7 bg-[#94492d] hover:bg-[#773319] px-6 py-3 text-xs tracking-widest uppercase font-bold transition-colors inline-flex items-center gap-2"
              >
                {t.contribution.button}

                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* MARKETPLACE */}

              <button
                onClick={() => onSelectTab("marketplace")}
                className="border border-white/20 p-6 text-left hover:border-[#cca730] transition-colors"
              >
                <h4 className="font-display font-bold text-lg">
                  {t.marketplace.title}
                </h4>

                <p className="text-[#c4c7c7] text-xs mt-2">
                  {t.marketplace.description}
                </p>
              </button>

              {/* CANVAS */}

              <button
                onClick={() => onSelectTab("canvas")}
                className="border border-white/20 p-6 text-left hover:border-[#cca730] transition-colors"
              >
                <Layers className="w-5 h-5 text-[#cca730] mb-3" />

                <h4 className="font-display font-bold text-lg">
                  {t.canvas.title}
                </h4>

                <p className="text-[#c4c7c7] text-xs mt-2">
                  {t.canvas.description}
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};