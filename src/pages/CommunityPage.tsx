import { useEffect, useState } from "react";

import {
  CheckCircle,
  XCircle,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Volume2,
  FileText,
  Calendar,
} from "lucide-react";

import api from "../services/api";
import { useLanguage } from "../context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

interface HeritageRecord {
  id: string;
  title: string;
  description: string;

  image: string | null;
  audio: string | null;

  ai_summary: string | null;
  ai_tags: string | null;
  ai_translation: string | null;

  consent_given: boolean;

  status:
    | "pending"
    | "approved"
    | "rejected";

  qr_code: string | null;

  created_at: string;

  category: number | null;
  language: number | null;
  location: number | null;

  contributor: number;

  verified_by: number | null;
}

/* =========================================================
   COMPONENT
========================================================= */

export function CommunityPage() {
  /* =======================================================
     LANGUAGE
  ======================================================= */

  const {
    language,
  } = useLanguage();

  const isOdia =
    language === "or";

  /* =======================================================
     TRANSLATIONS
  ======================================================= */

  const t = {
    eyebrow:
      isOdia
        ? "ସମୁଦାୟ ଯାଞ୍ଚ"
        : "COMMUNITY VERIFICATION",

    title:
      isOdia
        ? "ଐତିହ୍ୟ ଯାଞ୍ଚ"
        : "Heritage Verification",

    description:
      isOdia
        ? "ସମୁଦାୟ ଦ୍ୱାରା ଦାଖଲ ହୋଇଥିବା ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ରେକର୍ଡଗୁଡ଼ିକୁ ଯାଞ୍ଚ କରନ୍ତୁ, ତାପରେ ସେଗୁଡ଼ିକ HeritageHub ର ସତ୍ୟାପିତ ସଂଗ୍ରହର ଅଂଶ ହେବ।"
        : "Review community-submitted cultural heritage records before they become part of the verified HeritageHub archive.",

    loading:
      isOdia
        ? "ଐତିହ୍ୟ ରେକର୍ଡ ଲୋଡ୍ ହେଉଛି..."
        : "Loading heritage records...",

    pending:
      isOdia
        ? "ଯାଞ୍ଚ ଅପେକ୍ଷାରେ"
        : "Pending Verification",

    refresh:
      isOdia
        ? "ପୁନଃ ଲୋଡ୍"
        : "Refresh",

    allCaughtUp:
      isOdia
        ? "ସବୁ ଯାଞ୍ଚ ସମ୍ପୂର୍ଣ୍ଣ"
        : "All caught up",

    noPending:
      isOdia
        ? "ବର୍ତ୍ତମାନ କୌଣସି ଐତିହ୍ୟ ରେକର୍ଡ ଯାଞ୍ଚ ପାଇଁ ଅପେକ୍ଷାରେ ନାହିଁ।"
        : "There are currently no heritage records waiting for verification.",

    pendingReview:
      isOdia
        ? "ଯାଞ୍ଚ ଅପେକ୍ଷାରେ"
        : "Pending Review",

    category:
      isOdia
        ? "ବର୍ଗ ID"
        : "Category ID",

    language:
      isOdia
        ? "ଭାଷା ID"
        : "Language ID",

    location:
      isOdia
        ? "ସ୍ଥାନ ID"
        : "Location ID",

    audio:
      isOdia
        ? "ସାଂସ୍କୃତିକ ଅଡିଓ"
        : "Cultural Audio",

    audioUnsupported:
      isOdia
        ? "ଆପଣଙ୍କ ବ୍ରାଉଜର ଅଡିଓ ପ୍ଲେବ୍ୟାକ୍ ସମର୍ଥନ କରେନାହିଁ।"
        : "Your browser does not support audio playback.",

    aiSummary:
      isOdia
        ? "AI ଐତିହ୍ୟ ସାରାଂଶ"
        : "AI Heritage Summary",

    aiTags:
      isOdia
        ? "AI ଟ୍ୟାଗ"
        : "AI Tags",

    aiTranslation:
      isOdia
        ? "AI ଅନୁବାଦ"
        : "AI Translation",

    consent:
      isOdia
        ? "ସମ୍ମତି"
        : "Consent",

    given:
      isOdia
        ? "ଦିଆଯାଇଛି"
        : "Given",

    notGiven:
      isOdia
        ? "ଦିଆଯାଇନାହିଁ"
        : "Not Given",

    recordId:
      isOdia
        ? "ରେକର୍ଡ ID"
        : "Record ID",

    approve:
      isOdia
        ? "ରେକର୍ଡ ଅନୁମୋଦନ"
        : "Approve Record",

    reject:
      isOdia
        ? "ରେକର୍ଡ ପ୍ରତ୍ୟାଖ୍ୟାନ"
        : "Reject Record",

    processing:
      isOdia
        ? "ପ୍ରକ୍ରିୟା ଚାଲିଛି..."
        : "Processing...",

    approvedSuccess:
      isOdia
        ? "ଐତିହ୍ୟ ରେକର୍ଡ ସଫଳତାର ସହ ଅନୁମୋଦିତ ହୋଇଛି।"
        : "Heritage record approved successfully.",

    rejectedSuccess:
      isOdia
        ? "ଐତିହ୍ୟ ରେକର୍ଡ ସଫଳତାର ସହ ପ୍ରତ୍ୟାଖ୍ୟାନ ହୋଇଛି।"
        : "Heritage record rejected successfully.",

    unableLoad:
      isOdia
        ? "ଐତିହ୍ୟ ରେକର୍ଡ ଲୋଡ୍ କରିହେଲା ନାହିଁ।"
        : "Unable to load heritage records.",

    unableReview:
      isOdia
        ? "ଏହି ଐତିହ୍ୟ ରେକର୍ଡକୁ ଯାଞ୍ଚ କରିହେଲା ନାହିଁ।"
        : "Unable to review this heritage record.",

    reviewWorkspace:
      isOdia
        ? "ସଂରକ୍ଷଣ ଯାଞ୍ଚ କେନ୍ଦ୍ର"
        : "Preservation Review Workspace",
  };

  /* =======================================================
     STATE
  ======================================================= */

  const [
    records,
    setRecords,
  ] =
    useState<HeritageRecord[]>(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    processingId,
    setProcessingId,
  ] =
    useState<string | null>(
      null
    );

  const [
    error,
    setError,
  ] =
    useState("");

  const [
    message,
    setMessage,
  ] =
    useState("");

  /* =======================================================
     LOAD HERITAGE RECORDS
  ======================================================= */

  const loadRecords =
    async () => {
      try {
        setLoading(true);

        setError("");

        const data =
          await api.getHeritageRecords();

        console.log(
          "Heritage records:",
          data
        );

        if (
          !Array.isArray(
            data
          )
        ) {
          setRecords(
            []
          );

          return;
        }

        const pendingRecords =
          data.filter(
            (
              record
            ) =>
              record.status ===
              "pending"
          );

        setRecords(
          pendingRecords
        );
      } catch (
        err
      ) {
        console.error(
          "Failed to load heritage records:",
          err
        );

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            t.unableLoad
          );
        }
      } finally {
        setLoading(
          false
        );
      }
    };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadRecords();
  }, []);

  /* =======================================================
     REVIEW
  ======================================================= */

  const handleReview =
    async (
      recordId: string,
      action:
        | "approved"
        | "rejected"
    ) => {
      try {
        setProcessingId(
          recordId
        );

        setError("");
        setMessage("");

        const comment =
          action === "approved"
            ? "Heritage record verified by community reviewer."
            : "Heritage record rejected by community reviewer.";

        const response =
          await api.reviewRecord(
            recordId,
            action,
            comment
          );

        console.log(
          "Review response:",
          response
        );

        if (
          action ===
          "approved"
        ) {
          setMessage(
            t.approvedSuccess
          );
        } else {
          setMessage(
            t.rejectedSuccess
          );
        }

        setRecords(
          (
            previousRecords
          ) =>
            previousRecords.filter(
              (
                record
              ) =>
                record.id !==
                recordId
            )
        );
      } catch (
        err
      ) {
        console.error(
          "Heritage review failed:",
          err
        );

        if (
          err instanceof Error
        ) {
          setError(
            err.message
          );
        } else {
          setError(
            t.unableReview
          );
        }
      } finally {
        setProcessingId(
          null
        );
      }
    };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-[75vh]
          flex
          items-center
          justify-center
          bg-[#faf9f5]
          dark:bg-[#12100f]
          transition-colors
        "
      >
        <div className="text-center">
          <RefreshCw
            className="
              w-8
              h-8
              animate-spin
              mx-auto
              mb-4
              text-[#94492d]
              dark:text-[#d97955]
            "
          />

          <p
            className="
              text-sm
              uppercase
              tracking-widest
              text-[#747878]
              dark:text-[#aaa39c]
            "
          >
            {t.loading}
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     PAGE
  ======================================================= */

  return (
    <main
      className="
        min-h-screen
        bg-[#faf9f5]
        dark:bg-[#12100f]
        text-[#1b1c1a]
        dark:text-[#f3eee7]
        transition-colors
        duration-300
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          md:px-10
          py-14
          md:py-20
        "
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <section className="mb-14">
          <div
            className="
              flex
              items-center
              gap-2
              text-[#94492d]
              dark:text-[#d97955]
              mb-4
            "
          >
            <ShieldCheck
              size={18}
            />

            <span
              className="
                text-xs
                font-semibold
                tracking-[0.2em]
                uppercase
              "
            >
              {t.eyebrow}
            </span>
          </div>

          <h1
            className="
              font-display
              text-4xl
              md:text-6xl
              font-semibold
              tracking-[-0.03em]
              leading-[1.05]
              mb-5
            "
          >
            {t.title}
          </h1>

          <p
            className="
              text-[#5e5d58]
              dark:text-[#aaa39c]
              max-w-2xl
              leading-7
              text-[15px]
              md:text-[16px]
            "
          >
            {t.description}
          </p>
        </section>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (
          <div
            className="
              mb-8
              border
              border-green-300
              dark:border-green-900
              bg-green-50
              dark:bg-green-950/30
              p-4
            "
          >
            <p
              className="
                text-green-800
                dark:text-green-300
                text-sm
              "
            >
              {message}
            </p>
          </div>
        )}

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div
            className="
              mb-8
              border
              border-red-300
              dark:border-red-900
              bg-red-50
              dark:bg-red-950/30
              p-4
            "
          >
            <p
              className="
                text-red-700
                dark:text-red-300
                text-sm
              "
            >
              {error}
            </p>
          </div>
        )}

        {/* =================================================
            SUMMARY BAR
        ================================================= */}

        <section
          className="
            flex
            items-center
            justify-between
            gap-6
            border-y
            border-[#d5d0ca]
            dark:border-[#3b3531]
            py-6
            mb-10
          "
        >
          <div>
            <p
              className="
                text-[10px]
                uppercase
                tracking-[0.16em]
                text-[#747878]
                dark:text-[#aaa39c]
              "
            >
              {t.pending}
            </p>

            <p
              className="
                font-display
                text-4xl
                mt-1
              "
            >
              {records.length}
            </p>
          </div>

          <button
            type="button"
            onClick={
              loadRecords
            }
            className="
              flex
              items-center
              gap-2
              border
              border-[#c4c7c7]
              dark:border-[#4a433e]
              px-5
              py-3
              text-[11px]
              uppercase
              tracking-[0.12em]
              font-bold
              bg-transparent
              hover:bg-[#efeeea]
              dark:hover:bg-[#201c19]
              transition-colors
            "
          >
            <RefreshCw
              size={15}
            />

            {t.refresh}
          </button>
        </section>

        {/* =================================================
            EMPTY STATE
        ================================================= */}

        {records.length ===
          0 && (
          <section
            className="
              border
              border-[#d5d0ca]
              dark:border-[#3b3531]
              bg-white
              dark:bg-[#1c1917]
              py-20
              px-6
              text-center
            "
          >
            <CheckCircle
              size={46}
              className="
                mx-auto
                text-green-600
                dark:text-green-400
                mb-5
              "
            />

            <h2
              className="
                font-display
                text-3xl
                mb-3
              "
            >
              {t.allCaughtUp}
            </h2>

            <p
              className="
                text-[#747878]
                dark:text-[#aaa39c]
                max-w-lg
                mx-auto
              "
            >
              {t.noPending}
            </p>
          </section>
        )}

        {/* =================================================
            RECORDS
        ================================================= */}

        <div className="space-y-10">
          {records.map(
            (
              record
            ) => (
              <article
                key={
                  record.id
                }
                className="
                  border
                  border-[#d5d0ca]
                  dark:border-[#3b3531]
                  bg-white
                  dark:bg-[#1c1917]
                  overflow-hidden
                  shadow-sm
                "
              >
                {/* IMAGE */}

                {record.image && (
                  <div
                    className="
                      w-full
                      h-[300px]
                      md:h-[420px]
                      overflow-hidden
                      bg-[#efeeea]
                      dark:bg-[#151311]
                    "
                  >
                    <img
                      src={
                        record.image
                      }
                      alt={
                        record.title
                      }
                      className="
                        w-full
                        h-full
                        object-cover
                      "
                    />
                  </div>
                )}

                {/* CONTENT */}

                <div
                  className="
                    p-7
                    md:p-10
                  "
                >
                  {/* STATUS */}

                  <div
                    className="
                      flex
                      flex-col
                      sm:flex-row
                      sm:items-center
                      justify-between
                      gap-3
                      mb-7
                    "
                  >
                    <span
                      className="
                        text-[10px]
                        tracking-[0.18em]
                        uppercase
                        text-[#94492d]
                        dark:text-[#d97955]
                        font-bold
                      "
                    >
                      {t.pendingReview}
                    </span>

                    <span
                      className="
                        text-xs
                        text-[#9a9893]
                        dark:text-[#77716c]
                        flex
                        items-center
                        gap-1.5
                      "
                    >
                      <Calendar
                        className="
                          w-3.5
                          h-3.5
                        "
                      />

                      {record.created_at
                        ? new Date(
                            record.created_at
                          ).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* TITLE */}

                  <h2
                    className="
                      font-display
                      text-3xl
                      md:text-4xl
                      tracking-[-0.02em]
                      mb-5
                    "
                  >
                    {record.title}
                  </h2>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      text-[#555550]
                      dark:text-[#c1bab4]
                      leading-7
                      mb-8
                    "
                  >
                    {
                      record.description
                    }
                  </p>

                  {/* METADATA */}

                  <div
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-3
                      gap-5
                      border-y
                      border-[#e2ded9]
                      dark:border-[#39332f]
                      py-6
                      mb-8
                    "
                  >
                    <MetadataItem
                      label={
                        t.category
                      }
                      value={
                        record.category ??
                        "—"
                      }
                    />

                    <MetadataItem
                      label={
                        t.language
                      }
                      value={
                        record.language ??
                        "—"
                      }
                    />

                    <MetadataItem
                      label={
                        t.location
                      }
                      value={
                        record.location ??
                        "—"
                      }
                    />
                  </div>

                  {/* AUDIO */}

                  {record.audio && (
                    <section className="mb-8">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-[10px]
                          uppercase
                          tracking-[0.15em]
                          font-bold
                          text-[#747878]
                          dark:text-[#aaa39c]
                          mb-3
                        "
                      >
                        <Volume2
                          className="
                            w-4
                            h-4
                          "
                        />

                        {t.audio}
                      </div>

                      <audio
                        controls
                        className="w-full"
                      >
                        <source
                          src={
                            record.audio
                          }
                        />

                        {
                          t.audioUnsupported
                        }
                      </audio>
                    </section>
                  )}

                  {/* AI SUMMARY */}

                  {record.ai_summary && (
                    <section
                      className="
                        bg-[#f4efe9]
                        dark:bg-[#151311]
                        border
                        border-[#ded6cf]
                        dark:border-[#39332f]
                        p-6
                        mb-7
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                          text-[10px]
                          uppercase
                          tracking-[0.15em]
                          text-[#94492d]
                          dark:text-[#d97955]
                          font-bold
                          mb-3
                        "
                      >
                        <Sparkles
                          className="
                            w-4
                            h-4
                          "
                        />

                        {t.aiSummary}
                      </div>

                      <p
                        className="
                          text-sm
                          leading-7
                          text-[#555550]
                          dark:text-[#c1bab4]
                        "
                      >
                        {
                          record.ai_summary
                        }
                      </p>
                    </section>
                  )}

                  {/* AI TAGS */}

                  {record.ai_tags && (
                    <section className="mb-7">
                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.15em]
                          text-[#747878]
                          dark:text-[#aaa39c]
                          mb-3
                          font-bold
                        "
                      >
                        {t.aiTags}
                      </p>

                      <div
                        className="
                          flex
                          flex-wrap
                          gap-2
                        "
                      >
                        {record.ai_tags
                          .split(",")
                          .map(
                            (
                              tag
                            ) =>
                              tag.trim()
                          )
                          .filter(
                            Boolean
                          )
                          .map(
                            (
                              tag
                            ) => (
                              <span
                                key={
                                  tag
                                }
                                className="
                                  px-3
                                  py-1.5
                                  border
                                  border-[#d5d0ca]
                                  dark:border-[#4a433e]
                                  text-xs
                                  text-[#555550]
                                  dark:text-[#c1bab4]
                                "
                              >
                                #{tag}
                              </span>
                            )
                          )}
                      </div>
                    </section>
                  )}

                  {/* AI TRANSLATION */}

                  {record.ai_translation && (
                    <section className="mb-7">
                      <p
                        className="
                          text-[10px]
                          uppercase
                          tracking-[0.15em]
                          text-[#747878]
                          dark:text-[#aaa39c]
                          mb-3
                          font-bold
                        "
                      >
                        {
                          t.aiTranslation
                        }
                      </p>

                      <p
                        className="
                          text-sm
                          leading-7
                          text-[#555550]
                          dark:text-[#c1bab4]
                        "
                      >
                        {
                          record.ai_translation
                        }
                      </p>
                    </section>
                  )}

                  {/* CONSENT */}

                  <section className="mb-7">
                    <p className="text-sm">
                      {t.consent}:

                      <span
                        className={
                          record.consent_given
                            ? "text-green-700 dark:text-green-400 font-semibold ml-2"
                            : "text-red-700 dark:text-red-400 font-semibold ml-2"
                        }
                      >
                        {record.consent_given
                          ? t.given
                          : t.notGiven}
                      </span>
                    </p>
                  </section>

                  {/* RECORD ID */}

                  <section
                    className="
                      bg-[#f7f5f1]
                      dark:bg-[#151311]
                      border
                      border-[#e0dcd6]
                      dark:border-[#39332f]
                      p-5
                      mb-8
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-[10px]
                        uppercase
                        tracking-[0.14em]
                        text-[#8b8882]
                        dark:text-[#77716c]
                        mb-2
                        font-bold
                      "
                    >
                      <FileText
                        className="
                          w-3.5
                          h-3.5
                        "
                      />

                      {t.recordId}
                    </div>

                    <p
                      className="
                        text-xs
                        md:text-sm
                        break-all
                        font-mono
                        text-[#555550]
                        dark:text-[#bdb5ae]
                      "
                    >
                      {record.id}
                    </p>
                  </section>

                  {/* REVIEW */}

                  <section
                    className="
                      grid
                      grid-cols-1
                      sm:grid-cols-2
                      gap-4
                    "
                  >
                    {/* APPROVE */}

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        record.id
                      }
                      onClick={() =>
                        handleReview(
                          record.id,
                          "approved"
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        bg-[#94492d]
                        dark:bg-[#b85b38]
                        text-white
                        py-4
                        px-5
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        hover:bg-[#783923]
                        dark:hover:bg-[#cf6944]
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      <CheckCircle
                        size={18}
                      />

                      {processingId ===
                      record.id
                        ? t.processing
                        : t.approve}
                    </button>

                    {/* REJECT */}

                    <button
                      type="button"
                      disabled={
                        processingId ===
                        record.id
                      }
                      onClick={() =>
                        handleReview(
                          record.id,
                          "rejected"
                        )
                      }
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        border
                        border-[#aaa6a0]
                        dark:border-[#5a524c]
                        py-4
                        px-5
                        text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        hover:bg-[#efeeea]
                        dark:hover:bg-[#211d1a]
                        transition
                        disabled:opacity-50
                        disabled:cursor-not-allowed
                      "
                    >
                      <XCircle
                        size={18}
                      />

                      {processingId ===
                      record.id
                        ? t.processing
                        : t.reject}
                    </button>
                  </section>
                </div>
              </article>
            )
          )}
        </div>

        {/* =================================================
            FOOTER LABEL
        ================================================= */}

        <div
          className="
            mt-12
            pt-6
            border-t
            border-[#d5d0ca]
            dark:border-[#3b3531]
            flex
            items-center
            gap-2
            text-[10px]
            uppercase
            tracking-[0.15em]
            text-[#747878]
            dark:text-[#77716c]
          "
        >
          <ShieldCheck
            className="
              w-4
              h-4
              text-[#94492d]
              dark:text-[#d97955]
            "
          />

          HeritageHub · {t.reviewWorkspace}
        </div>
      </div>
    </main>
  );
}

/* =========================================================
   METADATA ITEM
========================================================= */

interface MetadataItemProps {
  label: string;
  value:
    | string
    | number;
}

const MetadataItem = ({
  label,
  value,
}: MetadataItemProps) => {
  return (
    <div>
      <p
        className="
          text-[10px]
          uppercase
          tracking-[0.13em]
          text-[#8e8b86]
          dark:text-[#77716c]
          mb-1
          font-bold
        "
      >
        {label}
      </p>

      <p
        className="
          text-sm
          text-[#343430]
          dark:text-[#e2dbd4]
        "
      >
        {value}
      </p>
    </div>
  );
};

export default CommunityPage;