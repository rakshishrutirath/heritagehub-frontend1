import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Music,
  Play,
  Pause,
  ExternalLink,
  Languages,
  Volume2,
  BookOpen,
  MapPin,
  Sparkles,
  Search,
  X,
} from "lucide-react";

import {
  api,
  Song,
  DancePose,
  LanguagePhrase,
  RitualPractice,
} from "../services/api";

import { useLanguage } from "../context/LanguageContext";

/* =========================================================
   TYPES
========================================================= */

type LearnSection = "songs" | "dance" | "language" | "rituals";

interface LearnPageProps {
  timeline?: unknown[];
  exhibitions?: unknown[];
  artifacts?: unknown[];
  onSelectArtifact?: (artifact: any) => void;
}

/* =========================================================
   COMPONENT
========================================================= */

export const LearnPage: React.FC<LearnPageProps> = () => {
  const { language } = useLanguage();

  const isOdia = language === "or";

  /* =========================================================
     STATE
  ========================================================= */

  const [activeSection, setActiveSection] =
    useState<LearnSection>("songs");

  const [songs, setSongs] = useState<Song[]>([]);
  const [dancePoses, setDancePoses] = useState<DancePose[]>([]);
  const [phrases, setPhrases] = useState<LanguagePhrase[]>([]);
  const [rituals, setRituals] = useState<RitualPractice[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [playingSong, setPlayingSong] = useState<number | null>(null);
  const [playingPhrase, setPlayingPhrase] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  /*
   * Dynamic Odia translation cache.
   *
   * IMPORTANT:
   * Your existing api.ts already has api.translateToOdia(...).
   * This page uses that endpoint for backend content such as:
   * song titles, artists, cultural context, dance text and rituals.
   *
   * The result is cached in localStorage so the same text is not
   * translated again every time the page opens.
   */
  const [odiaCache, setOdiaCache] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("heritagehub_learn_odia_cache");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [translationBusy, setTranslationBusy] = useState(false);

  const normalizeOdiaKey = (value: string) =>
    value.trim().replace(/\s+/g, " ").toLowerCase();

  /*
   * Fast local translations for common labels, regions, genres,
   * known HeritageHub records and proper names.
   *
   * Anything not found here is translated automatically through
   * api.translateToOdia() below.
   */
  const localOdiaMap: Record<string, string> = {
    // Generic UI / content words
    "youtube": "ୟୁଟ୍ୟୁବ",
    "heritagehub archive": "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ",
    "heritagehub": "ହେରିଟେଜ୍ ହବ୍",
    "songs": "ସଙ୍ଗୀତ",
    "song": "ସଙ୍ଗୀତ",
    "dance": "ନୃତ୍ୟ",
    "language": "ଭାଷା",
    "rituals": "ପରମ୍ପରା",
    "ritual": "ପରମ୍ପରା",
    "culture": "ସଂସ୍କୃତି",
    "greetings": "ଅଭିବାଦନ",
    "everyday": "ଦୈନନ୍ଦିନ",
    "family": "ପରିବାର",
    "food": "ଖାଦ୍ୟ",
    "travel": "ଭ୍ରମଣ",
    "numbers": "ସଂଖ୍ୟା",
    "sentences": "ବାକ୍ୟ",

    // Song genres
    "sambalpuri": "ସମ୍ବଲପୁରୀ",
    "koraputia": "କୋରାପୁଟିଆ",
    "santali": "ସାନ୍ତାଳୀ",
    "bhajan": "ଭଜନ",
    "folk": "ଲୋକସଙ୍ଗୀତ",
    "folk song": "ଲୋକସଙ୍ଗୀତ",
    "devotional": "ଭକ୍ତିମୂଳକ",
    "traditional": "ପାରମ୍ପରିକ",
    "tribal": "ଆଦିବାସୀ",
    "odia": "ଓଡ଼ିଆ",
    "odissi": "ଓଡ଼ିଶୀ",

    // Regions
    "odisha": "ଓଡ଼ିଶା",
    "sambalpur": "ସମ୍ବଲପୁର",
    "puri": "ପୁରୀ",
    "koraput": "କୋରାପୁଟ",
    "cuttack": "କଟକ",
    "bhubaneswar": "ଭୁବନେଶ୍ୱର",
    "khordha": "ଖୋର୍ଦ୍ଧା",
    "khurda": "ଖୋର୍ଦ୍ଧା",
    "mayurbhanj": "ମୟୂରଭଞ୍ଜ",
    "rayagada": "ରାୟଗଡ଼ା",
    "kalahandi": "କଳାହାଣ୍ଡି",
    "bargarh": "ବରଗଡ଼",
    "ganjam": "ଗଞ୍ଜାମ",
    "balasore": "ବାଲେଶ୍ୱର",
    "kendrapara": "କେନ୍ଦ୍ରାପଡ଼ା",

    // Songs currently used in HeritageHub
    "alta makhi": "ଅଲତା ମାଖି",
    "chi chi re nani": "ଛି ଛି ରେ ନାନୀ",
    "hisid halay hoy": "ହିସିଦ ହାଲାୟ ହୋୟ",
    "jaga to kala ranga": "ଜଗା ତୋ କଳା ରଙ୍ଗ",
    "keshari loo": "କେଶରୀ ଲୋ",

    // Known artists currently shown in the project
    "pankaj tandi": "ପଙ୍କଜ ତାଣ୍ଡି",
    "pratham kumbhar": "ପ୍ରଥମ କୁମ୍ଭାର",
    "kiran dash": "କିରଣ ଦାଶ",
    "bijay anand sahu": "ବିଜୟ ଆନନ୍ଦ ସାହୁ",
    "satya adhikari": "ସତ୍ୟ ଅଧିକାରୀ",
    "uday hansda": "ଉଦୟ ହାଁସଦା",
    "sumita soren": "ସୁମିତା ସୋରେନ",

    // Dance forms / poses
    "odissi dance": "ଓଡ଼ିଶୀ ନୃତ୍ୟ",
    
    "sambalpuri dance": "ସମ୍ବଲପୁରୀ ନୃତ୍ୟ",
    "dhemsa dance": "ଢେମସା ନୃତ୍ୟ",
    "dhemsa": "ଢେମସା",
    "baitha": "ବୈଠା",
    "boitha": "ବୈଠା",
    "chowka": "ଚୌକା",
    "chauka": "ଚୌକା",
    "tribhangi": "ତ୍ରିଭଙ୍ଗୀ",
    "sampada": "ସମ୍ପଦା",

    // Common language phrases
    "hello": "ନମସ୍କାର",
    "thank you": "ଧନ୍ୟବାଦ",
    "good morning": "ସୁପ୍ରଭାତ",
    "welcome to odisha": "ଓଡ଼ିଶାକୁ ସ୍ୱାଗତ",
    "one": "ଏକ",
    "rice": "ଭାତ",
  };

  const getLocalOdia = (value?: string | null) => {
    if (!value) return "";
    const key = normalizeOdiaKey(value);
    return localOdiaMap[key] || odiaCache[key] || "";
  };

  /*
   * Used directly by JSX.
   * Known/local translations appear immediately.
   * Unknown backend text is translated in the background and
   * appears in Odia as soon as the request completes.
   */
  const toOdia = (value?: string | null) => {
    if (!value) return "";
    if (!isOdia) return value;

    const translated = getLocalOdia(value);
    return translated || value;
  };

  const saveTranslation = (english: string, odia: string) => {
    const key = normalizeOdiaKey(english);

    setOdiaCache((current) => {
      if (current[key] === odia) return current;

      const next = {
        ...current,
        [key]: odia,
      };

      try {
        localStorage.setItem(
          "heritagehub_learn_odia_cache",
          JSON.stringify(next)
        );
      } catch {
        // localStorage may be unavailable in some browser modes.
      }

      return next;
    });
  };

  /* =========================================================
     TRANSLATIONS
  ========================================================= */

  const text = {
    eyebrow: isOdia ? "ଓଡ଼ିଶାକୁ ଜାଣନ୍ତୁ" : "DISCOVER ODISHA",

    title: isOdia
      ? "ଓଡ଼ିଶାର ଜୀବନ୍ତ ଐତିହ୍ୟ ଶିଖନ୍ତୁ"
      : "Learn Odisha's Living Heritage",

    description: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ, ନୃତ୍ୟ, ଭାଷା ଓ ପାରମ୍ପରିକ ଆଚାର ବିଷୟରେ ଜାଣନ୍ତୁ।"
      : "Discover the music, dance, languages and traditional practices that keep Odisha's cultural heritage alive.",

    songs: isOdia ? "ସଙ୍ଗୀତ" : "Songs",
    dance: isOdia ? "ନୃତ୍ୟ" : "Dance",
    language: isOdia ? "ଭାଷା" : "Language",
    rituals: isOdia ? "ପରମ୍ପରା" : "Rituals",

    songsTitle: isOdia
      ? "ଓଡ଼ିଶାର ସଙ୍ଗୀତ"
      : "Songs of Odisha",

    songsDescription: isOdia
      ? "ଓଡ଼ିଶାର ବିଭିନ୍ନ ଅଞ୍ଚଳର ପାରମ୍ପରିକ ସଙ୍ଗୀତ ଶୁଣନ୍ତୁ।"
      : "Listen to traditional music preserved from communities across Odisha.",

    danceTitle: isOdia
      ? "ଓଡ଼ିଶାର ନୃତ୍ୟ"
      : "Dance Traditions",

    danceDescription: isOdia
      ? "ଓଡ଼ିଶାର ଶାସ୍ତ୍ରୀୟ ଓ ଲୋକନୃତ୍ୟର ଭଙ୍ଗୀ ଏବଂ ପରମ୍ପରା ଜାଣନ୍ତୁ।"
      : "Explore classical and folk dance forms, movements and traditions.",

    languageTitle: isOdia
      ? "ଭାଷା ଶିଖନ୍ତୁ"
      : "Learn the Language",

    languageDescription: isOdia
      ? "ଦୈନନ୍ଦିନ ବ୍ୟବହାର ପାଇଁ ସରଳ ଓଡ଼ିଆ ଶବ୍ଦ ଏବଂ ବାକ୍ୟ ଶିଖନ୍ତୁ।"
      : "Learn useful words and phrases from Odisha's languages.",

    ritualsTitle: isOdia
      ? "ପରମ୍ପରା ଓ ଆଚାର"
      : "Rituals & Practices",

    ritualsDescription: isOdia
      ? "ଓଡ଼ିଶାର ସମୁଦାୟମାନଙ୍କ ମଧ୍ୟରେ ପ୍ରଚଳିତ ପାରମ୍ପରିକ ଆଚାର ଓ ପ୍ରଥା ଜାଣନ୍ତୁ।"
      : "Discover traditional rituals and community practices preserved across Odisha.",

    searchSongs: isOdia
      ? "ସଙ୍ଗୀତ, କଳାକାର କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
      : "Search songs, artists or regions...",

    searchDance: isOdia
      ? "ନୃତ୍ୟ କିମ୍ବା ଭଙ୍ଗୀ ଖୋଜନ୍ତୁ..."
      : "Search dances or poses...",

    searchLanguage: isOdia
      ? "ଶବ୍ଦ କିମ୍ବା ବାକ୍ୟ ଖୋଜନ୍ତୁ..."
      : "Search words or phrases...",

    searchRituals: isOdia
      ? "ପରମ୍ପରା କିମ୍ବା ଅଞ୍ଚଳ ଖୋଜନ୍ତୁ..."
      : "Search rituals or regions...",

    noResults: isOdia
      ? "କୌଣସି ଫଳାଫଳ ମିଳିଲା ନାହିଁ"
      : "No results found",

    tryAnother: isOdia
      ? "ଅନ୍ୟ କିଛି ଖୋଜନ୍ତୁ।"
      : "Try another search.",

    clearSearch: isOdia
      ? "ଖୋଜା ସଫା କରନ୍ତୁ"
      : "Clear Search",

    loading: isOdia
      ? "ଐତିହ୍ୟ ତଥ୍ୟ ଲୋଡ୍ ହେଉଛି..."
      : "Loading heritage knowledge...",

    tutorial: isOdia
      ? "ଟ୍ୟୁଟୋରିଆଲ୍ ଦେଖନ୍ତୁ"
      : "Watch Tutorial",

    listen: isOdia ? "ଶୁଣନ୍ତୁ" : "Listen",

    pause: isOdia ? "ବିରତି" : "Pause",

    region: isOdia ? "ଅଞ୍ଚଳ" : "Region",

    culturalContext: isOdia
      ? "ସାଂସ୍କୃତିକ ପ୍ରସଙ୍ଗ"
      : "Cultural Context",

    english: isOdia ? "ଇଂରାଜୀ" : "English",

    odia: isOdia ? "ଓଡ଼ିଆ" : "Odia",

    preservedArchive: isOdia
      ? "ଡିଜିଟାଲ୍ ଐତିହ୍ୟ ଅଭିଲେଖ"
      : "Digital Heritage Archive",
  };

  /* =========================================================
     FETCH DATA
  ========================================================= */

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      try {
        const [
          songsResponse,
          danceResponse,
          languageResponse,
          ritualsResponse,
        ] = await Promise.allSettled([
          api.getSongs(),
          api.getDancePoses(),
          api.getLanguagePhrases(),
          api.getRituals(),
        ]);

        if (songsResponse.status === "fulfilled") {
          setSongs(
            Array.isArray(songsResponse.value)
              ? songsResponse.value
              : []
          );
        }

        if (danceResponse.status === "fulfilled") {
          setDancePoses(
            Array.isArray(danceResponse.value)
              ? danceResponse.value
              : []
          );
        }

        if (languageResponse.status === "fulfilled") {
          setPhrases(
            Array.isArray(languageResponse.value)
              ? languageResponse.value
              : []
          );
        }

        if (ritualsResponse.status === "fulfilled") {
          setRituals(
            Array.isArray(ritualsResponse.value)
              ? ritualsResponse.value
              : []
          );
        }
      } catch (error) {
        console.error("Failed to load Learn data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* =========================================================
     AUTOMATIC ODIA TRANSLATION FOR ALL BACKEND CONTENT
  ========================================================= */

  useEffect(() => {
    if (!isOdia || loading) return;

    const values = new Set<string>();

    const add = (value: unknown) => {
      if (typeof value !== "string") return;

      const trimmed = value.trim();
      if (!trimmed) return;

      const key = normalizeOdiaKey(trimmed);

      // Already available locally or from previous cached requests.
      if (localOdiaMap[key] || odiaCache[key]) return;

      // URLs / file paths should never be translated.
      if (
        /^https?:\/\//i.test(trimmed) ||
        /^data:/i.test(trimmed) ||
        /\.(jpg|jpeg|png|webp|gif|mp3|wav|ogg|mp4)$/i.test(trimmed)
      ) {
        return;
      }

      values.add(trimmed);
    };

    songs.forEach((song) => {
      add(song.title);
      add(song.artist);
      add(song.genre);
      add(song.region);
      add(song.cultural_context);
    });

    dancePoses.forEach((dance) => {
      const item = dance as any;

      add(item.dance_type);
      add(item.category);
      add(item.name);
      add(item.title);
      add(item.pose_name);
      add(item.description);
      add(item.cultural_context);
      add(item.region);
    });

    rituals.forEach((ritual) => {
      const item = ritual as any;

      add(item.category);
      add(item.region);
      add(item.name);
      add(item.title);
      add(item.description);
      add(item.cultural_context);
      add(item.cultural_significance);
      add(item.practices);
    });

    // Language phrases already contain their official Odia translation,
    // so no AI call is needed for those phrase bodies.

    const pending = Array.from(values);

    if (pending.length === 0) return;

    let cancelled = false;

    const translateAll = async () => {
      setTranslationBusy(true);

      /*
       * Translate in small batches. This avoids sending dozens of
       * simultaneous Gemini requests and reduces 429/rate-limit errors.
       */
      const batchSize = 2;

      for (
        let index = 0;
        index < pending.length && !cancelled;
        index += batchSize
      ) {
        const batch = pending.slice(index, index + batchSize);

        await Promise.all(
          batch.map(async (english) => {
            try {
              const result = await api.translateToOdia(english);

              if (
                !cancelled &&
                result?.odia_translation
              ) {
                saveTranslation(
                  english,
                  result.odia_translation.trim()
                );
              }
            } catch (error) {
              console.error(
                "Automatic Odia translation failed:",
                english,
                error
              );
            }
          })
        );
      }

      if (!cancelled) {
        setTranslationBusy(false);
      }
    };

    translateAll();

    return () => {
      cancelled = true;
    };
  }, [
    isOdia,
    loading,
    songs,
    dancePoses,
    rituals,
  ]);

  /* =========================================================
     SEARCH
  ========================================================= */

  const normalizedSearch = search.trim().toLowerCase();

  const filteredSongs = useMemo(() => {
    if (!normalizedSearch) return songs;

    return songs.filter((song) => {
      const searchable = [
        song.title,
        song.artist,
        song.genre,
        song.region,
        song.cultural_context,
        toOdia(song.title),
        toOdia(song.artist),
        toOdia(song.genre),
        toOdia(song.region),
        toOdia(song.cultural_context),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [songs, normalizedSearch, language, odiaCache]);

  const filteredDance = useMemo(() => {
    if (!normalizedSearch) return dancePoses;

    return dancePoses.filter((dance) => {
      const rawValues = Object.values(dance).filter(
        (value) =>
          typeof value === "string" ||
          typeof value === "number"
      );

      const translatedValues = rawValues.map((value) =>
        typeof value === "string" ? toOdia(value) : value
      );

      const searchable = [
        ...rawValues,
        ...translatedValues,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [dancePoses, normalizedSearch, language, odiaCache]);

  const filteredPhrases = useMemo(() => {
    if (!normalizedSearch) return phrases;

    return phrases.filter((phrase) => {
      const searchable = Object.values(phrase)
        .filter(
          (value) =>
            typeof value === "string" ||
            typeof value === "number"
        )
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [phrases, normalizedSearch]);

  const filteredRituals = useMemo(() => {
    if (!normalizedSearch) return rituals;

    return rituals.filter((ritual) => {
      const rawValues = Object.values(ritual).filter(
        (value) =>
          typeof value === "string" ||
          typeof value === "number"
      );

      const translatedValues = rawValues.map((value) =>
        typeof value === "string" ? toOdia(value) : value
      );

      const searchable = [
        ...rawValues,
        ...translatedValues,
      ]
        .join(" ")
        .toLowerCase();

      return searchable.includes(normalizedSearch);
    });
  }, [rituals, normalizedSearch, language, odiaCache]);

  /* =========================================================
     AUDIO
  ========================================================= */

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setPlayingSong(null);
    setPlayingPhrase(null);
  };

  const getSongAudioUrl = (song: Song): string | null => {
    // Cloudinary RAW/Video URL is the permanent playable source.
    // Fall back to the Django FileField URL for older records.
    const cloudinaryUrl = song.cloudinary_audio_url?.trim();
    if (cloudinaryUrl) return cloudinaryUrl;

    const legacyUrl = song.audio?.trim();
    if (legacyUrl) return legacyUrl;

    return null;
  };

  const playSong = (song: Song) => {
    const id = Number(song.id);

    if (playingSong === id) {
      stopAudio();
      return;
    }

    stopAudio();

    const audioUrl = getSongAudioUrl(song);

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);

    audioRef.current = audio;

    audio.play().catch((error) => {
      console.error("Song playback failed:", error);
    });

    setPlayingSong(id);

    audio.onended = () => {
      setPlayingSong(null);
      audioRef.current = null;
    };
  };

  const playPhrase = (phrase: LanguagePhrase) => {
    const id = Number(phrase.id);

    if (playingPhrase === id) {
      stopAudio();
      return;
    }

    stopAudio();

    if (!phrase.audio) return;

    const audio = new Audio(phrase.audio);

    audioRef.current = audio;

    audio.play().catch((error) => {
      console.error("Phrase playback failed:", error);
    });

    setPlayingPhrase(id);

    audio.onended = () => {
      setPlayingPhrase(null);
      audioRef.current = null;
    };
  };

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const getSearchPlaceholder = () => {
    switch (activeSection) {
      case "songs":
        return text.searchSongs;

      case "dance":
        return text.searchDance;

      case "language":
        return text.searchLanguage;

      case "rituals":
        return text.searchRituals;

      default:
        return "";
    }
  };

  const clearSearch = () => {
    setSearch("");
  };

  const changeSection = (section: LearnSection) => {
    setActiveSection(section);
    setSearch("");
    stopAudio();
  };

  const renderEmptyState = () => (
    <div className="col-span-full border border-dashed border-[#c4c7c7] dark:border-[#4a4642] py-20 text-center bg-[#faf9f5] dark:bg-[#171513]">
      <Search className="w-9 h-9 mx-auto mb-5 text-[#747878] dark:text-[#aaa39c]" />

      <h3 className="font-display text-2xl text-[#1b1c1a] dark:text-[#f3eee7]">
        {text.noResults}
      </h3>

      <p className="mt-2 text-sm text-[#747878] dark:text-[#aaa39c]">
        {text.tryAnother}
      </p>

      {search && (
        <button
          onClick={clearSearch}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.12em] text-[#94492d] dark:text-[#d58b6e]"
        >
          {text.clearSearch}
        </button>
      )}
    </div>
  );

  /* =========================================================
     SONGS
  ========================================================= */

  const renderSongs = () => (
    <div>
      <SectionHeading
        icon={<Music className="w-5 h-5" />}
        title={text.songsTitle}
        description={text.songsDescription}
        archiveLabel={isOdia ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ" : "HeritageHub Archive"}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSongs.length === 0
          ? renderEmptyState()
          : filteredSongs.map((song) => (
              <article
                key={song.id}
                className="group border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={toOdia(song.title)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="w-10 h-10 text-[#94492d]" />
                    </div>
                  )}

                  {song.audio && (
                    <button
                      onClick={() => playSong(song)}
                      className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-[#faf9f5] dark:bg-[#1c1917] text-[#1b1c1a] dark:text-white flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    >
                      {playingSong === Number(song.id) ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5 ml-0.5" />
                      )}
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                      {song.genre ? toOdia(song.genre) : text.songs}
                    </span>

                    {song.region && (
                      <span className="flex items-center gap-1 text-[11px] text-[#747878] dark:text-[#aaa39c]">
                        <MapPin className="w-3 h-3" />
                        {toOdia(song.region)}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display text-2xl font-semibold text-[#1b1c1a] dark:text-[#f3eee7]">
                    {toOdia(song.title)}
                  </h3>

                  {song.artist && (
                    <p className="mt-2 text-sm text-[#747878] dark:text-[#aaa39c]">
                      {toOdia(song.artist)}
                    </p>
                  )}

                  {song.cultural_context && (
                    <p className="mt-4 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                      {toOdia(song.cultural_context)}
                    </p>
                  )}

                  {song.youtube_url && (
                    <a
                      href={song.youtube_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] font-bold text-[#94492d] dark:text-[#d58b6e]"
                    >
                      YouTube
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </article>
            ))}
      </div>
    </div>
  );

  /* =========================================================
     DANCE
  ========================================================= */

  const renderDance = () => (
    <div>
      <SectionHeading
        icon={<Sparkles className="w-5 h-5" />}
        title={text.danceTitle}
        description={text.danceDescription}
        archiveLabel={isOdia ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ" : "HeritageHub Archive"}
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredDance.length === 0
          ? renderEmptyState()
          : filteredDance.map((dance) => {
              const item = dance as any;

              return (
                <article
                  key={dance.id}
                  className="group bg-white dark:bg-[#201d1a] border border-[#d9d6cf] dark:border-[#3d3935] overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="aspect-[4/5] bg-[#ece9e2] dark:bg-[#12100f] overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={toOdia(item.name || item.title || (isOdia ? "ନୃତ୍ୟ" : "Dance"))}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-10 h-10 text-[#94492d]" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                      {toOdia(
                        item.dance_type ||
                          item.category ||
                          text.dance
                      )}
                    </span>

                    <h3 className="font-display text-2xl mt-2 text-[#1b1c1a] dark:text-[#f3eee7]">
                      {toOdia(
                        item.name ||
                          item.title ||
                          item.pose_name ||
                          text.dance
                      )}
                    </h3>

                    {(item.description ||
                      item.cultural_context) && (
                      <p className="mt-3 text-sm leading-6 text-[#444748] dark:text-[#c8c1ba]">
                        {toOdia(
                          item.description ||
                            item.cultural_context
                        )}
                      </p>
                    )}

                    {(item.tutorial_url ||
                      item.youtube_url) && (
                      <a
                        href={
                          item.tutorial_url ||
                          item.youtube_url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 bg-[#94492d] hover:bg-[#7e3c25] text-white px-4 py-3 text-[11px] font-bold uppercase tracking-[0.1em]"
                      >
                        <Play className="w-3.5 h-3.5" />

                        {text.tutorial}

                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );

  /* =========================================================
     LANGUAGE
  ========================================================= */

  const renderLanguage = () => (
    <div>
      <SectionHeading
        icon={<Languages className="w-5 h-5" />}
        title={text.languageTitle}
        description={text.languageDescription}
        archiveLabel={isOdia ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ" : "HeritageHub Archive"}
      />

      <div className="border-t border-[#d9d6cf] dark:border-[#3d3935]">
        {filteredPhrases.length === 0
          ? renderEmptyState()
          : filteredPhrases.map((phrase) => {
              const item = phrase as any;

              return (
                <div
                  key={phrase.id}
                  className="grid md:grid-cols-[1fr_1fr_auto] gap-6 items-center py-6 border-b border-[#d9d6cf] dark:border-[#3d3935]"
                >
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                      {isOdia
                        ? toOdia(item.category || "sentences")
                        : item.category || text.english}
                    </span>

                    <p className="mt-2 text-lg text-[#1b1c1a] dark:text-[#f3eee7]">
                      {isOdia
                        ? item.odia_translation ||
                          item.translation ||
                          toOdia(
                            item.english_phrase ||
                              item.english ||
                              ""
                          )
                        : item.english_phrase ||
                          item.english ||
                          ""}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#747878] dark:text-[#aaa39c]">
                      {isOdia ? "ଓଡ଼ିଆ ଅର୍ଥ" : text.odia}
                    </span>

                    <p className="mt-2 text-xl text-[#1b1c1a] dark:text-[#f3eee7]">
                      {item.odia_translation ||
                        item.translation ||
                        ""}
                    </p>
                  </div>

                  {item.audio && (
                    <button
                      onClick={() => playPhrase(phrase)}
                      className="w-11 h-11 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center hover:bg-[#94492d] hover:text-white transition-colors text-[#1b1c1a] dark:text-[#f3eee7]"
                    >
                      {playingPhrase ===
                      Number(phrase.id) ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
      </div>
    </div>
  );

  /* =========================================================
     RITUALS
  ========================================================= */

  const renderRituals = () => (
    <div>
      <SectionHeading
        icon={<BookOpen className="w-5 h-5" />}
        title={text.ritualsTitle}
        description={text.ritualsDescription}
        archiveLabel={isOdia ? "ହେରିଟେଜ୍ ହବ୍ ଅଭିଲେଖ" : "HeritageHub Archive"}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {filteredRituals.length === 0
          ? renderEmptyState()
          : filteredRituals.map((ritual) => {
              const item = ritual as any;

              return (
                <article
                  key={ritual.id}
                  className="border border-[#d9d6cf] dark:border-[#3d3935] bg-white dark:bg-[#201d1a]"
                >
                  {item.image && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={item.image}
                        alt={toOdia(
                          item.name ||
                            item.title ||
                            (isOdia ? "ପରମ୍ପରା" : "Ritual")
                        )}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-7">
                    <div className="flex justify-between gap-4">
                      <span className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#94492d] dark:text-[#d58b6e]">
                        {toOdia(item.category || text.rituals)}
                      </span>

                      {item.region && (
                        <span className="flex items-center gap-1 text-[11px] text-[#747878] dark:text-[#aaa39c]">
                          <MapPin className="w-3 h-3" />
                          {toOdia(item.region)}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-2xl mt-3 text-[#1b1c1a] dark:text-[#f3eee7]">
                      {toOdia(
                        item.name ||
                          item.title ||
                          text.rituals
                      )}
                    </h3>

                    {(item.description ||
                      item.cultural_context) && (
                      <p className="mt-4 text-sm leading-7 text-[#444748] dark:text-[#c8c1ba]">
                        {toOdia(
                          item.description ||
                            item.cultural_context
                        )}
                      </p>
                    )}
                  </div>
                </article>
              );
            })}
      </div>
    </div>
  );

  /* =========================================================
     MAIN
  ========================================================= */

  return (
    <main className="min-h-screen bg-[#faf9f5] dark:bg-[#171513] text-[#1b1c1a] dark:text-[#f3eee7] transition-colors duration-300">
      {/* HERO */}

      <section className="border-b border-[#dedbd5] dark:border-[#35312e]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-16 md:py-24">
          <span className="label-caps text-[#94492d] dark:text-[#d58b6e]">
            {text.eyebrow}
          </span>

          <div className="max-w-4xl mt-6">
            <h1 className="font-display text-5xl md:text-7xl leading-[0.98] tracking-tight">
              {text.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base md:text-lg leading-8 text-[#444748] dark:text-[#c8c1ba]">
              {text.description}
            </p>
          </div>
        </div>
      </section>

      {/* NAVIGATION */}

      <section className="sticky top-20 z-30 bg-[#faf9f5]/95 dark:bg-[#171513]/95 backdrop-blur-md border-b border-[#dedbd5] dark:border-[#35312e]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 overflow-x-auto">
          <div className="flex min-w-max">
            <LearnTab
              active={activeSection === "songs"}
              label={text.songs}
              icon={<Music className="w-4 h-4" />}
              onClick={() => changeSection("songs")}
            />

            <LearnTab
              active={activeSection === "dance"}
              label={text.dance}
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => changeSection("dance")}
            />

            <LearnTab
              active={activeSection === "language"}
              label={text.language}
              icon={<Languages className="w-4 h-4" />}
              onClick={() =>
                changeSection("language")
              }
            />

            <LearnTab
              active={activeSection === "rituals"}
              label={text.rituals}
              icon={<BookOpen className="w-4 h-4" />}
              onClick={() => changeSection("rituals")}
            />
          </div>
        </div>
      </section>

      {/* CONTENT */}

      <section className="max-w-[1440px] mx-auto px-6 md:px-16 py-12 md:py-16">
        {/* SEARCH */}

        <div className="flex items-center gap-3 max-w-2xl mb-14">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#747878]" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={getSearchPlaceholder()}
              className="w-full h-14 pl-11 pr-11 border border-[#c4c7c7] dark:border-[#4a4642] bg-white dark:bg-[#201d1a] text-[#1b1c1a] dark:text-[#f3eee7] outline-none focus:border-[#94492d] dark:focus:border-[#d58b6e] transition-colors placeholder:text-[#969998] dark:placeholder:text-[#77716c]"
            />

            {search && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#747878] hover:text-[#94492d]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {isOdia && translationBusy && !loading && (
          <div className="mb-6 text-[11px] font-semibold tracking-[0.08em] text-[#94492d] dark:text-[#d58b6e]">
            ବାକି ତଥ୍ୟଗୁଡ଼ିକ ଓଡ଼ିଆକୁ ରୂପାନ୍ତର ହେଉଛି...
          </div>
        )}

        {loading ? (
          <div className="min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-2 border-[#d9d6cf] dark:border-[#4a4642] border-t-[#94492d] rounded-full animate-spin" />

            <p className="mt-5 text-sm text-[#747878] dark:text-[#aaa39c]">
              {text.loading}
            </p>
          </div>
        ) : (
          <>
            {activeSection === "songs" &&
              renderSongs()}

            {activeSection === "dance" &&
              renderDance()}

            {activeSection === "language" &&
              renderLanguage()}

            {activeSection === "rituals" &&
              renderRituals()}
          </>
        )}
      </section>

      {/* ARCHIVE FOOTER STRIP */}

      <section className="border-t border-[#dedbd5] dark:border-[#35312e] bg-[#efeeea] dark:bg-[#12100f]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-16 py-10 flex items-center gap-4">
          <div className="w-10 h-10 border border-[#c4c7c7] dark:border-[#4a4642] flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-[#94492d] dark:text-[#d58b6e]" />
          </div>

          <div>
            <p className="font-display text-lg">
              {isOdia ? "ହେରିଟେଜ୍ ହବ୍" : "HeritageHub"}
            </p>

            <p className="text-xs text-[#747878] dark:text-[#aaa39c]">
              {text.preservedArchive}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

/* =========================================================
   LEARN TAB
========================================================= */

interface LearnTabProps {
  active: boolean;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const LearnTab: React.FC<LearnTabProps> = ({
  active,
  label,
  icon,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-5 text-[11px] uppercase tracking-[0.12em] font-bold border-b-2 transition-all ${
        active
          ? "border-[#94492d] text-[#94492d] dark:text-[#d58b6e] dark:border-[#d58b6e]"
          : "border-transparent text-[#747878] dark:text-[#aaa39c] hover:text-[#1b1c1a] dark:hover:text-white"
      }`}
    >
      {icon}
      {label}
    </button>
  );
};

/* =========================================================
   SECTION HEADING
========================================================= */

interface SectionHeadingProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  archiveLabel: string;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
  icon,
  title,
  description,
  archiveLabel,
}) => {
  return (
    <div className="mb-10 md:flex md:items-end md:justify-between gap-8">
      <div>
        <div className="flex items-center gap-2 text-[#94492d] dark:text-[#d58b6e] mb-4">
          {icon}

          <span className="text-[10px] uppercase tracking-[0.15em] font-bold">
            {archiveLabel}
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl text-[#1b1c1a] dark:text-[#f3eee7]">
          {title}
        </h2>

        <p className="mt-4 max-w-2xl text-sm md:text-base leading-7 text-[#747878] dark:text-[#aaa39c]">
          {description}
        </p>
      </div>
    </div>
  );
};

export default LearnPage;