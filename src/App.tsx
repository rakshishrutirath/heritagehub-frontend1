import React, {
  useEffect,
  useState,
} from "react";

import {
  Artifact,
  NavigationTab,
  CartItem,
  TimelineEpoch,
  OnlineExhibition,
  ThreeDModelData,
} from "./types";

import {
  mockArtifacts,
  mockTimeline,
  mockExhibitions,
  mockThreeDModels,
} from "./data/mockData";

import {
  api,
  HeritageRecord,
} from "./services/api";

/* =========================================================
   LAYOUT
========================================================= */

import { Navbar } from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

/* =========================================================
   PAGES
========================================================= */

import { HomePage } from "./pages/HomePage";
import { ExplorePage } from "./pages/ExplorePage";
import { LearnPage } from "./pages/LearnPage";
import { ContributePage } from "./pages/ContributePage";
import { CommunityPage } from "./pages/CommunityPage";
import { ThreeDHeritagePage } from "./pages/ThreeDHeritagePage";
import { MarketplacePage } from "./pages/MarketplacePage";
import { CanvasPage } from "./pages/CanvasPage";
import AiHeritageBot from "./components/common/AiHeritageBot";

/* =========================================================
   MODALS
========================================================= */

import { ArtifactDetailModal } from "./components/common/ArtifactDetailModal";
import { SettingsModal } from "./components/common/SettingsModal";
import { AccountModal } from "./components/common/AccountModal";

/* =========================================================
   DJANGO HERITAGE RECORD -> ARTIFACT ADAPTER
========================================================= */

const convertHeritageRecordToArtifact = (
  record: HeritageRecord
): Artifact => {
  const tags =
    record.ai_tags
      ?.split(",")
      .map((tag) => tag.trim())
      .filter(Boolean) || [];

  return {
    id: record.id,

    title: record.title,

    subtitle:
      record.ai_summary ||
      "Community Heritage Record",

    description:
      record.description,

    imageUrl:
      record.image || "",

    culture:
      "Odisha Heritage",

    period:
      "Living Heritage",

    dateRange:
      record.created_at
        ? new Date(
            record.created_at
          )
            .getFullYear()
            .toString()
        : "Contemporary",

    region:
      "Odisha",

    medium:
      "Community Documentation",

    dimensions:
      "Digital Heritage Record",

    institution:
      "HeritageHub Community Archive",

    catalogNumber:
      record.id
        .slice(0, 8)
        .toUpperCase(),

    provenance:
      "Submitted through the HeritageHub community preservation system.",

    historicalContext:
      record.ai_summary ||
      record.description,

    curatorNotes:
      record.ai_summary ||
      "Community-submitted cultural heritage record.",

    tags:
      tags.length > 0
        ? tags
        : [
            "heritage",
            "odisha",
            "community",
          ],

    coordinates: {
      lat: 20.2961,
      lng: 85.8245,
    },

    epoch:
      "Living Heritage",

    threeDModelAvailable:
      false,

    audioGuideUrl:
      record.audio || undefined,

    audioDuration:
      undefined,
  } as Artifact;
};

/* =========================================================
   APP
========================================================= */

