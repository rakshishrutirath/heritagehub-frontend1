import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Artifact } from "../types";

import {
  api,
  ExplorePlace,
  ExploreEra,
} from "../services/api";

import {
  useLanguage,
} from "../context/LanguageContext";

import {
  Search,
  MapPin,
  Calendar,
  ArrowRight,
  X,
  Utensils,
  Landmark,
  Volume2,
  Clock3,
} from "lucide-react";

/* =========================================================
   PROPS
========================================================= */

interface ExplorePageProps {
  artifacts: Artifact[];

  onSelectArtifact: (
    artifact: Artifact
  ) => void;

  onOpen3D: (
    artifactId: string
  ) => void;

  bookmarkedIds: string[];

  onToggleBookmark: (
    id: string
  ) => void;
}

/* =========================================================
   PAGE
========================================================= */

export const ExplorePage:
React.FC<ExplorePageProps> = () => {
  const {
    language,
  } = useLanguage();

  const isOdia =
    language === "or";

  /* =======================================================
     UI TEXT
  ======================================================= */

  const t = {
    pageLabel:
      isOdia
        ? "ଓଡ଼ିଶା ଅନ୍ୱେଷଣ"
        : "Explore Odisha",

    pageTitle:
      isOdia
        ? "ଜୀବନ୍ତ ଐତିହ୍ୟ ଅନ୍ୱେଷଣ"
        : "Explore Living Heritage",

    pageDescription:
      isOdia
        ? "ହେରିଟେଜ୍ ହବ୍ ମାଧ୍ୟମରେ ଓଡ଼ିଶାର ସାଂସ୍କୃତିକ ସ୍ଥଳ, ଜୀବନ୍ତ ପରମ୍ପରା, ପାରମ୍ପରିକ ଖାଦ୍ୟ ଏବଂ ଐତିହାସିକ ଯୁଗଗୁଡ଼ିକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ।"
        : "Discover cultural places, living traditions, traditional food and historical eras preserved through HeritageHub.",

    search:
      isOdia
        ? "ସ୍ଥାନ, ଜିଲ୍ଲା, ସଂସ୍କୃତି କିମ୍ବା ଖାଦ୍ୟ ଖୋଜନ୍ତୁ..."
        : "Search place, district, culture or food...",

    showing:
      isOdia
        ? "ଦେଖାଯାଉଛି"
        : "Showing",

    heritagePlaces:
      isOdia
        ? "ଐତିହ୍ୟ ସ୍ଥଳ"
        : "heritage places",

    clear:
      isOdia
        ? "ଖୋଜା ସଫା କରନ୍ତୁ"
        : "Clear Search",

    historicalEras:
      isOdia
        ? "ଐତିହାସିକ ଯୁଗ"
        : "Historical Eras",

    explore:
      isOdia
        ? "ଅନ୍ୱେଷଣ"
        : "Explore",

    noPlaces:
      isOdia
        ? "କୌଣସି ସ୍ଥାନ ମିଳିଲା ନାହିଁ"
        : "No places found",

    tryAnother:
      isOdia
        ? "ଅନ୍ୟ ଏକ ଖୋଜା ଶବ୍ଦ ବ୍ୟବହାର କରନ୍ତୁ।"
        : "Try another search.",

    timelineLabel:
      isOdia
        ? "ଐତିହ୍ୟ ସମୟରେଖା"
        : "Heritage Timeline",

    timelineDescription:
      isOdia
        ? "ଓଡ଼ିଶାର ଐତିହ୍ୟ ସହ ଜଡିତ ବିଭିନ୍ନ ଐତିହାସିକ ସମୟକାଳଗୁଡ଼ିକୁ ଅନ୍ୱେଷଣ କରନ୍ତୁ।"
        : "Historical periods available through the Explore backend.",

    loading:
      isOdia
        ? "ଐତିହ୍ୟ ସ୍ଥଳଗୁଡ଼ିକ ଲୋଡ୍ ହେଉଛି..."
        : "Loading heritage places...",

    error:
      isOdia
        ? "ହେରିଟେଜ୍ ହବ୍ ରୁ ଅନ୍ୱେଷଣ ତଥ୍ୟ ଲୋଡ୍ କରିହେଲା ନାହିଁ।"
        : "Unable to load Explore data from HeritageHub.",

    playAudio:
      isOdia
        ? "କାହାଣୀ ଶୁଣନ୍ତୁ"
        : "Play Story Audio",

    culture:
      isOdia
        ? "ସଂସ୍କୃତି"
        : "Culture",

    food:
      isOdia
        ? "ଖାଦ୍ୟ ପରମ୍ପରା"
        : "Food Tradition",

    timeline:
      isOdia
        ? "ସମୟରେଖା"
        : "Timeline",

    close:
      isOdia
        ? "ବନ୍ଦ କରନ୍ତୁ"
        : "Close",
  };

  /* =======================================================
     NORMALIZER
  ======================================================= */

  const normalize = (
    value: string
  ) =>
    value
      .normalize("NFKC")
      .replace(/[–—−]/g, "-")
      .replace(/[’‘]/g, "'")
      .replace(/[“”]/g, '"')
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\s*([,.:;!?])\s*/g, "$1 ")
      .trim()
      .toLowerCase();

  /* =======================================================
     FRONTEND ODIA TRANSLATION MAP
  ======================================================= */

  const translations:
  Record<string, string> = {
    /* LOCATIONS */

    "puri":
      "ପୁରୀ",

    "khordha":
      "ଖୋର୍ଦ୍ଧା",

    "khurda":
      "ଖୋର୍ଦ୍ଧା",

    "bhubaneswar":
      "ଭୁବନେଶ୍ୱର",

    "konark":
      "କୋଣାର୍କ",

    "cuttack":
      "କଟକ",

    "koraput":
      "କୋରାପୁଟ",

    "rayagada":
      "ରାୟଗଡ଼ା",

    "sambalpur":
      "ସମ୍ବଲପୁର",

    "odisha":
      "ଓଡ଼ିଶା",

    /* PLACE NAMES */

    "shree jagannath temple, puri":
      "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର, ପୁରୀ",

    "shree jagannath temple":
      "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର",

    "udayagiri-khandagiri caves":
      "ଉଦୟଗିରି-ଖଣ୍ଡଗିରି ଗୁମ୍ଫା",

    "udayagiri and khandagiri caves":
      "ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ଗୁମ୍ଫା",

    "konark sun temple":
      "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",

    "the konark sun temple":
      "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର",

    "raghurajpur heritage village":
      "ରଘୁରାଜପୁର ଐତିହ୍ୟ ଗ୍ରାମ",

    "raghurajpur":
      "ରଘୁରାଜପୁର",

    /* =====================================================
       JAGANNATH
    ===================================================== */

    "jagannath culture & living traditions":
      "ଜଗନ୍ନାଥ ସଂସ୍କୃତି ଓ ଜୀବନ୍ତ ପରମ୍ପରା",

    "jagannath culture and living traditions":
      "ଜଗନ୍ନାଥ ସଂସ୍କୃତି ଓ ଜୀବନ୍ତ ପରମ୍ପରା",

    "shree jagannath temple in puri is one of odisha's most significant religious and cultural landmarks. dedicated to lord jagannath, the temple is deeply connected with odisha's traditions, festivals, art, cuisine and cultural identity.":
      "ପୁରୀର ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଧାର୍ମିକ ଓ ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ସ୍ଥଳମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ପ୍ରଭୁ ଜଗନ୍ନାଥଙ୍କୁ ସମର୍ପିତ ଏହି ମନ୍ଦିର ଓଡ଼ିଶାର ପରମ୍ପରା, ପର୍ବପର୍ବାଣୀ, କଳା, ଖାଦ୍ୟ ଏବଂ ସାଂସ୍କୃତିକ ପରିଚୟ ସହ ଗଭୀର ଭାବେ ଜଡିତ।",

    "shree jagannath temple is one of odisha's most important religious and cultural landmarks and is deeply connected with the identity and traditions of puri.":
      "ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ଓଡ଼ିଶାର ଏକ ଅତ୍ୟନ୍ତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଧାର୍ମିକ ଓ ସାଂସ୍କୃତିକ ସ୍ଥଳ। ଏହା ପୁରୀର ପରିଚୟ ଓ ପରମ୍ପରା ସହ ଗଭୀର ଭାବେ ଜଡିତ।",

    "jagannath culture centres around lord jagannath, along with lord balabhadra and devi subhadra. the temple preserves centuries-old rituals, festivals, traditional art, music and community practices.":
      "ଜଗନ୍ନାଥ ସଂସ୍କୃତି ପ୍ରଭୁ ଜଗନ୍ନାଥଙ୍କ ସହ ପ୍ରଭୁ ବଳଭଦ୍ର ଓ ଦେବୀ ସୁଭଦ୍ରାଙ୍କୁ କେନ୍ଦ୍ର କରି ବିକଶିତ ହୋଇଛି। ମନ୍ଦିର ଶତାବ୍ଦୀ ପୁରୁଣା ଆଚାର-ବିଧି, ପର୍ବପର୍ବାଣୀ, ପାରମ୍ପରିକ କଳା, ସଙ୍ଗୀତ ଏବଂ ସାମୁଦାୟିକ ପରମ୍ପରାକୁ ସଂରକ୍ଷଣ କରିଆସୁଛି।",

    "mahaprasad":
      "ମହାପ୍ରସାଦ",

    "temple food tradition":
      "ମନ୍ଦିର ଖାଦ୍ୟ ପରମ୍ପରା",

    /* =====================================================
       UDAYAGIRI KHANDAGIRI
    ===================================================== */

    "ancient jain heritage & rock-cut architecture":
      "ପ୍ରାଚୀନ ଜୈନ ଐତିହ୍ୟ ଓ ଶିଳାକଟା ସ୍ଥାପତ୍ୟ",

    "ancient jain heritage and rock-cut architecture":
      "ପ୍ରାଚୀନ ଜୈନ ଐତିହ୍ୟ ଓ ଶିଳାକଟା ସ୍ଥାପତ୍ୟ",

    "udayagiri and khandagiri are ancient rock-cut cave complexes near bhubaneswar, known for their historical inscriptions, sculptures, jain heritage, and remarkable rock-cut architecture.":
      "ଭୁବନେଶ୍ୱର ନିକଟରେ ଅବସ୍ଥିତ ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ପ୍ରାଚୀନ ଶିଳାକଟା ଗୁମ୍ଫା ସମୂହ। ଏଗୁଡ଼ିକ ଐତିହାସିକ ଶିଳାଲେଖ, ମୂର୍ତ୍ତିକଳା, ଜୈନ ଐତିହ୍ୟ ଏବଂ ଶିଳାକଟା ସ୍ଥାପତ୍ୟ ପାଇଁ ପ୍ରସିଦ୍ଧ।",

    "udayagiri and khandagiri are ancient rock-cut cave complexes near bhubaneswar that represent an important part of odisha's early jain heritage.":
      "ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ଭୁବନେଶ୍ୱର ନିକଟସ୍ଥ ପ୍ରାଚୀନ ଶିଳାକଟା ଗୁମ୍ଫା ସମୂହ, ଯାହା ଓଡ଼ିଶାର ପ୍ରାରମ୍ଭିକ ଜୈନ ଐତିହ୍ୟର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅଂଶ।",

    "the caves were carved into natural hills and were used by jain ascetics. many of them contain inscriptions, sculptural panels, decorative carvings, and architectural features that provide insight into the religious and cultural life of ancient odisha.":
      "ଏହି ଗୁମ୍ଫାଗୁଡ଼ିକ ପ୍ରାକୃତିକ ପାହାଡ଼କୁ କାଟି ତିଆରି କରାଯାଇଥିଲା ଏବଂ ଜୈନ ସନ୍ନ୍ୟାସୀମାନେ ଏଗୁଡ଼ିକୁ ବ୍ୟବହାର କରୁଥିଲେ। ଅନେକ ଗୁମ୍ଫାରେ ଶିଳାଲେଖ, ମୂର୍ତ୍ତି ପ୍ୟାନେଲ୍, ଅଲଙ୍କାରିକ ଖୋଦାକାମ ଓ ସ୍ଥାପତ୍ୟ ବିଶେଷତା ଦେଖିବାକୁ ମିଳେ।",

    "the complex is especially known for its historic caves, rock-cut chambers, and detailed stone carvings, making it an important archaeological and cultural landmark.":
      "ଏହି ପରିସର ଏହାର ଐତିହାସିକ ଗୁମ୍ଫା, ଶିଳାକଟା କକ୍ଷ ଓ ସୂକ୍ଷ୍ମ ପଥର ଖୋଦାକାମ ପାଇଁ ପ୍ରସିଦ୍ଧ। ଏହା ଏକ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପୁରାତତ୍ତ୍ୱିକ ଓ ସାଂସ୍କୃତିକ ସ୍ଥଳ।",

    "traditional food of bhubaneswar region":
      "ଭୁବନେଶ୍ୱର ଅଞ୍ଚଳର ପାରମ୍ପରିକ ଖାଦ୍ୟ",

    "the food traditions around udayagiri-khandagiri reflect the authentic flavours of odisha.":
      "ଉଦୟଗିରି-ଖଣ୍ଡଗିରି ଅଞ୍ଚଳର ଖାଦ୍ୟ ପରମ୍ପରା ଓଡ଼ିଶାର ଖାଟି ସ୍ୱାଦକୁ ପ୍ରତିବିମ୍ବିତ କରେ।",

    "traditional meals:":
      "ପାରମ୍ପରିକ ଭୋଜନ:",

    "rice, dal, seasonal vegetables and traditional odia curries form an important part of everyday meals.":
      "ଭାତ, ଡାଲି, ଋତୁକାଳୀନ ସବ୍ଜି ଏବଂ ପାରମ୍ପରିକ ଓଡ଼ିଆ ତରକାରୀ ଦୈନନ୍ଦିନ ଭୋଜନର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅଂଶ।",

    "dalma:":
      "ଡାଲମା:",

    "dalma is a traditional odia dish prepared with lentils and vegetables, seasoned with aromatic spices.":
      "ଡାଲମା ଡାଲି ଓ ସବ୍ଜିରେ ପ୍ରସ୍ତୁତ ଏକ ପାରମ୍ପରିକ ଓଡ଼ିଆ ପଦାର୍ଥ, ଯାହା ସୁଗନ୍ଧିତ ମସଲାରେ ପ୍ରସ୍ତୁତ ହୁଏ।",

    "pakhala:":
      "ପଖାଳ:",

    "pakhala is a popular rice-based dish especially enjoyed during odisha's warmer months and is commonly served with vegetables and traditional side dishes.":
      "ପଖାଳ ଭାତ ଆଧାରିତ ଏକ ଲୋକପ୍ରିୟ ଓଡ଼ିଆ ପଦାର୍ଥ। ବିଶେଷତଃ ଗ୍ରୀଷ୍ମକାଳରେ ଏହାକୁ ସବ୍ଜି ଓ ପାରମ୍ପରିକ ସାଇଡ୍ ପଦାର୍ଥ ସହ ଖାଇବାକୁ ପସନ୍ଦ କରାଯାଏ।",

    "traditional sweets:":
      "ପାରମ୍ପରିକ ମିଠା:",

    "chhena poda, rasabali and other traditional odia sweets represent the rich culinary heritage of the region.":
      "ଛେନାପୋଡ଼, ରସାବଳୀ ଏବଂ ଅନ୍ୟାନ୍ୟ ପାରମ୍ପରିକ ଓଡ଼ିଆ ମିଠା ଏହି ଅଞ୍ଚଳର ସମୃଦ୍ଧ ଖାଦ୍ୟ ଐତିହ୍ୟକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ।",

    /* =====================================================
       KONARK
    ===================================================== */

    "kalinga architecture":
      "କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟ",

    "sun temple architecture":
      "ସୂର୍ଯ୍ୟ ମନ୍ଦିର ସ୍ଥାପତ୍ୟ",

    "the konark sun temple is a historic temple renowned for its monumental stone architecture and intricate carvings.":
      "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର ଏହାର ବିଶାଳ ପଥର ସ୍ଥାପତ୍ୟ ଏବଂ ସୂକ୍ଷ୍ମ ଖୋଦାକାମ ପାଇଁ ପ୍ରସିଦ୍ଧ ଏକ ଐତିହାସିକ ମନ୍ଦିର।",

    "the konark sun temple is a monumental example of kalinga architecture and one of odisha's most celebrated heritage monuments.":
      "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର କଳିଙ୍ଗ ସ୍ଥାପତ୍ୟର ଏକ ଅତ୍ୟୁତ୍କୃଷ୍ଟ ଉଦାହରଣ ଏବଂ ଓଡ଼ିଶାର ସବୁଠାରୁ ପ୍ରସିଦ୍ଧ ଐତିହ୍ୟ ସ୍ମାରକମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ।",

    "konark is a historic coastal town in the puri district of odisha, india, globally renowned for its 13th-century sun temple, a unesco world heritage site. the town's name originates from the sanskrit words kona (corner) and arka (sun), literally translating to the \"corner of the sun\". together with bhubaneswar and puri, konark forms the \"golden triangle\" of odisha tourism.":
      "କୋଣାର୍କ ଓଡ଼ିଶାର ପୁରୀ ଜିଲ୍ଲାର ଏକ ଐତିହାସିକ ସମୁଦ୍ରତଟୀୟ ସହର। ଏହା ୧୩ଶ ଶତାବ୍ଦୀର ସୂର୍ଯ୍ୟ ମନ୍ଦିର ପାଇଁ ବିଶ୍ୱପ୍ରସିଦ୍ଧ, ଯାହା ଏକ ୟୁନେସ୍କୋ ବିଶ୍ୱ ଐତିହ୍ୟ ସ୍ଥଳ। କୋଣାର୍କ ନାମ ସଂସ୍କୃତର କୋଣ ଓ ଅର୍କ ଶବ୍ଦରୁ ଆସିଛି। ଭୁବନେଶ୍ୱର ଓ ପୁରୀ ସହିତ କୋଣାର୍କ ଓଡ଼ିଶା ପର୍ଯ୍ୟଟନର ସୁବର୍ଣ୍ଣ ତ୍ରିଭୁଜ ଗଠନ କରେ।",

    "traditional food of puri region":
      "ପୁରୀ ଅଞ୍ଚଳର ପାରମ୍ପରିକ ଖାଦ୍ୟ",

    "puri-konark cuisine is a blend of sacred temple food and traditional coastal flavours.":
      "ପୁରୀ-କୋଣାର୍କ ଖାଦ୍ୟ ପରମ୍ପରା ପବିତ୍ର ମନ୍ଦିର ଭୋଗ ଓ ପାରମ୍ପରିକ ସମୁଦ୍ରତଟୀୟ ସ୍ୱାଦର ଏକ ସମନ୍ୱୟ।",

    "sacred temple food:":
      "ପବିତ୍ର ମନ୍ଦିର ଭୋଗ:",

    "rice, dal, vegetables, and traditional dishes are prepared using simple ingredients and age-old cooking methods. temple cuisine traditionally avoids onion and garlic.":
      "ଚାଉଳ, ଡାଲି, ସବ୍ଜି ଓ ପାରମ୍ପରିକ ପଦାର୍ଥ ସରଳ ଉପାଦାନ ଏବଂ ପୁରାତନ ରାନ୍ଧଣ ପ୍ରଣାଳୀରେ ପ୍ରସ୍ତୁତ କରାଯାଏ। ମନ୍ଦିର ଖାଦ୍ୟରେ ପାରମ୍ପରିକ ଭାବେ ପିଆଜ ଓ ରସୁଣ ବ୍ୟବହାର କରାଯାଏ ନାହିଁ।",

    "coastal cuisine:":
      "ସମୁଦ୍ରତଟୀୟ ଖାଦ୍ୟ:",

    "the coastal region is known for fresh fish, prawns, and crab dishes, often prepared with mustard, coconut, and traditional spices.":
      "ସମୁଦ୍ରତଟୀୟ ଅଞ୍ଚଳ ତାଜା ମାଛ, ଚିଙ୍ଗୁଡ଼ି ଓ କଙ୍କଡ଼ା ପଦାର୍ଥ ପାଇଁ ପ୍ରସିଦ୍ଧ। ଏଗୁଡ଼ିକ ସରସପ, ନଡ଼ିଆ ଓ ପାରମ୍ପରିକ ମସଲା ସହ ପ୍ରସ୍ତୁତ ହୁଏ।",

    "sweet heritage:":
      "ମିଠା ଐତିହ୍ୟ:",

    "popular odia sweets include chhena poda, khaja, and other milk-based delicacies that form an important part of the region's culinary heritage.":
      "ଛେନାପୋଡ଼, ଖଜା ଏବଂ ଅନ୍ୟାନ୍ୟ ଦୁଗ୍ଧଜାତ ମିଠା ଏହି ଅଞ୍ଚଳର ଖାଦ୍ୟ ଐତିହ୍ୟର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଅଂଶ।",

    "flavour profile:":
      "ସ୍ୱାଦର ବିଶେଷତା:",

    "the cuisine is simple, aromatic, and earthy, commonly using mustard oil, panch phoron (five-spice blend), and fresh coconut.":
      "ଏହି ଖାଦ୍ୟ ପରମ୍ପରା ସରଳ, ସୁଗନ୍ଧିତ ଏବଂ ଖାଟି ସ୍ୱାଦରେ ପରିପୂର୍ଣ୍ଣ। ସରସପ ତେଲ, ପଞ୍ଚଫୁଟଣ ଓ ତାଜା ନଡ଼ିଆ ବହୁଳ ଭାବେ ବ୍ୟବହୃତ ହୁଏ।",

    /* =====================================================
       RAGHURAJPUR
    ===================================================== */

    "living heritage of raghurajpur":
      "ରଘୁରାଜପୁରର ଜୀବନ୍ତ ଐତିହ୍ୟ",

    "raghurajpur is a traditional heritage crafts village in odisha, renowned for its pattachitra paintings, palm-leaf art, traditional crafts, and rich cultural traditions.":
      "ରଘୁରାଜପୁର ଓଡ଼ିଶାର ଏକ ପାରମ୍ପରିକ ଐତିହ୍ୟ ଶିଳ୍ପ ଗ୍ରାମ। ଏହା ପଟ୍ଟଚିତ୍ର, ତାଳପତ୍ର କଳା, ପାରମ୍ପରିକ ହସ୍ତଶିଳ୍ପ ଏବଂ ସମୃଦ୍ଧ ସାଂସ୍କୃତିକ ପରମ୍ପରା ପାଇଁ ପ୍ରସିଦ୍ଧ।",

    "raghurajpur is a heritage crafts village in odisha known for preserving traditional art forms through generations of artisan families.":
      "ରଘୁରାଜପୁର ଓଡ଼ିଶାର ଏକ ଐତିହ୍ୟ ଶିଳ୍ପ ଗ୍ରାମ, ଯେଉଁଠାରେ ଶିଳ୍ପୀ ପରିବାରମାନେ ପିଢ଼ି ପରେ ପିଢ଼ି ପାରମ୍ପରିକ କଳାରୂପଗୁଡ଼ିକୁ ସଂରକ୍ଷଣ କରିଆସୁଛନ୍ତି।",

    "the village is especially famous for pattachitra, a traditional painting style created on prepared cloth using natural colours and intricate decorative patterns.":
      "ଏହି ଗ୍ରାମ ବିଶେଷକରି ପଟ୍ଟଚିତ୍ର ପାଇଁ ପ୍ରସିଦ୍ଧ। ଏହା ପ୍ରସ୍ତୁତ କପଡ଼ା ଉପରେ ପ୍ରାକୃତିକ ରଙ୍ଗ ଓ ସୂକ୍ଷ୍ମ ଅଲଙ୍କାରିକ ଆକୃତି ବ୍ୟବହାର କରି ତିଆରି ହେଉଥିବା ଏକ ପାରମ୍ପରିକ ଚିତ୍ରକଳା।",

    "artists of raghurajpur also practise palm-leaf engraving, traditional mask making, wooden crafts and other forms of odisha folk art. the village represents a living cultural ecosystem where traditional knowledge, craftsmanship and everyday community life remain closely connected.":
      "ରଘୁରାଜପୁରର ଶିଳ୍ପୀମାନେ ତାଳପତ୍ର ଖୋଦାକାମ, ପାରମ୍ପରିକ ମୁଖୋଷ ତିଆରି, କାଠ ଶିଳ୍ପ ଓ ଅନ୍ୟାନ୍ୟ ଓଡ଼ିଆ ଲୋକକଳାର ଅଭ୍ୟାସ କରନ୍ତି। ଏହି ଗ୍ରାମରେ ପାରମ୍ପରିକ ଜ୍ଞାନ, ଶିଳ୍ପକୌଶଳ ଏବଂ ସାମୁଦାୟିକ ଜୀବନ ନିକଟ ସମ୍ପର୍କରେ ରହେ।",

    "traditional food of raghurajpur":
      "ରଘୁରାଜପୁରର ପାରମ୍ପରିକ ଖାଦ୍ୟ",

    "raghurajpur's food traditions reflect the simple and authentic flavours of rural odisha.":
      "ରଘୁରାଜପୁରର ଖାଦ୍ୟ ପରମ୍ପରା ଗ୍ରାମୀଣ ଓଡ଼ିଶାର ସରଳ ଏବଂ ଖାଟି ସ୍ୱାଦକୁ ପ୍ରତିବିମ୍ବିତ କରେ।",

    "daily meals commonly include rice, dal, seasonal vegetables and traditional odia preparations made with locally available ingredients.":
      "ଦୈନନ୍ଦିନ ଭୋଜନରେ ସାଧାରଣତଃ ଭାତ, ଡାଲି, ଋତୁକାଳୀନ ସବ୍ଜି ଏବଂ ସ୍ଥାନୀୟ ଉପାଦାନରେ ପ୍ରସ୍ତୁତ ପାରମ୍ପରିକ ଓଡ଼ିଆ ଖାଦ୍ୟ ରହେ।",

    "pakhala, prepared from cooked rice soaked in water, is a popular traditional dish especially enjoyed during the summer months. it is commonly served with vegetables and other side dishes.":
      "ରନ୍ଧା ଭାତକୁ ପାଣିରେ ଭିଜାଇ ପ୍ରସ୍ତୁତ କରାଯାଉଥିବା ପଖାଳ ଗ୍ରୀଷ୍ମକାଳରେ ବିଶେଷ ପ୍ରିୟ। ଏହାକୁ ସବ୍ଜି ଓ ଅନ୍ୟାନ୍ୟ ପାର୍ଶ୍ୱ ପଦାର୍ଥ ସହ ପରିବେଶନ କରାଯାଏ।",

    "odia sweets such as khaja, chhena poda and other locally prepared delicacies are part of the region's culinary tradition.":
      "ଖଜା, ଛେନାପୋଡ଼ ଏବଂ ସ୍ଥାନୀୟ ଭାବେ ପ୍ରସ୍ତୁତ ଅନ୍ୟାନ୍ୟ ମିଠା ଏହି ଅଞ୍ଚଳର ଖାଦ୍ୟ ପରମ୍ପରାର ଅଂଶ।",

    "food heritage:":
      "ଖାଦ୍ୟ ଐତିହ୍ୟ:",

    "the cuisine represents odisha's traditional village lifestyle, where simple ingredients, seasonal produce and generations-old cooking practices remain important.":
      "ଏହି ଖାଦ୍ୟ ପରମ୍ପରା ଓଡ଼ିଶାର ପାରମ୍ପରିକ ଗ୍ରାମୀଣ ଜୀବନଶୈଳୀକୁ ପ୍ରତିନିଧିତ୍ୱ କରେ, ଯେଉଁଠାରେ ସରଳ ଉପାଦାନ, ଋତୁକାଳୀନ ଉତ୍ପାଦ ଓ ପିଢ଼ି ପୁରୁଣା ରାନ୍ଧଣ ପ୍ରଣାଳୀ ଆଜି ମଧ୍ୟ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ।",

    /* =====================================================
       ERA TITLES
    ===================================================== */

    "ancient kalinga era":
      "ପ୍ରାଚୀନ କଳିଙ୍ଗ ଯୁଗ",

    "historic ganga dynasty era":
      "ଐତିହାସିକ ଗଙ୍ଗ ବଂଶ ଯୁଗ",

    "13th century – original era":
      "୧୩ଶ ଶତାବ୍ଦୀ – ମୂଳ ଯୁଗ",

    "13th century - original era":
      "୧୩ଶ ଶତାବ୍ଦୀ – ମୂଳ ଯୁଗ",

    "traditional heritage era":
      "ପାରମ୍ପରିକ ଐତିହ୍ୟ ଯୁଗ",

    "present day – preserved":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ",

    "present day - preserved":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ",

    "present day – living heritage":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଐତିହ୍ୟ",

    "present day - living heritage":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଐତିହ୍ୟ",

    "present day – preserved heritage":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ ଐତିହ୍ୟ",

    "present day - preserved heritage":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ ଐତିହ୍ୟ",

    "present day – preserved ancient heritage":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ ପ୍ରାଚୀନ ଐତିହ୍ୟ",

    "present day – living jagannath tradition":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଜଗନ୍ନାଥ ପରମ୍ପରା",

    "present day – living heritage village":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଐତିହ୍ୟ ଗ୍ରାମ",

    /* =====================================================
       ERA DESCRIPTIONS
    ===================================================== */

    "during the ancient kalinga period, the udayagiri and khandagiri hills developed as important centres associated with jain ascetics. rock-cut caves, inscriptions, sculptures and chambers were created here.":
      "ପ୍ରାଚୀନ କଳିଙ୍ଗ ଯୁଗରେ ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ପାହାଡ଼ ଜୈନ ସନ୍ନ୍ୟାସୀମାନଙ୍କ ସହ ଜଡିତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କେନ୍ଦ୍ର ଭାବେ ବିକଶିତ ହୋଇଥିଲା। ଏଠାରେ ଶିଳାକଟା ଗୁମ୍ଫା, ଶିଳାଲେଖ, ମୂର୍ତ୍ତିକଳା ଏବଂ କକ୍ଷ ତିଆରି କରାଯାଇଥିଲା।",

    "during the eastern ganga dynasty, the great temple at puri developed into an important centre of worship and cultural life. the temple became closely associated with lord jagannath and odisha's religious traditions.":
      "ପୂର୍ବ ଗଙ୍ଗ ବଂଶର ସମୟରେ ପୁରୀର ମହାନ ମନ୍ଦିର ଉପାସନା ଓ ସାଂସ୍କୃତିକ ଜୀବନର ଏକ ପ୍ରମୁଖ କେନ୍ଦ୍ର ଭାବେ ବିକଶିତ ହୋଇଥିଲା। ଏହି ମନ୍ଦିର ପ୍ରଭୁ ଜଗନ୍ନାଥ ଏବଂ ଓଡ଼ିଶାର ଧାର୍ମିକ ପରମ୍ପରା ସହ ଜଡିତ ହୋଇଥିଲା।",

    "konark sun temple was built in the 13th century during the reign of king narasimhadeva i.":
      "କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର ୧୩ଶ ଶତାବ୍ଦୀରେ ରାଜା ନରସିଂହଦେବ ପ୍ରଥମଙ୍କ ଶାସନକାଳରେ ନିର୍ମିତ ହୋଇଥିଲା।",

    "today, the konark sun temple stands as one of odisha's most important preserved heritage monuments. although parts of the original structure have been lost over time, conservation efforts continue to protect its architecture, sculptures, and cultural legacy.":
      "ଆଜି କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସଂରକ୍ଷିତ ଐତିହ୍ୟ ସ୍ମାରକମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ମୂଳ ସଂରଚନାର କିଛି ଅଂଶ ସମୟ ସହିତ ନଷ୍ଟ ହୋଇଥିଲେ ମଧ୍ୟ ଏହାର ସ୍ଥାପତ୍ୟ, ମୂର୍ତ୍ତିକଳା ଓ ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ସଂରକ୍ଷଣ ପାଇଁ ଚେଷ୍ଟା ଜାରି ରହିଛି।",

    "raghurajpur developed as a traditional artisan village where generations of families practised and preserved odisha's indigenous art forms. pattachitra painting, palm-leaf engraving, mask making and other crafts became deeply connected with the everyday life and cultural identity of the village.":
      "ରଘୁରାଜପୁର ଏକ ପାରମ୍ପରିକ ଶିଳ୍ପୀ ଗ୍ରାମ ଭାବେ ବିକଶିତ ହୋଇଥିଲା, ଯେଉଁଠାରେ ପିଢ଼ି ପରେ ପିଢ଼ି ପରିବାରମାନେ ଓଡ଼ିଶାର ସ୍ୱଦେଶୀ କଳାରୂପଗୁଡ଼ିକୁ ଅଭ୍ୟାସ ଏବଂ ସଂରକ୍ଷଣ କରିଆସୁଛନ୍ତି। ପଟ୍ଟଚିତ୍ର, ତାଳପତ୍ର ଖୋଦାକାମ, ମୁଖୋଷ ତିଆରି ଓ ଅନ୍ୟାନ୍ୟ ଶିଳ୍ପ ଗ୍ରାମର ଦୈନନ୍ଦିନ ଜୀବନ ଓ ସାଂସ୍କୃତିକ ପରିଚୟ ସହ ଗଭୀର ଭାବେ ଜଡିତ।",

    "today, raghurajpur continues to thrive as a living heritage village where traditional art and everyday community life exist together. artisan families continue to practise pattachitra painting, palm-leaf engraving, mask making and other traditional crafts while sharing these cultural traditions with visitors and future generations.":
      "ଆଜି ରଘୁରାଜପୁର ଏକ ଜୀବନ୍ତ ଐତିହ୍ୟ ଗ୍ରାମ ଭାବେ ଅବିରତ ଭାବେ ବିକଶିତ ହେଉଛି, ଯେଉଁଠାରେ ପାରମ୍ପରିକ କଳା ଓ ସାମୁଦାୟିକ ଜୀବନ ସହଅବସ୍ଥାନ କରୁଛି। ଶିଳ୍ପୀ ପରିବାରମାନେ ପଟ୍ଟଚିତ୍ର, ତାଳପତ୍ର ଖୋଦାକାମ, ମୁଖୋଷ ତିଆରି ଏବଂ ଅନ୍ୟାନ୍ୟ ପାରମ୍ପରିକ ଶିଳ୍ପକୁ ଅଭ୍ୟାସ କରିବା ସହ ଏହି ସାଂସ୍କୃତିକ ପରମ୍ପରାକୁ ଦର୍ଶକ ଓ ଆଗାମୀ ପିଢ଼ି ସହ ଭାଗ କରୁଛନ୍ତି।",

    /* =====================================================
       EXTRA TIMELINE / DETAIL CONTENT
    ===================================================== */

    "present day – living jagannath heritage":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଜଗନ୍ନାଥ ଐତିହ୍ୟ",

    "present day - living jagannath heritage":
      "ବର୍ତ୍ତମାନ – ଜୀବନ୍ତ ଜଗନ୍ନାଥ ଐତିହ୍ୟ",

    

    "present day - preserved ancient heritage":
      "ବର୍ତ୍ତମାନ – ସଂରକ୍ଷିତ ପ୍ରାଚୀନ ଐତିହ୍ୟ",

    "today, the udayagiri and khandagiri caves remain important archaeological and cultural landmarks of odisha. their rock-cut chambers, inscriptions, sculptures and jain heritage continue to provide valuable insight into the region's ancient history.":
      "ଆଜି ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ଗୁମ୍ଫାଗୁଡ଼ିକ ଓଡ଼ିଶାର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପୁରାତତ୍ତ୍ୱିକ ଓ ସାଂସ୍କୃତିକ ସ୍ଥଳ ଭାବେ ରହିଛି। ଏହାର ଶିଳାକଟା କକ୍ଷ, ଶିଳାଲେଖ, ମୂର୍ତ୍ତିକଳା ଏବଂ ଜୈନ ଐତିହ୍ୟ ଅଞ୍ଚଳର ପ୍ରାଚୀନ ଇତିହାସ ବିଷୟରେ ମୂଲ୍ୟବାନ ତଥ୍ୟ ଦେଇଥାଏ।",

    "today, shree jagannath temple remains one of odisha's most important religious and cultural centres. centuries-old rituals, festivals, mahaprasad traditions and the annual rath yatra continue to preserve the living jagannath heritage.":
      "ଆଜି ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଧାର୍ମିକ ଓ ସାଂସ୍କୃତିକ କେନ୍ଦ୍ରମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ଶତାବ୍ଦୀ ପୁରୁଣା ଆଚାର-ବିଧି, ପର୍ବପର୍ବାଣୀ, ମହାପ୍ରସାଦ ପରମ୍ପରା ଏବଂ ବାର୍ଷିକ ରଥଯାତ୍ରା ଜୀବନ୍ତ ଜଗନ୍ନାଥ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରିଆସୁଛି।",

    "today, shree jagannath temple remains one of odisha's most important religious and cultural centres. centuries-old rituals, festivals, mahaprasad traditions and the annual rath yatra continue to preserve odisha's living jagannath heritage.":
      "ଆଜି ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଧାର୍ମିକ ଓ ସାଂସ୍କୃତିକ କେନ୍ଦ୍ରମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ଶତାବ୍ଦୀ ପୁରୁଣା ଆଚାର-ବିଧି, ପର୍ବପର୍ବାଣୀ, ମହାପ୍ରସାଦ ପରମ୍ପରା ଏବଂ ବାର୍ଷିକ ରଥଯାତ୍ରା ଓଡ଼ିଶାର ଜୀବନ୍ତ ଜଗନ୍ନାଥ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରିଆସୁଛି।",
  };

  /* =======================================================
     TRANSLATE FUNCTION

     Whole paragraph first.
     If backend contains multiple paragraphs,
     translate each line separately.
  ======================================================= */

  const normalizedTranslations = useMemo(() => {
    const map: Record<string, string> = {};

    Object.entries(translations).forEach(([key, value]) => {
      map[normalize(key)] = value;
    });

    return map;
  }, []);

  const translationRules: Array<{
    includes: string;
    odia: string;
  }> = [
    {
      includes: "during the ancient kalinga period, the udayagiri and khandagiri hills developed",
      odia: "ପ୍ରାଚୀନ କଳିଙ୍ଗ ଯୁଗରେ ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ପାହାଡ଼ ଜୈନ ସନ୍ନ୍ୟାସୀମାନଙ୍କ ସହ ଜଡିତ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ କେନ୍ଦ୍ର ଭାବେ ବିକଶିତ ହୋଇଥିଲା। ଏଠାରେ ଶିଳାକଟା ଗୁମ୍ଫା, ଶିଳାଲେଖ, ମୂର୍ତ୍ତିକଳା ଓ କକ୍ଷଗୁଡ଼ିକ ତିଆରି କରାଯାଇଥିଲା।",
    },
    {
      includes: "during the eastern ganga dynasty, the great temple at puri developed",
      odia: "ପୂର୍ବ ଗଙ୍ଗ ବଂଶର ସମୟରେ ପୁରୀର ମହାନ ମନ୍ଦିର ଉପାସନା ଓ ସାଂସ୍କୃତିକ ଜୀବନର ଏକ ପ୍ରମୁଖ କେନ୍ଦ୍ର ଭାବେ ବିକଶିତ ହୋଇଥିଲା। ଏହି ମନ୍ଦିର ପ୍ରଭୁ ଜଗନ୍ନାଥ ଏବଂ ଓଡ଼ିଶାର ଧାର୍ମିକ ପରମ୍ପରା ସହ ଗଭୀର ଭାବେ ଜଡିତ ହୋଇଥିଲା।",
    },
    {
      includes: "today, the udayagiri and khandagiri caves remain important archaeological and cultural landmarks",
      odia: "ଆଜି ଉଦୟଗିରି ଓ ଖଣ୍ଡଗିରି ଗୁମ୍ଫାଗୁଡ଼ିକ ଓଡ଼ିଶାର ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ପୁରାତତ୍ତ୍ୱିକ ଓ ସାଂସ୍କୃତିକ ସ୍ଥଳ ଭାବେ ରହିଛି। ଏହାର ଶିଳାକଟା କକ୍ଷ, ଶିଳାଲେଖ, ମୂର୍ତ୍ତିକଳା ଏବଂ ଜୈନ ଐତିହ୍ୟ ଅଞ୍ଚଳର ପ୍ରାଚୀନ ଇତିହାସ ବିଷୟରେ ମୂଲ୍ୟବାନ ତଥ୍ୟ ଦେଇଥାଏ।",
    },
    {
      includes: "today, shree jagannath temple remains one of odisha's most important religious and cultural",
      odia: "ଆଜି ଶ୍ରୀ ଜଗନ୍ନାଥ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ଧାର୍ମିକ ଓ ସାଂସ୍କୃତିକ କେନ୍ଦ୍ରମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ଶତାବ୍ଦୀ ପୁରୁଣା ଆଚାର-ବିଧି, ପର୍ବପର୍ବାଣୀ, ମହାପ୍ରସାଦ ପରମ୍ପରା ଏବଂ ବାର୍ଷିକ ରଥଯାତ୍ରା ଜୀବନ୍ତ ଜଗନ୍ନାଥ ଐତିହ୍ୟକୁ ସଂରକ୍ଷଣ କରିଆସୁଛି।",
    },
    {
      includes: "raghurajpur developed as a traditional artisan village",
      odia: "ରଘୁରାଜପୁର ଏକ ପାରମ୍ପରିକ ଶିଳ୍ପୀ ଗ୍ରାମ ଭାବେ ବିକଶିତ ହୋଇଥିଲା, ଯେଉଁଠାରେ ପିଢ଼ି ପରେ ପିଢ଼ି ପରିବାରମାନେ ଓଡ଼ିଶାର ସ୍ୱଦେଶୀ କଳାରୂପଗୁଡ଼ିକୁ ଅଭ୍ୟାସ ଓ ସଂରକ୍ଷଣ କରିଆସୁଛନ୍ତି। ପଟ୍ଟଚିତ୍ର, ତାଳପତ୍ର ଖୋଦାକାମ, ମୁଖୋଷ ତିଆରି ଓ ଅନ୍ୟାନ୍ୟ ଶିଳ୍ପ ଗ୍ରାମର ଦୈନନ୍ଦିନ ଜୀବନ ଓ ସାଂସ୍କୃତିକ ପରିଚୟ ସହ ଗଭୀର ଭାବେ ଜଡିତ।",
    },
    {
      includes: "today, raghurajpur continues to thrive as a living heritage village",
      odia: "ଆଜି ରଘୁରାଜପୁର ଏକ ଜୀବନ୍ତ ଐତିହ୍ୟ ଗ୍ରାମ ଭାବେ ବିକଶିତ ହେଉଛି, ଯେଉଁଠାରେ ପାରମ୍ପରିକ କଳା ଓ ସାମୁଦାୟିକ ଜୀବନ ସହଅବସ୍ଥାନ କରୁଛି। ଶିଳ୍ପୀ ପରିବାରମାନେ ପଟ୍ଟଚିତ୍ର, ତାଳପତ୍ର ଖୋଦାକାମ, ମୁଖୋଷ ତିଆରି ଏବଂ ଅନ୍ୟାନ୍ୟ ପାରମ୍ପରିକ ଶିଳ୍ପକୁ ଅଭ୍ୟାସ କରିବା ସହ ଆଗାମୀ ପିଢ଼ି ପାଇଁ ଏହି ପରମ୍ପରାକୁ ସଂରକ୍ଷଣ କରୁଛନ୍ତି।",
    },
    {
      includes: "today, the konark sun temple stands as one of odisha's most important preserved heritage monuments",
      odia: "ଆଜି କୋଣାର୍କ ସୂର୍ଯ୍ୟ ମନ୍ଦିର ଓଡ଼ିଶାର ସବୁଠାରୁ ଗୁରୁତ୍ୱପୂର୍ଣ୍ଣ ସଂରକ୍ଷିତ ଐତିହ୍ୟ ସ୍ମାରକମାନଙ୍କ ମଧ୍ୟରୁ ଗୋଟିଏ। ମୂଳ ସଂରଚନାର କିଛି ଅଂଶ ସମୟ ସହିତ ନଷ୍ଟ ହୋଇଥିଲେ ମଧ୍ୟ ଏହାର ସ୍ଥାପତ୍ୟ, ମୂର୍ତ୍ତିକଳା ଓ ସାଂସ୍କୃତିକ ଐତିହ୍ୟ ସଂରକ୍ଷଣ ପାଇଁ ଚେଷ୍ଟା ଜାରି ରହିଛି।",
    },
  ];

  const translateOne = (text: string): string => {
    const key = normalize(text);

    if (normalizedTranslations[key]) {
      return normalizedTranslations[key];
    }

    const rule = translationRules.find(({ includes }) =>
      key.includes(normalize(includes))
    );

    if (rule) {
      return rule.odia;
    }

    return text;
  };

  const translateText = (
    value?: string | null
  ): string => {
    if (!value) {
      return "";
    }

    if (!isOdia) {
      return value;
    }

    const whole = translateOne(value);

    if (whole !== value) {
      return whole;
    }

    return value
      .split("\n")
      .map((line) => {
        if (!line.trim()) {
          return "";
        }

        return translateOne(line);
      })
      .join("\n");
  };

  /* =======================================================
     DATA
  ======================================================= */

  const [
    places,
    setPlaces,
  ] =
    useState<
      ExplorePlace[]
    >([]);

  const [
    eras,
    setEras,
  ] =
    useState<
      ExploreEra[]
    >([]);

  const [
    selectedPlace,
    setSelectedPlace,
  ] =
    useState<
      ExplorePlace | null
    >(null);

  const [
    searchQuery,
    setSearchQuery,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  /* =======================================================
     LOAD API
  ======================================================= */

  useEffect(() => {
    const loadData =
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );

          const [
            placeData,
            eraData,
          ] =
            await Promise.all([
              api.getExplorePlaces(),
              api.getExploreEras(),
            ]);

          const activePlaces =
            Array.isArray(
              placeData
            )
              ? [
                  ...placeData,
                ]
                  .filter(
                    (
                      place
                    ) =>
                      place.is_active
                  )
                  .sort(
                    (
                      a,
                      b
                    ) =>
                      a.display_order -
                      b.display_order
                  )
              : [];

          const orderedEras =
            Array.isArray(
              eraData
            )
              ? [
                  ...eraData,
                ].sort(
                  (
                    a,
                    b
                  ) => {
                    if (
                      a.order !==
                      b.order
                    ) {
                      return (
                        a.order -
                        b.order
                      );
                    }

                    return (
                      a.year -
                      b.year
                    );
                  }
                )
              : [];

          setPlaces(
            activePlaces
          );

          setEras(
            orderedEras
          );
        } catch (
          err
        ) {
          console.error(
            "Explore API error:",
            err
          );

          setError(
            isOdia
              ? "ହେରିଟେଜ୍ ହବ୍ ରୁ ଅନ୍ୱେଷଣ ତଥ୍ୟ ଲୋଡ୍ କରିହେଲା ନାହିଁ।"
              : "Unable to load Explore data from HeritageHub."
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadData();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredPlaces =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      if (!query) {
        return places;
      }

      return places.filter(
        (
          place
        ) => {
          const values = [
            place.name,
            place.district,
            place.short_description,
            place.culture_title,
            place.culture_description,
            place.food_title,
            place.food_description,

            translateText(
              place.name
            ),

            translateText(
              place.district
            ),

            translateText(
              place.short_description
            ),

            translateText(
              place.culture_title
            ),

            translateText(
              place.food_title
            ),
          ];

          return values.some(
            (
              value
            ) =>
              String(
                value ||
                ""
              )
                .toLowerCase()
                .includes(
                  query
                )
          );
        }
      );
    }, [
      places,
      searchQuery,
      language,
    ]);

  /* =======================================================
     AUDIO
  ======================================================= */

  const playAudio = (
    url: string
  ) => {
    const audio =
      new Audio(
        url
      );

    audio
      .play()
      .catch(
        (
          err
        ) => {
          console.error(
            "Audio error:",
            err
          );
        }
      );
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div
        className="
          min-h-screen

          flex
          items-center
          justify-center

          bg-[#faf9f5]
          dark:bg-[#12100f]
        "
      >
        <div className="text-center">
          <div
            className="
              w-10
              h-10

              border-4
              border-[#c4c7c7]

              border-t-[#94492d]

              rounded-full

              animate-spin

              mx-auto
            "
          />

          <p
            className="
              mt-4

              text-sm

              text-[#747878]
              dark:text-[#aaa69e]
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
    <div
      className="
        w-full
        min-h-screen

        bg-[#faf9f5]
        dark:bg-[#12100f]

        text-[#1b1c1a]
        dark:text-[#f5f1e8]

        transition-colors
        duration-300
      "
    >
      {/* ===================================================
          HEADER
      =================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto

          px-5
          md:px-16

          pt-12
          md:pt-20

          pb-10
        "
      >
        <span
          className="
            text-[11px]

            font-semibold
            uppercase
            tracking-[0.14em]

            text-[#94492d]
            dark:text-[#d88667]
          "
        >
          {t.pageLabel}
        </span>

        <h1
          className="
            text-[38px]
            md:text-[54px]
            lg:text-[62px]

            font-display
            font-bold

            mt-3
          "
        >
          {t.pageTitle}
        </h1>

        <p
          className="
            text-[16px]
            md:text-[17px]

            text-[#444748]
            dark:text-[#b9b5ad]

            max-w-2xl

            mt-4

            leading-relaxed
          "
        >
          {t.pageDescription}
        </p>

        <div
          className="
            relative
            max-w-2xl

            mt-9
          "
        >
          <Search
            className="
              absolute

              left-4
              top-1/2

              -translate-y-1/2

              w-4
              h-4

              text-[#747878]
            "
          />

          <input
            type="text"
            value={
              searchQuery
            }
            onChange={(
              event
            ) =>
              setSearchQuery(
                event.target.value
              )
            }
            placeholder={
              t.search
            }
            className="
              w-full

              pl-11
              pr-4
              py-4

              bg-white
              dark:bg-[#1c1917]

              border
              border-[#c4c7c7]
              dark:border-[#47443f]

              text-[#1b1c1a]
              dark:text-white

              placeholder:text-[#8b8b87]

              focus:outline-none
              focus:border-[#94492d]
            "
          />
        </div>
      </section>

      {/* ERROR */}

      {error && (
        <section
          className="
            max-w-[1440px]
            mx-auto

            px-5
            md:px-16
          "
        >
          <div
            className="
              p-4

              border
              border-red-200

              bg-red-50

              text-red-700
            "
          >
            {error}
          </div>
        </section>
      )}

      {/* ===================================================
          PLACES
      =================================================== */}

      <section
        className="
          max-w-[1440px]
          mx-auto

          px-5
          md:px-16

          pb-20
        "
      >
        <div
          className="
            flex
            items-center
            justify-between

            mb-7
          "
        >
          <span
            className="
              text-[12px]

              text-[#747878]
              dark:text-[#aaa69e]
            "
          >
            {t.showing}{" "}

            <strong
              className="
                text-[#1b1c1a]
                dark:text-white
              "
            >
              {
                filteredPlaces.length
              }
            </strong>

            {" "}

            {t.heritagePlaces}
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() =>
                setSearchQuery(
                  ""
                )
              }
              className="
                text-[12px]

                uppercase
                tracking-wider
                font-bold

                text-[#94492d]
              "
            >
              {t.clear}
            </button>
          )}
        </div>

        {filteredPlaces.length >
        0 ? (
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2

              gap-7
            "
          >
            {filteredPlaces.map(
              (
                place
              ) => (
                <article
                  key={
                    place.id
                  }
                  onClick={() =>
                    setSelectedPlace(
                      place
                    )
                  }
                  className="
                    bg-white
                    dark:bg-[#1c1917]

                    border
                    border-[#c4c7c7]/50
                    dark:border-white/10

                    overflow-hidden

                    cursor-pointer

                    group

                    hover:shadow-xl

                    transition-all
                  "
                >
                  <div
                    className="
                      h-[300px]
                      md:h-[360px]

                      overflow-hidden

                      bg-[#efeeea]
                      dark:bg-[#242321]
                    "
                  >
                    {place.main_image ? (
                      <img
                        src={
                          place.main_image
                        }
                        alt={
                          translateText(
                            place.name
                          )
                        }
                        className="
                          w-full
                          h-full

                          object-cover

                          transition-transform
                          duration-700

                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          w-full
                          h-full

                          flex
                          items-center
                          justify-center
                        "
                      >
                        <Landmark
                          className="
                            w-12
                            h-12

                            text-[#747878]
                          "
                        />
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      p-6
                      md:p-7
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-2

                        text-[#94492d]

                        text-[11px]
                        uppercase
                        tracking-wider
                        font-bold
                      "
                    >
                      <MapPin
                        className="
                          w-3.5
                          h-3.5
                        "
                      />

                      {
                        translateText(
                          place.district
                        )
                      }
                    </div>

                    <h2
                      className="
                        font-display

                        text-[27px]
                        font-bold

                        mt-2
                      "
                    >
                      {
                        translateText(
                          place.name
                        )
                      }
                    </h2>

                    <p
                      className="
                        text-[14px]

                        text-[#444748]
                        dark:text-[#b9b5ad]

                        leading-relaxed

                        mt-3

                        line-clamp-3
                      "
                    >
                      {
                        translateText(
                          place.short_description
                        )
                      }
                    </p>

                    <div
                      className="
                        mt-6
                        pt-4

                        border-t
                        border-[#e3e1dc]
                        dark:border-white/10

                        flex
                        items-center
                        justify-between
                      "
                    >
                      <span
                        className="
                          text-[11px]

                          text-[#747878]

                          uppercase
                          tracking-wider
                        "
                      >
                        {
                          place.eras
                            ?.length ||
                          0
                        }

                        {" "}

                        {
                          t.historicalEras
                        }
                      </span>

                      <span
                        className="
                          text-[#94492d]

                          text-[12px]
                          font-bold

                          uppercase
                          tracking-wider

                          flex
                          items-center
                          gap-1
                        "
                      >
                        {t.explore}

                        <ArrowRight
                          className="
                            w-4
                            h-4
                          "
                        />
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        ) : (
          <div
            className="
              border
              border-dashed
              border-[#c4c7c7]

              p-16

              text-center
            "
          >
            <Search
              className="
                w-8
                h-8

                mx-auto

                text-[#747878]
              "
            />

            <h3
              className="
                font-display
                text-xl
                font-bold

                mt-4
              "
            >
              {t.noPlaces}
            </h3>

            <p
              className="
                text-sm
                text-[#747878]

                mt-2
              "
            >
              {t.tryAnother}
            </p>
          </div>
        )}
      </section>

      {/* ===================================================
          GLOBAL TIMELINE
      =================================================== */}

      <section
        className="
          bg-[#1c1b1b]
          dark:bg-[#090908]

          text-white

          py-16
          md:py-20
        "
      >
        <div
          className="
            max-w-[1440px]
            mx-auto

            px-5
            md:px-16
          "
        >
          <span
            className="
              text-[11px]

              uppercase
              tracking-[0.15em]

              font-bold

              text-[#cca730]
            "
          >
            {t.timelineLabel}
          </span>

          <h2
            className="
              font-display

              text-[32px]
              md:text-[40px]

              font-bold

              mt-2
            "
          >
            {t.historicalEras}
          </h2>

          <p
            className="
              text-[#c4c7c7]

              text-sm

              mt-2
              mb-10
            "
          >
            {t.timelineDescription}
          </p>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-4

              gap-5
            "
          >
            {eras.map(
              (
                era
              ) => (
                <article
                  key={
                    era.id
                  }
                  className="
                    border
                    border-white/15

                    bg-white/5

                    overflow-hidden
                  "
                >
                  <div
                    className="
                      h-44
                      bg-[#292725]
                    "
                  >
                    {era.image && (
                      <img
                        src={
                          era.image
                        }
                        alt={
                          translateText(
                            era.era_name
                          )
                        }
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    )}
                  </div>

                  <div
                    className="
                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        items-center
                        gap-1.5

                        text-[#cca730]

                        text-[11px]
                        font-bold
                      "
                    >
                      <Calendar
                        className="
                          w-3.5
                          h-3.5
                        "
                      />

                      {era.year}
                    </div>

                    <h3
                      className="
                        font-display

                        text-lg
                        font-bold

                        mt-2
                      "
                    >
                      {
                        translateText(
                          era.era_name
                        )
                      }
                    </h3>

                    <p
                      className="
                        text-[#c4c7c7]

                        text-xs
                        leading-relaxed

                        mt-3

                        line-clamp-4
                      "
                    >
                      {
                        translateText(
                          era.description
                        )
                      }
                    </p>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </section>

      {/* ===================================================
          DETAIL MODAL
      =================================================== */}

      {selectedPlace && (
        <div
          className="
            fixed
            inset-0
            z-[100]

            bg-black/65
            backdrop-blur-sm

            overflow-y-auto

            flex
            items-start
            justify-center

            p-4
            md:p-10
          "
          onClick={() =>
            setSelectedPlace(
              null
            )
          }
        >
          <div
            onClick={(
              event
            ) =>
              event.stopPropagation()
            }
            className="
              relative

              w-full
              max-w-6xl

              min-h-[500px]

              bg-[#faf9f5]
              dark:bg-[#171614]

              text-[#1b1c1a]
              dark:text-[#f5f1e8]

              shadow-2xl
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              aria-label={
                t.close
              }
              onClick={() =>
                setSelectedPlace(
                  null
                )
              }
              className="
                absolute

                top-4
                right-4

                z-20

                w-10
                h-10

                rounded-full

                bg-black/70
                hover:bg-black

                text-white

                flex
                items-center
                justify-center
              "
            >
              <X
                className="
                  w-5
                  h-5
                "
              />
            </button>

            {/* MAIN IMAGE */}

            <div
              className="
                h-[320px]
                md:h-[500px]

                bg-[#1c1b1b]
              "
            >
              {selectedPlace.main_image ? (
                <img
                  src={
                    selectedPlace.main_image
                  }
                  alt={
                    translateText(
                      selectedPlace.name
                    )
                  }
                  className="
                    w-full
                    h-full

                    object-cover
                  "
                />
              ) : (
                <div
                  className="
                    w-full
                    h-full

                    flex
                    items-center
                    justify-center
                  "
                >
                  <Landmark
                    className="
                      w-16
                      h-16

                      text-white/30
                    "
                  />
                </div>
              )}
            </div>

            {/* INTRO */}

            <div
              className="
                px-6
                md:px-12

                py-10

                border-b
                border-[#c4c7c7]/50
                dark:border-white/10
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-1.5

                  text-[#94492d]

                  text-xs
                  uppercase
                  tracking-wider
                  font-bold
                "
              >
                <MapPin
                  className="
                    w-4
                    h-4
                  "
                />

                {
                  translateText(
                    selectedPlace.district
                  )
                }
              </div>

              <h2
                className="
                  font-display

                  text-[34px]
                  md:text-[48px]

                  font-bold

                  mt-2
                "
              >
                {
                  translateText(
                    selectedPlace.name
                  )
                }
              </h2>

              <p
                className="
                  text-[#444748]
                  dark:text-[#b9b5ad]

                  text-[16px]

                  leading-relaxed

                  max-w-3xl

                  mt-4

                  whitespace-pre-line
                "
              >
                {
                  translateText(
                    selectedPlace.short_description
                  )
                }
              </p>

              {selectedPlace.story_audio && (
                <button
                  type="button"
                  onClick={() =>
                    playAudio(
                      selectedPlace.story_audio!
                    )
                  }
                  className="
                    mt-6

                    px-5
                    py-3

                    bg-[#94492d]
                    hover:bg-[#773319]

                    text-white

                    text-xs
                    uppercase
                    tracking-wider
                    font-bold

                    flex
                    items-center
                    gap-2
                  "
                >
                  <Volume2
                    className="
                      w-4
                      h-4
                    "
                  />

                  {t.playAudio}
                </button>
              )}
            </div>

            {/* =================================================
                CULTURE
            ================================================= */}

            <section
              className="
                px-6
                md:px-12

                py-12

                grid
                grid-cols-1
                lg:grid-cols-2

                gap-10

                items-center
              "
            >
              <div>
                <span
                  className="
                    text-[11px]

                    uppercase
                    tracking-[0.14em]
                    font-bold

                    text-[#94492d]
                  "
                >
                  {t.culture}
                </span>

                <h3
                  className="
                    font-display

                    text-[28px]
                    md:text-[34px]

                    font-bold

                    mt-2
                  "
                >
                  {
                    translateText(
                      selectedPlace.culture_title
                    )
                  }
                </h3>

                <div
                  className="
                    text-[#444748]
                    dark:text-[#b9b5ad]

                    text-[14px]
                    md:text-[15px]

                    leading-[1.8]

                    mt-5

                    whitespace-pre-line
                  "
                >
                  {
                    translateText(
                      selectedPlace.culture_description
                    )
                  }
                </div>
              </div>

              <div
                className="
                  h-[350px]

                  bg-[#efeeea]
                  dark:bg-[#242321]
                "
              >
                {selectedPlace.culture_image && (
                  <img
                    src={
                      selectedPlace.culture_image
                    }
                    alt={
                      translateText(
                        selectedPlace.culture_title
                      )
                    }
                    className="
                      w-full
                      h-full

                      object-cover
                    "
                  />
                )}
              </div>
            </section>

            {/* =================================================
                FOOD
            ================================================= */}

            <section
              className="
                px-6
                md:px-12

                py-12

                bg-[#efeeea]
                dark:bg-[#201f1c]

                grid
                grid-cols-1
                lg:grid-cols-2

                gap-10

                items-center
              "
            >
              <div
                className="
                  h-[350px]

                  bg-white
                  dark:bg-[#292824]
                "
              >
                {selectedPlace.food_image && (
                  <img
                    src={
                      selectedPlace.food_image
                    }
                    alt={
                      translateText(
                        selectedPlace.food_title
                      )
                    }
                    className="
                      w-full
                      h-full

                      object-cover
                    "
                  />
                )}
              </div>

              <div>
                <span
                  className="
                    flex
                    items-center
                    gap-1

                    text-[11px]

                    uppercase
                    tracking-[0.14em]
                    font-bold

                    text-[#94492d]
                  "
                >
                  <Utensils
                    className="
                      w-3.5
                      h-3.5
                    "
                  />

                  {t.food}
                </span>

                <h3
                  className="
                    font-display

                    text-[28px]
                    md:text-[34px]

                    font-bold

                    mt-2
                  "
                >
                  {
                    translateText(
                      selectedPlace.food_title
                    )
                  }
                </h3>

                <div
                  className="
                    text-[#444748]
                    dark:text-[#b9b5ad]

                    text-[14px]
                    md:text-[15px]

                    leading-[1.8]

                    mt-5

                    whitespace-pre-line
                  "
                >
                  {
                    translateText(
                      selectedPlace.food_description
                    )
                  }
                </div>
              </div>
            </section>

            {/* =================================================
                PLACE TIMELINE
            ================================================= */}

            <section
              className="
                px-6
                md:px-12

                py-12
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                "
              >
                <Clock3
                  className="
                    w-5
                    h-5

                    text-[#94492d]
                  "
                />

                <span
                  className="
                    text-[11px]

                    uppercase
                    tracking-[0.14em]
                    font-bold

                    text-[#94492d]
                  "
                >
                  {t.timeline}
                </span>
              </div>

              <h3
                className="
                  font-display

                  text-[30px]
                  font-bold

                  mt-2
                  mb-8
                "
              >
                {t.historicalEras}
              </h3>

              <div
                className="
                  space-y-7
                "
              >
                {[
                  ...(
                    selectedPlace.eras ||
                    []
                  ),
                ]
                  .sort(
                    (
                      a,
                      b
                    ) =>
                      a.order -
                      b.order
                  )
                  .map(
                    (
                      era
                    ) => (
                      <div
                        key={
                          era.id
                        }
                        className="
                          grid
                          grid-cols-1
                          md:grid-cols-[220px_1fr]

                          gap-6

                          border-b
                          border-[#c4c7c7]/50
                          dark:border-white/10

                          pb-7
                        "
                      >
                        <div
                          className="
                            h-[150px]

                            bg-[#efeeea]
                            dark:bg-[#242321]
                          "
                        >
                          {era.image && (
                            <img
                              src={
                                era.image
                              }
                              alt={
                                translateText(
                                  era.era_name
                                )
                              }
                              className="
                                w-full
                                h-full

                                object-cover
                              "
                            />
                          )}
                        </div>

                        <div>
                          <div
                            className="
                              flex
                              items-center
                              gap-1

                              text-[#94492d]

                              text-xs
                              font-bold
                            "
                          >
                            <Calendar
                              className="
                                w-3.5
                                h-3.5
                              "
                            />

                            {era.year}
                          </div>

                          <h4
                            className="
                              font-display

                              text-xl
                              font-bold

                              mt-1
                            "
                          >
                            {
                              translateText(
                                era.era_name
                              )
                            }
                          </h4>

                          <p
                            className="
                              text-[#444748]
                              dark:text-[#b9b5ad]

                              text-sm
                              leading-relaxed

                              mt-3

                              whitespace-pre-line
                            "
                          >
                            {
                              translateText(
                                era.description
                              )
                            }
                          </p>
                        </div>
                      </div>
                    )
                  )}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;