export default function App() {
  /* =======================================================
     NAVIGATION
  ======================================================= */

  const [
    activeTab,
    setActiveTab,
  ] =
    useState<NavigationTab>(
      "home"
    );

  /* =======================================================
     ARTIFACT / HERITAGE DATA
  ======================================================= */

  const [
    artifacts,
    setArtifacts,
  ] =
    useState<Artifact[]>(
      mockArtifacts
    );

  const [
    timeline,
  ] =
    useState<TimelineEpoch[]>(
      mockTimeline
    );

  const [
    exhibitions,
  ] =
    useState<OnlineExhibition[]>(
      mockExhibitions
    );

  const [
    models,
  ] =
    useState<ThreeDModelData[]>(
      mockThreeDModels
    );

  /* =======================================================
     BOOKMARKS
  ======================================================= */

  const [
    bookmarkedIds,
    setBookmarkedIds,
  ] =
    useState<string[]>(() =>
      api.getLocalBookmarks()
    );

  /* =======================================================
     CART
  ======================================================= */

  const [
    cartItems,
  ] =
    useState<CartItem[]>([]);

  /* =======================================================
     MODALS / SELECTED ITEMS
  ======================================================= */

  const [
    selectedArtifact,
    setSelectedArtifact,
  ] =
    useState<Artifact | null>(
      null
    );

  const [
    active3DModelId,
    setActive3DModelId,
  ] =
    useState<string | null>(
      null
    );

  const [
    isSettingsOpen,
    setIsSettingsOpen,
  ] =
    useState(false);

  const [
    isAccountOpen,
    setIsAccountOpen,
  ] =
    useState(false);

  /* =======================================================
     LOAD DJANGO HERITAGE RECORDS
  ======================================================= */

  useEffect(() => {
    const loadHeritageRecords =
      async () => {
        try {
          const records =
            await api.getHeritageRecords();

          console.log(
            "App heritage records:",
            records
          );

          if (
            Array.isArray(
              records
            )
          ) {
            const converted =
              records.map(
                convertHeritageRecordToArtifact
              );

            if (
              converted.length > 0
            ) {
              setArtifacts(
                converted
              );
            }
          }
        } catch (error) {
          console.error(
            "Unable to load heritage records:",
            error
          );
        }
      };

    loadHeritageRecords();
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleSelectTab = (
    tab: NavigationTab
  ) => {
    setActiveTab(
      tab
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     BOOKMARK
  ======================================================= */

  const handleToggleBookmark = (
    id: string
  ) => {
    const updated =
      api.toggleBookmark(
        id
      );

    setBookmarkedIds(
      updated
    );
  };

  /* =======================================================
     3D
  ======================================================= */

  const handleOpen3D = (
    artifactIdOrModelId:
      string
  ) => {
    setActive3DModelId(
      artifactIdOrModelId
    );

    handleSelectTab(
      "3d-heritage"
    );
  };

  /* =======================================================
     AI DOCENT
  ======================================================= */

  const handleTopAiDocent =
    () => {
      if (
        artifacts.length === 0
      ) {
        alert(
          "No heritage records are currently available."
        );

        return;
      }

      setSelectedArtifact(
        artifacts[0]
      );
    };

  /* =======================================================
     MARKETPLACE / CART
  ======================================================= */

  const handleOpenCart =
    () => {
      alert(
        "Marketplace purchases open directly on the seller website."
      );
    };

  const totalCartCount =
    cartItems.reduce(
      (
        total,
        item
      ) =>
        total +
        item.quantity,
      0
    );

  /* =======================================================
     BOOKMARKED ARTIFACTS
  ======================================================= */

  const bookmarkedArtifactsList =
    artifacts.filter(
      (artifact) =>
        bookmarkedIds.includes(
          artifact.id
        )
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div
      className="
        min-h-screen
        flex
        flex-col

        bg-[#faf9f5]
        dark:bg-[#12100f]

        text-[#1b1c1a]
        dark:text-[#f3eee7]

        font-sans

        selection:bg-[#94492d]
        selection:text-white

        transition-colors
        duration-300
      "
    >
      {/* ===================================================
          NAVBAR
      =================================================== */}

      <Navbar
        currentTab={
          activeTab
        }

        onSelectTab={
          handleSelectTab
        }

        cartCount={
          totalCartCount
        }

        onOpenCart={
          handleOpenCart
        }

        onOpenSettings={() =>
          setIsSettingsOpen(
            true
          )
        }

        onOpenAccount={() =>
          setIsAccountOpen(
            true
          )
        }

        onOpenAiDocent={
          handleTopAiDocent
        }
      />

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main
        className="
          flex-grow
          w-full

          bg-[#faf9f5]
          dark:bg-[#12100f]

          text-[#1b1c1a]
          dark:text-[#f3eee7]

          transition-colors
          duration-300
        "
      >
        {/* =================================================
            HOME
        ================================================= */}

        {activeTab ===
          "home" && (
          <HomePage
            onSelectTab={
              handleSelectTab
            }

            onSelectArtifact={
              setSelectedArtifact
            }

            onOpen3D={
              handleOpen3D
            }

            featuredArtifacts={
              artifacts
            }

            bookmarkedIds={
              bookmarkedIds
            }

            onToggleBookmark={
              handleToggleBookmark
            }

            onOpenAiDocent={
              handleTopAiDocent
            }
          />
        )}

        {/* =================================================
            EXPLORE
        ================================================= */}

        {activeTab ===
          "explore" && (
          <ExplorePage
            artifacts={
              artifacts
            }

            onSelectArtifact={
              setSelectedArtifact
            }

            onOpen3D={
              handleOpen3D
            }

            bookmarkedIds={
              bookmarkedIds
            }

            onToggleBookmark={
              handleToggleBookmark
            }
          />
        )}

        {/* =================================================
            LEARN
        ================================================= */}

        {activeTab ===
          "learn" && (
          <LearnPage
            timeline={
              timeline
            }

            exhibitions={
              exhibitions
            }

            artifacts={
              artifacts
            }

            onSelectArtifact={
              setSelectedArtifact
            }
          />
        )}

        {/* =================================================
            CONTRIBUTE
        ================================================= */}

        {activeTab ===
          "contribute" && (
          <ContributePage />
        )}

        {/* =================================================
            COMMUNITY
        ================================================= */}

        {activeTab ===
          "community" && (
          <CommunityPage />
        )}

        {/* =================================================
            3D HERITAGE
        ================================================= */}

        {activeTab ===
          "3d-heritage" && (
          <ThreeDHeritagePage
            models={
              models
            }

            artifacts={
              artifacts
            }

            initialModelId={
              active3DModelId ||
              undefined
            }

            onSelectArtifactDetail={
              setSelectedArtifact
            }
          />
        )}

        {/* =================================================
            MARKETPLACE / SHOP
        ================================================= */}

        {activeTab ===
          "marketplace" && (
          <MarketplacePage />
        )}

        {/* =================================================
            CANVAS
        ================================================= */}

        {activeTab ===
          "canvas" && (
          <CanvasPage
            artifacts={
              artifacts
            }

            onSelectArtifact={
              setSelectedArtifact
            }
          />
        )}
      </main>

      {/* ===================================================
          FOOTER
      =================================================== */}

      <Footer />

      {/* ===================================================
          ARTIFACT DETAIL
      =================================================== */}

      <ArtifactDetailModal
        artifact={
          selectedArtifact
        }

        onClose={() =>
          setSelectedArtifact(
            null
          )
        }

        onOpen3D={
          handleOpen3D
        }

        isBookmarked={
          selectedArtifact
            ? bookmarkedIds.includes(
                selectedArtifact.id
              )
            : false
        }

        onToggleBookmark={
          handleToggleBookmark
        }
      />

      {/* ===================================================
          SETTINGS
      =================================================== */}

      <SettingsModal
        isOpen={
          isSettingsOpen
        }

        onClose={() =>
          setIsSettingsOpen(
            false
          )
        }
      />

      {/* ===================================================
          ACCOUNT
      =================================================== */}

      <AccountModal
        isOpen={
          isAccountOpen
        }

        onClose={() =>
          setIsAccountOpen(
            false
          )
        }

        bookmarkedArtifacts={
          bookmarkedArtifactsList
        }

        onSelectArtifact={(
          artifact
        ) => {
          setIsAccountOpen(
            false
          );

          setSelectedArtifact(
            artifact
          );
        }}

        onOpenContribute={() => {
          setIsAccountOpen(
            false
          );

          handleSelectTab(
            "contribute"
          );
        }}
      />

      {/* ===================================================
          HERITAGEHUB AI CHATBOT
      =================================================== */}

      <AiHeritageBot />

    </div>
  );
}